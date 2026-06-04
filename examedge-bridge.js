// ExamEdge API ↔ localStorage bridge (offline-first sync)
const ExamEdgeBridge = {
  apiOnline: false,
  cachedQuestions: null,
  pendingAttempts: [],
  initPromise: null,

  init() {
    this.initPromise = this._init();
    return this.initPromise;
  },

  whenReady() {
    return this.initPromise || Promise.resolve();
  },

  async _init() {
    if (!window.EXAMEDGE_CONFIG?.useApi) {
      this.patchLogAttempt();
      return;
    }
    try {
      await ExamEdgeAPI.health();
      this.apiOnline = true;
      await this.loadQuestionsFromApi();
      await this.syncPending();
      if (ExamEdgeAPI.getToken()) {
        const me = await ExamEdgeAPI.getMe();
        if (me.user) ExamEdgeDB.loginFromApi({ ...me.user, ...(me.student || {}) }, ExamEdgeAPI.getToken());
      } else if (ExamEdgeDB.getUser()) {
        const resumed = await this.ensureApiSession();
        if (!resumed) window._needsApiReauth = true;
        else window._needsApiReauth = false;
      }
    } catch (e) {
      console.warn("[ExamEdge] API offline — using local question bank.", e.message);
      this.apiOnline = false;
    }
    this.patchLogAttempt();
  },

  async loadQuestionsFromApi() {
    try {
      const data = await ExamEdgeAPI.getQuestions({ limit: 500 });
      if (data.questions?.length) {
        this.cachedQuestions = data.questions;
        ExamEdgeDB.saveQuestions(data.questions);
      }
    } catch (e) {
      console.warn("[ExamEdge] Could not load questions from API", e.message);
    }
  },

  patchLogAttempt() {
    const original = ExamEdgeDB.logAttempt.bind(ExamEdgeDB);
    ExamEdgeDB.logAttempt = (questionId, isCorrect, timeTakenSeconds, questionObj) => {
      const result = original(questionId, isCorrect, timeTakenSeconds, questionObj);
      if (result?.success === false) return result;

      if (this.apiOnline && ExamEdgeAPI.getToken()) {
        ExamEdgeAPI.recordProgress({
          question_id: questionId,
          is_correct: isCorrect,
          time_taken_seconds: timeTakenSeconds,
        }).catch(() => {
          this.pendingAttempts.push({
            question_id: questionId,
            is_correct: isCorrect,
            time_taken_seconds: timeTakenSeconds,
            attempted_at: new Date().toISOString(),
          });
          localStorage.setItem(
            "EXAMEDGE_pending_sync",
            JSON.stringify(this.pendingAttempts)
          );
        });
      }
      return result;
    };
  },

  async syncPending() {
    const raw = localStorage.getItem("EXAMEDGE_pending_sync");
    if (!raw || !ExamEdgeAPI.getToken()) return;
    try {
      this.pendingAttempts = JSON.parse(raw);
      if (this.pendingAttempts.length) {
        await ExamEdgeAPI.syncProgress(this.pendingAttempts);
        localStorage.removeItem("EXAMEDGE_pending_sync");
        this.pendingAttempts = [];
      }
    } catch (e) {
      console.warn("[ExamEdge] Sync pending failed", e.message);
    }
  },

  async ensureApiSession() {
    if (ExamEdgeAPI.getToken()) return true;
    const user = ExamEdgeDB.getUser();
    if (!user?.phone || !this.apiOnline) return false;
    try {
      const phone = user.phone.replace(/^\+234/, "").replace(/\D/g, "");
      const res = await ExamEdgeAPI.resumeSession(phone, user.name, user.school_name, user.role);
      ExamEdgeDB.loginFromApi(res.user, res.token);
      return true;
    } catch (e) {
      console.warn("[ExamEdge] Could not resume API session:", e.message);
      return false;
    }
  },

  async downloadOfflineSubject(subject) {
    const data = await ExamEdgeAPI.downloadSubjectBundle(subject);
    const cacheKey = `EXAMEDGE_offline_${subject}`;
    localStorage.setItem(cacheKey, JSON.stringify(data.questions));
    if ("caches" in window) {
      const cache = await caches.open("examedge-offline-bundles");
      await cache.put(
        `/offline-bundle/${encodeURIComponent(subject)}`,
        new Response(JSON.stringify(data.questions), {
          headers: { "Content-Type": "application/json" },
        })
      );
    }
    return data.count;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  ExamEdgeBridge.init();
});
