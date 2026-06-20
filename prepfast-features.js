// PrepFast Phase 1–2 feature integrations (auth, Paystack, AI, study planner, WhatsApp)

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

  if (window.PREPFAST_CONFIG?.useApi) await PrepFastBridge.whenReady();

  if (PrepFastBridge?.apiOnline) {
    try {
      const res = await PrepFastAPI.sendOtp(phone);
      if (res.devCode) {
        showSMSBanner(`[PrepFast OTP] Verification code: ${res.devCode}`);
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

  if (window.PREPFAST_CONFIG?.useApi) await PrepFastBridge.whenReady();

  if (PrepFastBridge?.apiOnline) {
    try {
      const res = await PrepFastAPI.verifyOtp(phone, entered, {
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
      PrepFastDB.loginFromApi(res.user, res.token);
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
    if (PrepFastBridge?.apiOnline) {
      setTimeout(() => PrepFastBridge.ensureApiSession(), 500);
    }
  }
};

// ——— Paystack ———
window.openPaystackSim = async function openPaystackReal() {
  const overlay = document.getElementById("paystack-sim-overlay");
  if (!overlay) return;

  if (!PrepFastAPI.getToken()) {
    showToast("Please log in first", "error");
    navigate("auth");
    return;
  }

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  overlay.innerHTML = `<div class="text-white text-center p-8">Initializing Paystack…</div>`;

  try {
    const init = await PrepFastAPI.initPayment("monthly");

    if (init.simulated || !init.authorization_url) {
      overlay.innerHTML = `
        <div class="bg-[#12101f] border border-indigo-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <h3 class="text-xl font-bold text-white mb-2">Dev Payment Mode</h3>
          <p class="text-gray-400 text-sm mb-6">Paystack keys not set. Activate Premium for testing?</p>
          <button onclick="PrepFastFeatures.devActivatePremium()" class="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl mb-3">Activate Premium (Dev)</button>
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

const PrepFastFeatures = {
  async ensureApiSession() {
    if (PrepFastAPI.getToken()) return true;
    if (PrepFastBridge?.apiOnline) {
      const ok = await PrepFastBridge.ensureApiSession();
      if (ok) return true;
    }
    return false;
  },

  async devActivatePremium() {
    try {
      await PrepFastAPI.devActivatePremium("monthly");
      PrepFastDB.upgradeToPremium();
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
      await PrepFastAPI.verifyPayment(ref);
      PrepFastDB.upgradeToPremium();
      showToast("Payment successful — Premium unlocked!", "success");
      window.history.replaceState({}, "", "index.html");
    } catch (e) {
      showToast("Payment verification failed", "error");
    }
  },
};

// ——— AI Tutor ———
window.openAiTutor = async function openAiTutor(questionId) {
  const q = PrepFastDB.getQuestions().find((item) => item.id === questionId);
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
        <h3 class="font-bold text-white">🤖 PrepFast AI Tutor</h3>
        <button onclick="document.getElementById('ai-tutor-overlay').classList.add('hidden')" class="text-gray-400 hover:text-white">&times;</button>
      </div>
      <div id="ai-tutor-body" class="p-4 overflow-y-auto text-sm text-gray-300">Thinking…</div>
      <div class="p-3 border-t border-indigo-900/50 flex gap-2">
        <input id="ai-tutor-input" type="text" placeholder="Ask a follow-up…" class="flex-1 bg-indigo-950/40 border border-indigo-900/60 rounded-xl px-3 py-2 text-white text-sm">
        <button onclick="PrepFastFeatures.sendTutorFollowUp('${questionId}')" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Send</button>
      </div>
    </div>`;

  window._aiTutorQuestionId = questionId;
  try {
    const res = await PrepFastAPI.askTutor(questionId, studentAnswer, null);
    document.getElementById("ai-tutor-body").innerHTML = `<p class="whitespace-pre-wrap">${res.text}</p>`;
  } catch (e) {
    document.getElementById("ai-tutor-body").innerHTML = `<p class="text-amber-400">${e.message}. Upgrade to Premium or set ANTHROPIC_API_KEY.</p><p class="mt-3 text-gray-400">${q.explanation}</p>`;
  }
};

PrepFastFeatures.sendTutorFollowUp = async function (questionId) {
  const msg = document.getElementById("ai-tutor-input")?.value.trim();
  if (!msg) return;
  const idx = PRACTICE_SESSION.currentIndex;
  const studentAnswer = PRACTICE_SESSION.selectedAnswers[idx] || "";
  document.getElementById("ai-tutor-body").textContent = "Thinking…";
  try {
    const res = await PrepFastAPI.askTutor(questionId, studentAnswer, msg);
    document.getElementById("ai-tutor-body").innerHTML = `<p class="whitespace-pre-wrap">${res.text}</p>`;
  } catch (e) {
    document.getElementById("ai-tutor-body").textContent = e.message;
  }
};

const WAEC_SUBJECT_GROUPS = {
  "Core": ["English Language", "Mathematics"],
  "Sciences": ["Physics", "Chemistry", "Biology", "Further Maths", "Agricultural Science", "Computer Science"],
  "Arts": ["Literature", "Government", "History", "CRS", "IRS", "Fine & Applied Arts"],
  "Commercial": ["Economics", "Commerce", "Financial Accounting", "Office Practice"],
  "Social Sciences": ["Geography", "Civic Education", "French", "Yoruba", "Igbo", "Hausa"]
};

window.toggleSubjectChip = function(btn) {
  btn.classList.toggle('bg-indigo-600');
  btn.classList.toggle('border-indigo-500');
  btn.classList.toggle('text-white');
  btn.classList.toggle('bg-indigo-950/40');
  btn.classList.toggle('border-indigo-900/60');
  btn.classList.toggle('text-indigo-300');
  
  const selectedCount = document.querySelectorAll('#subject-chips-container .bg-indigo-600').length;
  const warning = document.getElementById('subject-warning');
  if (selectedCount > 9) {
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }
};

window.goToPlannerStep2 = function() {
  const selected = Array.from(document.querySelectorAll('#subject-chips-container .bg-indigo-600'))
    .map(btn => btn.dataset.subject);
    
  if (selected.length === 0) {
    showToast("Please select at least one subject", "error");
    return;
  }
  
  window._plannerSelectedSubjects = selected;
  
  const user = PrepFastDB.getUser();
  const container = document.getElementById("planner-content-area");
  
  container.innerHTML = `
    <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 mb-6 max-w-lg mx-auto text-center">
      <h3 class="text-xl font-bold text-white mb-4">When is your exam?</h3>
      <p class="text-gray-400 text-sm mb-6">We'll build a daily schedule from today until your exam date.</p>
      
      <div class="text-left mb-6">
        <label class="text-xs text-gray-400 uppercase font-bold">Target Exam Date</label>
        <div class="flex gap-2 mt-1">
          <input type="text" readonly id="planner-exam-date" value="${(user.exam_date ? new Date(user.exam_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : "Not Set")}" class="flex-1 bg-indigo-950/40 border border-indigo-900/60 rounded-xl px-3 py-2 text-white">
          <button onclick="openSetExamDateModal(); setTimeout(() => document.getElementById('planner-exam-date').value = (PrepFastDB.getUser().exam_date ? new Date(PrepFastDB.getUser().exam_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'Not Set'), 500)" class="bg-indigo-500/20 text-indigo-300 px-4 rounded-xl font-bold hover:bg-indigo-500/30">Select Date</button>
        </div>
      </div>
      
      <div class="text-left mb-6">
        <label class="text-xs text-gray-400 uppercase font-bold">Hours per day</label>
        <input type="number" id="planner-hours" value="2" min="1" max="8" class="w-full mt-1 bg-indigo-950/40 border border-indigo-900/60 rounded-xl px-3 py-2 text-white">
      </div>
      
      <button onclick="PrepFastFeatures.generatePlan()" class="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20">Generate My Plan</button>
      <button onclick="renderStudyPlannerView()" class="w-full mt-3 text-indigo-400 font-bold py-2">Back to Subjects</button>
    </div>
  `;
};

window.regeneratePlan = function() {
  localStorage.removeItem("prepfast_study_plan");
  renderStudyPlannerView();
};

function renderStudyPlannerView() {
  const container = document.getElementById("view-study-planner");
  if (!container) return;
  const user = PrepFastDB.getUser() || { subjects: [] };
  const userSubjects = user.subjects || [];

  container.innerHTML = `
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-black text-white flex items-center gap-2">${iconHtml("calendar-days", "w-6 h-6 text-indigo-400")} Study Planner</h2>
        <p class="text-gray-400 text-sm mt-1">Day-by-day revision schedule until your exam</p>
      </div>
      <button onclick="regeneratePlan()" class="text-sm text-indigo-400 hover:text-white flex items-center gap-1 font-semibold">
        <i data-lucide="refresh-cw" class="w-4 h-4"></i> Regenerate Plan
      </button>
    </div>
    
    <div id="planner-auth-hint" class="hidden mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs"></div>
    
    <div id="planner-content-area"></div>
    <div id="planner-calendar" class="space-y-2"></div>`;
    
  if (!PrepFastAPI.getToken()) {
    const hint = document.getElementById("planner-auth-hint");
    if (hint) {
      hint.classList.remove("hidden");
      hint.innerHTML =
        'You are using offline login. Click <button type="button" onclick="PrepFastFeatures.ensureApiSession().then(ok => showToast(ok ? \"Connected!\" : \"Could not connect\", ok ? \"success\" : \"error\"))" class="underline font-bold">Connect account</button> or sign out and log in again with OTP.';
    }
  }

  // Check if plan exists
  const saved = localStorage.getItem("prepfast_study_plan");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.plan && data.plan.length > 0) {
        PrepFastFeatures.renderPlanCalendar(data.plan);
        refreshIcons();
        return; // Plan already rendered
      }
    } catch (_) {}
  }

  // Render Step 1: Subject Selection
  let subjectsHtml = '';
  Object.entries(WAEC_SUBJECT_GROUPS).forEach(([group, subjects]) => {
    subjectsHtml += `
      <div class="mb-5">
        <h4 class="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">${group}</h4>
        <div class="flex flex-wrap gap-2">
          ${subjects.map(sub => {
            // Match against user.subjects (some might be canonical aliases)
            const isSelected = userSubjects.includes(sub) || userSubjects.includes(SUBJECT_ID_TO_NAME[sub.toLowerCase()]) || (group==='Core');
            const classes = isSelected 
              ? 'bg-indigo-600 border-indigo-500 text-white' 
              : 'bg-indigo-950/40 border-indigo-900/60 text-indigo-300';
            return `<button onclick="toggleSubjectChip(this)" data-subject="${sub}" class="border rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${classes}">${sub}</button>`;
          }).join('')}
        </div>
      </div>
    `;
  });

  document.getElementById("planner-content-area").innerHTML = `
    <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 mb-6">
      <h3 class="text-xl font-bold text-white mb-1">Which subjects are you preparing for?</h3>
      <p class="text-gray-400 text-sm mb-6">Select all that apply. We'll build your study plan around these.</p>
      
      <div id="subject-chips-container">
        ${subjectsHtml}
      </div>
      
      <div id="subject-warning" class="hidden mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm flex items-center gap-2">
        <i data-lucide="alert-triangle" class="w-4 h-4"></i> WAEC candidates typically sit 8-9 subjects — are you sure?
      </div>
      
      <div class="mt-8 flex justify-end">
        <button onclick="goToPlannerStep2()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">Continue to Exam Date</button>
      </div>
    </div>
  `;

  refreshIcons();
}

PrepFastFeatures.generatePlan = async function () {
  const user = PrepFastDB.getUser();
  if (!user) {
    showToast("Please log in first", "error");
    navigate("auth");
    return;
  }
  const examDate = user.exam_date;
  const hours = parseInt(document.getElementById("planner-hours")?.value || "2", 10);
  const subjects = window._plannerSelectedSubjects || normalizePlannerSubjects(user.subjects);

  if (!examDate) {
    showToast("Please choose an exam date", "error");
    return;
  }

  const btn = document.querySelector("#view-study-planner button[onclick*='generatePlan']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Generating…";
  }

  if (window.PREPFAST_CONFIG?.useApi) await PrepFastBridge.whenReady();

  let plan = null;

  if (PrepFastBridge?.apiOnline) {
    try {
      const localRes = await PrepFastAPI.generateStudyPlanLocal(examDate, subjects, hours);
      plan = localRes.plan;
    } catch (_) {}
  }

  if (!plan?.length) {
    plan = buildLocalStudyPlan(examDate, subjects, hours);
  }

  if (PrepFastAPI.getToken()) {
    try {
      await PrepFastAPI.generateStudyPlan(examDate, subjects, hours);
      window._needsApiReauth = false;
      document.getElementById("planner-auth-hint")?.classList.add("hidden");
    } catch (_) {}
  } else {
    await PrepFastFeatures.ensureApiSession();
  }

  PrepFastFeatures.renderPlanCalendar(plan);
  localStorage.setItem(
    "prepfast_study_plan",
    JSON.stringify({ plan, exam_date: examDate })
  );
  if (user.exam_date !== examDate) {
    PrepFastDB.updateUser({ exam_date: examDate });
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Generate Plan";
  }
  showToast("Your study plan is ready", "success");
  
  // Clear the input area to just show the calendar
  document.getElementById("planner-content-area").innerHTML = '';
};

PrepFastFeatures.loadExistingPlan = async function () {
  const saved = localStorage.getItem("prepfast_study_plan");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.plan) PrepFastFeatures.renderPlanCalendar(data.plan);
    } catch (_) {}
  }

  if (!PrepFastAPI.getToken()) return;
  try {
    const res = await PrepFastAPI.getLatestStudyPlan();
    if (res.plan) PrepFastFeatures.renderPlanCalendar(res.plan);
  } catch (_) {}
};

PrepFastFeatures.renderPlanCalendar = function (plan) {
  const el = document.getElementById("planner-calendar");
  if (!el || !plan?.length) return;
  el.innerHTML = plan
    .slice(0, 30)
    .map(
      (day) => `
    <div class="glass-panel p-4 rounded-xl border border-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2 py-0.5 rounded">${new Date(day.date).toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short'})}</span>
          <span class="text-white font-semibold">${day.subject}</span>
        </div>
        <div class="text-xs text-gray-400 mt-1">${(day.topics || []).join(", ")} · ${day.question_count_target || 20} questions target</div>
      </div>
      <button onclick="navigate('practice'); setTimeout(() => { document.getElementById('practice-mode-select').value = 'focus'; startFocusPractice('${day.subject}', '${(day.topics || [])[0] || 'General'}'); }, 100);" class="shrink-0 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-200 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">Start Practice</button>
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

  if (PrepFastBridge?.apiOnline) {
    try {
      const res = await PrepFastAPI.whatsappSimulate("2348000000000", txt);
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
    const count = await PrepFastBridge.downloadOfflineSubject(subject);
    showToast(`Downloaded ${count} ${subject} questions for offline use`, "success");
  } catch (e) {
    if (e.data?.upgrade) openPaystackSim();
    else showToast(e.message, "error");
  }
};

// ——— Mood check-in ———
window.saveMoodCheckin = async function (mood) {
  if (PrepFastAPI.getToken()) {
    try {
      await PrepFastAPI.saveMood(mood, "practice");
    } catch (_) {}
  }
  showToast("Mood saved — keep going!", "success");
};

document.addEventListener("DOMContentLoaded", () => {
  PrepFastFeatures.checkPaymentReturn();
});

const ExamEdgeFeatures = PrepFastFeatures;
if (typeof window !== "undefined") {
  window.PrepFastFeatures = PrepFastFeatures;
  window.ExamEdgeFeatures = ExamEdgeFeatures;
}
