// ExamEdge Phase 1–2 feature integrations (auth, Paystack, AI, study planner, WhatsApp)

// ——— Auth (real OTP via API) ———
const _triggerOTPSending = window.triggerOTPSending;
window.triggerOTPSending = async function triggerOTPSendingApi() {
  const phone = document.getElementById("auth-phone-input")?.value.trim();
  const name = document.getElementById("auth-name-input")?.value.trim();
  if (!phone || phone.length < 9 || !name || name.length < 3) {
    showToast("Please enter a valid name and phone number!", "error");
    return;
  }
  window._authPending = { phone, name };

  if (window.EXAMEDGE_CONFIG?.useApi) await ExamEdgeBridge.whenReady();

  if (ExamEdgeBridge?.apiOnline) {
    try {
      const res = await ExamEdgeAPI.sendOtp(phone);
      if (res.devCode) {
        showSMSBanner(`[ExamEdge OTP] Verification code: ${res.devCode}`);
      } else {
        showSMSBanner(`[SMS] Verification code sent to +234 ${phone}`);
      }
      document.getElementById("auth-phone-screen")?.classList.add("hidden");
      document.getElementById("auth-otp-screen")?.classList.remove("hidden");
      showToast("OTP sent!", "success");
      return;
    } catch (e) {
      showToast(e.message || "OTP send failed", "error");
    }
  }
  if (typeof _triggerOTPSending === "function") _triggerOTPSending();
};

const _verifyOTPCode = window.verifyOTPCode;
window.verifyOTPCode = async function verifyOTPCodeApi() {
  const digits = document.querySelectorAll(".otp-digit");
  let entered = "";
  digits.forEach((d) => (entered += d.value.trim()));
  if (entered.length < 4) {
    showToast("Please enter a 4-digit verification code!", "error");
    return;
  }

  const pending = window._authPending || {};
  const phone =
    pending.phone || document.getElementById("auth-phone-input")?.value.trim();
  const name =
    pending.name || document.getElementById("auth-name-input")?.value.trim();

  if (window.EXAMEDGE_CONFIG?.useApi) await ExamEdgeBridge.whenReady();

  if (ExamEdgeBridge?.apiOnline) {
    try {
      const res = await ExamEdgeAPI.verifyOtp(phone, entered, {
        name,
        role: "student",
        ss_class: "SS3",
        subjects: [
          "Mathematics",
          "English Language",
          "Biology",
          "Chemistry",
          "Physics",
        ],
        exam_target: "WAEC",
      });
      ExamEdgeDB.loginFromApi(res.user, res.token);
      window._needsApiReauth = false;
      showToast(`Welcome, ${res.user.name}!`, "success");
      navigate("dashboard");
      return;
    } catch (e) {
      showToast(e.message || "Invalid code", "error");
      return;
    }
  }
  if (typeof _verifyOTPCode === "function") {
    _verifyOTPCode();
    if (ExamEdgeBridge?.apiOnline) {
      setTimeout(() => ExamEdgeBridge.ensureApiSession(), 500);
    }
  }
};

// ——— Paystack ———
window.openPaystackSim = async function openPaystackReal() {
  const overlay = document.getElementById("paystack-sim-overlay");
  if (!overlay) return;

  if (!ExamEdgeAPI.getToken()) {
    showToast("Please log in first", "error");
    navigate("auth");
    return;
  }

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  overlay.innerHTML = `<div class="text-white text-center p-8">Initializing Paystack…</div>`;

  try {
    const init = await ExamEdgeAPI.initPayment("monthly");

    if (init.simulated || !init.authorization_url) {
      overlay.innerHTML = `
        <div class="bg-[#12101f] border border-indigo-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <h3 class="text-xl font-bold text-white mb-2">Dev Payment Mode</h3>
          <p class="text-gray-400 text-sm mb-6">Paystack keys not set. Activate Premium for testing?</p>
          <button onclick="ExamEdgeFeatures.devActivatePremium()" class="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl mb-3">Activate Premium (Dev)</button>
          <button onclick="closePaystackSim()" class="text-indigo-400 text-sm">Cancel</button>
        </div>`;
      return;
    }

    window.location.href = init.authorization_url;
  } catch (e) {
    overlay.innerHTML = `<div class="text-rose-400 p-6">${e.message}</div>`;
  }
};

const SUBJECT_ID_TO_NAME = {
  math: "Mathematics",
  english: "English Language",
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
  economics: "Economics",
  government: "Government",
  literature: "Literature",
  agric: "Agricultural Science",
  commerce: "Commerce",
};

function normalizePlannerSubjects(subjects) {
  if (!Array.isArray(subjects) || !subjects.length) {
    return [
      "Mathematics",
      "English Language",
      "Biology",
      "Chemistry",
      "Physics",
    ];
  }
  return subjects.map((s) => SUBJECT_ID_TO_NAME[s] || s);
}

function buildLocalStudyPlan(examDate, subjects, hoursPerDay) {
  const plan = [];
  const end = new Date(examDate || Date.now() + 60 * 86400000);
  const start = new Date();
  let day = 0;
  const subjList = normalizePlannerSubjects(subjects);

  while (start <= end && day < 60) {
    const d = new Date(start);
    d.setDate(d.getDate() + day);
    const subject = subjList[day % subjList.length];
    plan.push({
      date: d.toISOString().split("T")[0],
      subject,
      topics: ["General revision", "Past questions"],
      question_count_target: Math.min(30, (hoursPerDay || 2) * 10),
    });
    day++;
  }
  return plan;
}

const ExamEdgeFeatures = {
  async ensureApiSession() {
    if (ExamEdgeAPI.getToken()) return true;
    if (ExamEdgeBridge?.apiOnline) {
      const ok = await ExamEdgeBridge.ensureApiSession();
      if (ok) return true;
    }
    return false;
  },

  async devActivatePremium() {
    try {
      await ExamEdgeAPI.devActivatePremium("monthly");
      ExamEdgeDB.upgradeToPremium();
      closePaystackSim(true);
      showToast("Premium activated!", "success");
      navigate("dashboard");
    } catch (e) {
      showToast(e.message, "error");
    }
  },

  async checkPaymentReturn() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") || params.get("trxref");
    if (!ref) return;
    try {
      await ExamEdgeAPI.verifyPayment(ref);
      ExamEdgeDB.upgradeToPremium();
      showToast("Payment successful — Premium unlocked!", "success");
      window.history.replaceState({}, "", "index.html");
    } catch (e) {
      showToast("Payment verification failed", "error");
    }
  },
};

// ——— AI Tutor ———
window.openAiTutor = async function openAiTutor(questionId) {
  const q = ExamEdgeDB.getQuestions().find((item) => item.id === questionId);
  if (!q) return;
  const idx = PRACTICE_SESSION.currentIndex;
  const studentAnswer = PRACTICE_SESSION.selectedAnswers[idx] || "";

  let overlay = document.getElementById("ai-tutor-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "ai-tutor-overlay";
    overlay.className =
      "fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4";
    document.body.appendChild(overlay);
  }
  overlay.classList.remove("hidden");
  overlay.innerHTML = `
    <div class="bg-[#12101f] border border-indigo-500/30 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
      <div class="p-4 border-b border-indigo-900/50 flex justify-between items-center">
        <h3 class="font-bold text-white">🤖 ExamEdge AI Tutor</h3>
        <button onclick="document.getElementById('ai-tutor-overlay').classList.add('hidden')" class="text-gray-400 hover:text-white">&times;</button>
      </div>
      <div id="ai-tutor-body" class="p-4 overflow-y-auto text-sm text-gray-300">Thinking…</div>
      <div class="p-3 border-t border-indigo-900/50 flex gap-2">
        <input id="ai-tutor-input" type="text" placeholder="Ask a follow-up…" class="flex-1 bg-indigo-950/40 border border-indigo-900/60 rounded-xl px-3 py-2 text-white text-sm">
        <button onclick="ExamEdgeFeatures.sendTutorFollowUp('${questionId}')" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Send</button>
      </div>
    </div>`;

  window._aiTutorQuestionId = questionId;
  try {
    const res = await ExamEdgeAPI.askTutor(questionId, studentAnswer, null);
    document.getElementById("ai-tutor-body").innerHTML = `<p class="whitespace-pre-wrap">${res.text}</p>`;
  } catch (e) {
    document.getElementById("ai-tutor-body").innerHTML = `<p class="text-amber-400">${e.message}. Upgrade to Premium or set ANTHROPIC_API_KEY.</p><p class="mt-3 text-gray-400">${q.explanation}</p>`;
  }
};

ExamEdgeFeatures.sendTutorFollowUp = async function (questionId) {
  const msg = document.getElementById("ai-tutor-input")?.value.trim();
  if (!msg) return;
  const idx = PRACTICE_SESSION.currentIndex;
  const studentAnswer = PRACTICE_SESSION.selectedAnswers[idx] || "";
  document.getElementById("ai-tutor-body").textContent = "Thinking…";
  try {
    const res = await ExamEdgeAPI.askTutor(questionId, studentAnswer, msg);
    document.getElementById("ai-tutor-body").innerHTML = `<p class="whitespace-pre-wrap">${res.text}</p>`;
  } catch (e) {
    document.getElementById("ai-tutor-body").textContent = e.message;
  }
};

// ——— Study Planner ———
function renderStudyPlannerView() {
  const container = document.getElementById("view-study-planner");
  if (!container) return;
  const user = ExamEdgeDB.getUser();
  const needsSignIn =
    window.EXAMEDGE_CONFIG?.useApi &&
    window._needsApiReauth &&
    !ExamEdgeAPI.getToken();

  container.innerHTML = `
    <div class="mb-8">
      <h2 class="text-2xl font-black text-white flex items-center gap-2">${iconHtml("calendar-days", "w-6 h-6 text-indigo-400")} Study Planner</h2>
      <p class="text-gray-400 text-sm mt-1">Day-by-day revision schedule until your exam</p>
    </div>
    ${
      needsSignIn
        ? `<div class="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-100 text-sm">
            Sign in with your phone number to save and generate AI study plans.
            <button onclick="navigate('auth')" class="ml-2 underline font-semibold text-amber-300">Sign in</button>
          </div>`
        : ""
    }
    <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 mb-6 grid gap-4 md:grid-cols-3">
      <div>
        <label class="text-xs text-gray-400 uppercase font-bold">Exam date</label>
        <input type="date" id="planner-exam-date" value="${(user.exam_date || "").toString().slice(0, 10)}" class="w-full mt-1 bg-indigo-950/40 border border-indigo-900/60 rounded-xl px-3 py-2 text-white">
      </div>
      <div>
        <label class="text-xs text-gray-400 uppercase font-bold">Hours per day</label>
        <input type="number" id="planner-hours" value="2" min="1" max="8" class="w-full mt-1 bg-indigo-950/40 border border-indigo-900/60 rounded-xl px-3 py-2 text-white">
      </div>
      <div class="flex items-end">
        <button onclick="ExamEdgeFeatures.generatePlan()" class="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold py-2.5 rounded-xl">Generate Plan</button>
      </div>
    </div>
    <div id="planner-auth-hint" class="hidden mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs"></div>
    <div id="planner-calendar" class="space-y-2"></div>`;

  if (!ExamEdgeAPI.getToken()) {
    const hint = document.getElementById("planner-auth-hint");
    if (hint) {
      hint.classList.remove("hidden");
      hint.innerHTML =
        'You are using offline login. Click <button type="button" onclick="ExamEdgeFeatures.ensureApiSession().then(ok => showToast(ok ? \"Connected!\" : \"Could not connect\", ok ? \"success\" : \"error\"))" class="underline font-bold">Connect account</button> or sign out and log in again with OTP.';
    }
  }

  ExamEdgeFeatures.loadExistingPlan();
  refreshIcons();
}

ExamEdgeFeatures.generatePlan = async function () {
  const user = ExamEdgeDB.getUser();
  if (!user) {
    showToast("Please log in first", "error");
    navigate("auth");
    return;
  }
  const examDate = document.getElementById("planner-exam-date")?.value;
  const hours = parseInt(document.getElementById("planner-hours")?.value || "2", 10);
  const subjects = normalizePlannerSubjects(user.subjects);

  if (!examDate) {
    showToast("Please choose an exam date", "error");
    return;
  }

  const btn = document.querySelector("#view-study-planner button[onclick*='generatePlan']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Generating…";
  }

  if (window.EXAMEDGE_CONFIG?.useApi) await ExamEdgeBridge.whenReady();

  let plan = null;

  if (ExamEdgeBridge?.apiOnline) {
    try {
      const localRes = await ExamEdgeAPI.generateStudyPlanLocal(examDate, subjects, hours);
      plan = localRes.plan;
    } catch (_) {}
  }

  if (!plan?.length) {
    plan = buildLocalStudyPlan(examDate, subjects, hours);
  }

  if (ExamEdgeAPI.getToken()) {
    try {
      await ExamEdgeAPI.generateStudyPlan(examDate, subjects, hours);
      window._needsApiReauth = false;
      document.getElementById("planner-auth-hint")?.classList.add("hidden");
    } catch (_) {}
  } else {
    await ExamEdgeFeatures.ensureApiSession();
  }

  ExamEdgeFeatures.renderPlanCalendar(plan);
  localStorage.setItem(
    "EXAMEDGE_study_plan",
    JSON.stringify({ plan, exam_date: examDate })
  );
  if (user.exam_date !== examDate) {
    ExamEdgeDB.updateUser({ exam_date: examDate });
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Generate Plan";
  }
  showToast("Your study plan is ready", "success");
};

ExamEdgeFeatures.loadExistingPlan = async function () {
  const saved = localStorage.getItem("EXAMEDGE_study_plan");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.plan) ExamEdgeFeatures.renderPlanCalendar(data.plan);
    } catch (_) {}
  }

  if (!ExamEdgeAPI.getToken()) return;
  try {
    const res = await ExamEdgeAPI.getLatestStudyPlan();
    if (res.plan) ExamEdgeFeatures.renderPlanCalendar(res.plan);
  } catch (_) {}
};

ExamEdgeFeatures.renderPlanCalendar = function (plan) {
  const el = document.getElementById("planner-calendar");
  if (!el || !plan?.length) return;
  el.innerHTML = plan
    .slice(0, 30)
    .map(
      (day) => `
    <div class="glass-panel p-4 rounded-xl border border-indigo-500/10 flex flex-wrap justify-between gap-2">
      <div><span class="text-indigo-400 font-bold text-sm">${day.date}</span>
        <span class="text-white font-semibold ml-2">${day.subject}</span></div>
      <div class="text-xs text-gray-400">${(day.topics || []).join(", ")} · ${day.question_count_target || 20} questions</div>
    </div>`
    )
    .join("");
};

// ——— WhatsApp API ———
const _sendWhatsAppMessage = window.sendWhatsAppMessage;
window.sendWhatsAppMessage = async function sendWhatsAppApi() {
  const input = document.getElementById("whatsapp-input-field");
  const txt = input?.value.trim().toUpperCase();
  if (!txt) return;

  if (ExamEdgeBridge?.apiOnline) {
    try {
      const res = await ExamEdgeAPI.whatsappSimulate("2348000000000", txt);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      WHATSAPP_SESSION.messages.push({ sender: "student", text: txt, time: timeStr });
      WHATSAPP_SESSION.messages.push({
        sender: "bot",
        text: res.reply.replace(/\n/g, "<br>"),
        time: timeStr,
      });
      input.value = "";
      renderWhatsAppMessages();
      return;
    } catch (_) {}
  }
  if (typeof _sendWhatsAppMessage === "function") _sendWhatsAppMessage();
};

// ——— Offline download ———
window.downloadSubjectOffline = async function (subject) {
  try {
    const count = await ExamEdgeBridge.downloadOfflineSubject(subject);
    showToast(`Downloaded ${count} ${subject} questions for offline use`, "success");
  } catch (e) {
    if (e.data?.upgrade) openPaystackSim();
    else showToast(e.message, "error");
  }
};

// ——— Mood check-in ———
window.saveMoodCheckin = async function (mood) {
  if (ExamEdgeAPI.getToken()) {
    try {
      await ExamEdgeAPI.saveMood(mood, "practice");
    } catch (_) {}
  }
  showToast("Mood saved — keep going!", "success");
};

document.addEventListener("DOMContentLoaded", () => {
  ExamEdgeFeatures.checkPaymentReturn();
});
