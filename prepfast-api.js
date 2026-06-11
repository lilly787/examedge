// PrepFast API client — connects PWA to Node/PostgreSQL backend
const PrepFastAPI = {
  getToken() {
    return localStorage.getItem("prepfast_token");
  },

  setToken(token) {
    if (token) localStorage.setItem("prepfast_token", token);
    else localStorage.removeItem("prepfast_token");
  },

  async request(path, options = {}) {
    const base = window.PREPFAST_CONFIG?.apiBase || "/api";
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    const token = PrepFastAPI.getToken();
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
    return PrepFastAPI.request("/health");
  },

  async sendOtp(phone) {
    return PrepFastAPI.request("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(phone, code, profile) {
    return PrepFastAPI.request("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code, profile }),
    });
  },

  async resumeSession(phone, name, schoolName, role) {
    return PrepFastAPI.request("/auth/session/resume", {
      method: "POST",
      body: JSON.stringify({ phone, name, school_name: schoolName, role }),
    });
  },

  async generateStudyPlanLocal(examDate, subjects, hoursPerDay) {
    return PrepFastAPI.request("/ai/study-plan/local", {
      method: "POST",
      body: JSON.stringify({
        exam_date: examDate,
        subjects,
        hours_per_day: hoursPerDay,
      }),
    });
  },

  async getMe() {
    return PrepFastAPI.request("/auth/me");
  },

  async getQuestions(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return PrepFastAPI.request(`/questions?${qs}`);
  },

  async getQuestionStats() {
    return PrepFastAPI.request("/questions/stats");
  },

  async recordProgress(payload) {
    return PrepFastAPI.request("/progress", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async syncProgress(attempts) {
    return PrepFastAPI.request("/progress/sync", {
      method: "POST",
      body: JSON.stringify({ attempts }),
    });
  },

  async getWeakness(studentId) {
    const q = studentId ? `?student_id=${studentId}` : "";
    return PrepFastAPI.request(`/progress/analytics/weakness${q}`);
  },

  async getReadiness(studentId) {
    const q = studentId ? `?student_id=${studentId}` : "";
    return PrepFastAPI.request(`/progress/analytics/readiness${q}`);
  },

  async askTutor(questionId, studentAnswer, message) {
    return PrepFastAPI.request("/ai/tutor", {
      method: "POST",
      body: JSON.stringify({
        question_id: questionId,
        student_answer: studentAnswer,
        message,
      }),
    });
  },

  async generateStudyPlan(examDate, subjects, hoursPerDay) {
    return PrepFastAPI.request("/ai/study-plan", {
      method: "POST",
      body: JSON.stringify({
        exam_date: examDate,
        subjects,
        hours_per_day: hoursPerDay,
      }),
    });
  },

  async getLatestStudyPlan() {
    return PrepFastAPI.request("/ai/study-plan/latest");
  },

  async initPayment(plan) {
    return PrepFastAPI.request("/payments/initialize", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  async verifyPayment(reference) {
    return PrepFastAPI.request(`/payments/verify/${reference}`);
  },

  async devActivatePremium(plan) {
    return PrepFastAPI.request("/payments/dev-activate", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  async joinWaitlist(payload) {
    return PrepFastAPI.request("/waitlist", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getWaitlistCount() {
    return PrepFastAPI.request("/waitlist/count");
  },

  async downloadSubjectBundle(subject) {
    return PrepFastAPI.request(`/offline/bundle/${encodeURIComponent(subject)}`);
  },

  async getLeaderboard(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return PrepFastAPI.request(`/gamification/leaderboard?${qs}`);
  },

  async saveMood(mood, sessionType) {
    return PrepFastAPI.request("/gamification/mood", {
      method: "POST",
      body: JSON.stringify({ mood, session_type: sessionType }),
    });
  },

  async whatsappSimulate(from, body) {
    return PrepFastAPI.request("/whatsapp/simulate", {
      method: "POST",
      body: JSON.stringify({ from, body }),
    });
  },

  // Parent portal
  async linkChild(code) {
    return PrepFastAPI.request("/parents/link", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  async getChildren() {
    return PrepFastAPI.request("/parents/children");
  },

  async getChildReport(studentId) {
    return PrepFastAPI.request(`/parents/reports/${studentId}`);
  },

  // Teacher portal
  async getClasses() {
    return PrepFastAPI.request("/teachers/classes");
  },

  async createClass(data) {
    return PrepFastAPI.request("/teachers/classes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getClassStudents(classId) {
    return PrepFastAPI.request(`/teachers/classes/${classId}/students`);
  },

  async createAssignment(data) {
    return PrepFastAPI.request("/teachers/assignments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getClassAnalytics(classId) {
    return PrepFastAPI.request(`/teachers/analytics/class/${classId}`);
  },

  async getClassAnalyticsEnriched(classId) {
    return PrepFastAPI.request(`/teachers/classes/${classId}/analytics`);
  },

  async getAtRiskStudents() {
    return PrepFastAPI.request("/teachers/at-risk-students");
  },

  async sendStudentNudge(studentId) {
    return PrepFastAPI.request(`/teachers/students/${studentId}/nudge`, {
      method: "POST",
    });
  },

  async getAssignmentResults(assignmentId) {
    return PrepFastAPI.request(`/teachers/assignments/${assignmentId}/results`);
  },

  async linkChildPhone(child_phone) {
    return PrepFastAPI.request("/parents/link-child", {
      method: "POST",
      body: JSON.stringify({ child_phone }),
    });
  },

  // Admin specific APIs
  async adminLogin(password) {
    return PrepFastAPI.request("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  async getUsers() {
    return PrepFastAPI.request("/users");
  },

  async updateUserRole(userId, role) {
    return PrepFastAPI.request(`/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  },

  async deleteUser(userId) {
    return PrepFastAPI.request(`/users/${userId}`, {
      method: "DELETE",
    });
  },

  async addQuestion(question) {
    return PrepFastAPI.request("/questions", {
      method: "POST",
      body: JSON.stringify(question),
    });
  },

  async deleteQuestion(questionId) {
    return PrepFastAPI.request(`/questions/${questionId}`, {
      method: "DELETE",
    });
  },
};

const ExamEdgeAPI = PrepFastAPI;
if (typeof window !== "undefined") {
  window.PrepFastAPI = PrepFastAPI;
  window.ExamEdgeAPI = ExamEdgeAPI;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PrepFastAPI, ExamEdgeAPI };
}
