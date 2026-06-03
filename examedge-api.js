// ExamEdge API client — connects PWA to Node/PostgreSQL backend
const ExamEdgeAPI = {
  getToken() {
    return localStorage.getItem("EXAMEDGE_token");
  },

  setToken(token) {
    if (token) localStorage.setItem("EXAMEDGE_token", token);
    else localStorage.removeItem("EXAMEDGE_token");
  },

  async request(path, options = {}) {
    const base = window.EXAMEDGE_CONFIG?.apiBase || "/api";
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    const token = ExamEdgeAPI.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${base}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || res.statusText);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  },

  async health() {
    return ExamEdgeAPI.request("/health");
  },

  async sendOtp(phone) {
    return ExamEdgeAPI.request("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(phone, code, profile) {
    return ExamEdgeAPI.request("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code, profile }),
    });
  },

  async resumeSession(phone, name, schoolName, role) {
    return ExamEdgeAPI.request("/auth/session/resume", {
      method: "POST",
      body: JSON.stringify({ phone, name, school_name: schoolName, role }),
    });
  },

  async generateStudyPlanLocal(examDate, subjects, hoursPerDay) {
    return ExamEdgeAPI.request("/ai/study-plan/local", {
      method: "POST",
      body: JSON.stringify({
        exam_date: examDate,
        subjects,
        hours_per_day: hoursPerDay,
      }),
    });
  },

  async getMe() {
    return ExamEdgeAPI.request("/auth/me");
  },

  async getQuestions(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return ExamEdgeAPI.request(`/questions?${qs}`);
  },

  async getQuestionStats() {
    return ExamEdgeAPI.request("/questions/stats");
  },

  async recordProgress(payload) {
    return ExamEdgeAPI.request("/progress", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async syncProgress(attempts) {
    return ExamEdgeAPI.request("/progress/sync", {
      method: "POST",
      body: JSON.stringify({ attempts }),
    });
  },

  async getWeakness(studentId) {
    const q = studentId ? `?student_id=${studentId}` : "";
    return ExamEdgeAPI.request(`/progress/analytics/weakness${q}`);
  },

  async getReadiness(studentId) {
    const q = studentId ? `?student_id=${studentId}` : "";
    return ExamEdgeAPI.request(`/progress/analytics/readiness${q}`);
  },

  async askTutor(questionId, studentAnswer, message) {
    return ExamEdgeAPI.request("/ai/tutor", {
      method: "POST",
      body: JSON.stringify({
        question_id: questionId,
        student_answer: studentAnswer,
        message,
      }),
    });
  },

  async generateStudyPlan(examDate, subjects, hoursPerDay) {
    return ExamEdgeAPI.request("/ai/study-plan", {
      method: "POST",
      body: JSON.stringify({
        exam_date: examDate,
        subjects,
        hours_per_day: hoursPerDay,
      }),
    });
  },

  async getLatestStudyPlan() {
    return ExamEdgeAPI.request("/ai/study-plan/latest");
  },

  async initPayment(plan) {
    return ExamEdgeAPI.request("/payments/initialize", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  async verifyPayment(reference) {
    return ExamEdgeAPI.request(`/payments/verify/${reference}`);
  },

  async devActivatePremium(plan) {
    return ExamEdgeAPI.request("/payments/dev-activate", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  async joinWaitlist(payload) {
    return ExamEdgeAPI.request("/waitlist", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getWaitlistCount() {
    return ExamEdgeAPI.request("/waitlist/count");
  },

  async downloadSubjectBundle(subject) {
    return ExamEdgeAPI.request(`/offline/bundle/${encodeURIComponent(subject)}`);
  },

  async getLeaderboard(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return ExamEdgeAPI.request(`/gamification/leaderboard?${qs}`);
  },

  async saveMood(mood, sessionType) {
    return ExamEdgeAPI.request("/gamification/mood", {
      method: "POST",
      body: JSON.stringify({ mood, session_type: sessionType }),
    });
  },

  async whatsappSimulate(from, body) {
    return ExamEdgeAPI.request("/whatsapp/simulate", {
      method: "POST",
      body: JSON.stringify({ from, body }),
    });
  },

  // Parent portal
  async linkChild(code) {
    return ExamEdgeAPI.request("/parents/link", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  async getChildren() {
    return ExamEdgeAPI.request("/parents/children");
  },

  async getChildReport(studentId) {
    return ExamEdgeAPI.request(`/parents/reports/${studentId}`);
  },

  // Teacher portal
  async getClasses() {
    return ExamEdgeAPI.request("/teachers/classes");
  },

  async createClass(data) {
    return ExamEdgeAPI.request("/teachers/classes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getClassStudents(classId) {
    return ExamEdgeAPI.request(`/teachers/classes/${classId}/students`);
  },

  async createAssignment(data) {
    return ExamEdgeAPI.request("/teachers/assignments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
