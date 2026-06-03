// ExamEdge Main Application & Interface Controller
// Manages states, SPA views, timers, events, and dynamic calculations.

let CURRENT_USER = null;
let ACTIVE_VIEW = "dashboard";
let PRACTICE_SESSION = {
  mode: "study", // "study" | "mock"
  subject: "All",
  questions: [],
  currentIndex: 0,
  selectedAnswers: {}, // index -> option
  flaggedQuestions: {}, // index -> boolean
  startTime: null,
  timerInterval: null,
  timeRemainingSeconds: 0,
  dailyLimitTriggered: false
};

// WhatsApp Bot Session State
let WHATSAPP_SESSION = {
  open: false,
  messages: [
    { sender: "bot", text: "🇳🇬 <b>ExamEdge WhatsApp Study Bot</b> active!<br>Ready for your daily WAEC challenge?", time: "09:00" },
    { sender: "bot", text: "<b>Subject: Biology (Ecology)</b><br>Question: <i>Which organism is a primary producer in a food chain?</i><br>A) Grasshopper<br>B) Green plant<br>C) Lion<br>D) Frog<br><br>Reply with <b>A</b>, <b>B</b>, <b>C</b>, or <b>D</b> to answer!", time: "09:01" }
  ]
};

// Active Countdown Target (WAEC Exam: June 15, 2026)
const TARGET_DATE = new Date("2026-06-15T09:00:00").getTime();

// List of motivational quotes for secondary students
const MOTIVATIONAL_QUOTES = [
  "\"The secret of success in WAEC is to start early and revise past questions systematically.\" - Dr. Toyin, 1998 National Top Scorer",
  "\"You have practiced 10+ questions today already. Consistency beats cramming every single time!\"",
  "\"Do not let exam anxiety steal your marks. Take a 2-minute breathing break right now in our Wellbeing Corner.\"",
  "\"Your focus determines your reality. Concentrate on one topic at a time.\"",
  "\"Success is the sum of small efforts, repeated day in and day out.\""
];

// Document loaded callback
document.addEventListener("DOMContentLoaded", () => {
  // Initialize storage
  ExamEdgeDB.init();
  CURRENT_USER = ExamEdgeDB.getUser();

  // Route initial page
  if (!CURRENT_USER) {
    navigate("auth");
  } else {
    navigate("dashboard");
  }

  // Setup Global Events listeners
  setupEventListeners();

  // Start background routines
  startClockCountdowns();
});

// Navigation View Controller
function navigate(viewName) {
  ACTIVE_VIEW = viewName;
  CURRENT_USER = ExamEdgeDB.getUser();

  // Hide all view screens
  document.querySelectorAll(".app-view").forEach(screen => {
    screen.classList.add("hidden");
  });

  // Handle Auth guard
  if (!CURRENT_USER && viewName !== "auth") {
    navigate("auth");
    return;
  }

  // Toggle body auth class to hide navigation menus
  if (viewName === "auth") {
    document.body.classList.add("auth-view");
  } else {
    document.body.classList.remove("auth-view");
  }

  // Render requested view layout
  const targetScreen = document.getElementById(`view-${viewName}`);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
  }

  // Active navigation items highlighting
  document.querySelectorAll(".nav-item").forEach(item => {
    const itemTarget = item.getAttribute("data-view");
    if (itemTarget === viewName) {
      item.classList.add("text-indigo-400", "border-indigo-400");
      item.classList.remove("text-gray-400", "border-transparent");
    } else {
      item.classList.remove("text-indigo-400", "border-indigo-400");
      item.classList.add("text-gray-400", "border-transparent");
    }
  });

  // Trigger page-specific loaders
  switch (viewName) {
    case "auth":
      renderAuthView();
      break;
    case "dashboard":
      renderDashboardView();
      break;
    case "practice":
      renderPracticeSelection();
      break;
    case "leaderboard":
      renderLeaderboardView();
      break;
    case "settings":
      renderSettingsView();
      break;
    case "wellbeing":
      renderWellbeingView();
      break;
    case "study-planner":
      if (typeof renderStudyPlannerView === "function") renderStudyPlannerView();
      else if (typeof ExamEdgeFeatures !== "undefined" && ExamEdgeFeatures.renderStudyPlannerView) {
        ExamEdgeFeatures.renderStudyPlannerView();
      }
      if (typeof refreshIcons === "function") refreshIcons();
      break;
  }

  // Close WhatsApp if open on practice or mock exam to prevent overlapping
  if (viewName === "practice-active" && WHATSAPP_SESSION.open) {
    toggleWhatsApp();
  }
}

// ----------------------------------------------------
// VIEW RENDERING MODULES
// ----------------------------------------------------

// 1. Authentication View Manager (OTP Banner simulation)
function renderAuthView() {
  const container = document.getElementById("view-auth");
  container.innerHTML = `
    <div class="min-height-80 flex items-center justify-center p-4">
      <div class="glass-panel w-full max-w-md p-8 rounded-2xl border border-indigo-500/20 text-center relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-600/10 rounded-full blur-2xl"></div>

        <div class="mb-6 flex justify-center">
          <div class="bg-indigo-600/20 p-4 rounded-full border border-indigo-500/30">
            <span class="text-3xl">🎓</span>
          </div>
        </div>

        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-200 mb-2">ExamEdge</h1>
        <p class="text-gray-400 text-sm mb-8 font-light">Join 100,000+ Nigerian students preparing for WAEC, NECO, & JAMB exams.</p>

        <!-- Phone Number Input Screen -->
        <div id="auth-phone-screen">
          <label class="block text-left text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Enter Phone Number</label>
          <div class="flex items-center bg-indigo-950/40 rounded-xl border border-indigo-900/60 p-1 mb-6">
            <span class="px-3 text-indigo-400 font-bold border-r border-indigo-900/60">+234</span>
            <input type="tel" id="auth-phone-input" placeholder="803 123 4567" class="w-full bg-transparent px-3 py-2 text-white placeholder-gray-600 outline-none font-semibold" max="10">
          </div>

          <label class="block text-left text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Full Name</label>
          <input type="text" id="auth-name-input" placeholder="e.g. Chidi Adebayo" class="w-full bg-indigo-950/40 rounded-xl border border-indigo-900/60 px-4 py-3 text-white placeholder-gray-600 outline-none font-semibold mb-6">

          <button onclick="triggerOTPSending()" class="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold py-3.5 rounded-xl hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/20 transition-all">
            Get Activation OTP
          </button>
        </div>

        <!-- OTP Verification Screen -->
        <div id="auth-otp-screen" class="hidden">
          <p class="text-gray-400 text-sm mb-6">We've sent a 4-digit mock activation code to your phone. Check the notification banner at the top!</p>
          
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Verification Code</label>
          <div class="flex justify-center gap-3 mb-6">
            <input type="text" maxlength="1" class="otp-digit w-12 h-14 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-indigo-400">
            <input type="text" maxlength="1" class="otp-digit w-12 h-14 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-indigo-400">
            <input type="text" maxlength="1" class="otp-digit w-12 h-14 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-indigo-400">
            <input type="text" maxlength="1" class="otp-digit w-12 h-14 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-indigo-400">
          </div>

          <button onclick="verifyOTPCode()" class="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold py-3.5 rounded-xl hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/20 transition-all">
            Verify & Start Studying
          </button>

          <button onclick="backToPhoneScreen()" class="mt-4 text-xs text-indigo-400 hover:underline">
            Change phone number
          </button>
        </div>
      </div>
    </div>
  `;

  // Auto focus otp input fields
  const digits = document.querySelectorAll(".otp-digit");
  digits.forEach((d, i) => {
    d.addEventListener("keyup", (e) => {
      if (d.value.length === 1 && i < 3) {
        digits[i + 1].focus();
      }
    });
  });
}

let generatedMockOTP = "1996";
function triggerOTPSending() {
  const phone = document.getElementById("auth-phone-input").value.trim();
  const name = document.getElementById("auth-name-input").value.trim();

  if (phone.length < 9 || name.length < 3) {
    showToast("Please enter a valid name and phone number!", "error");
    return;
  }

  // Generate 4 digit code
  generatedMockOTP = Math.floor(1000 + Math.random() * 9000).toString();

  // Visual simulation of OTP SMS
  showSMSBanner(`[SMS GATEWAY] ExamEdge verification OTP is: ${generatedMockOTP}`);

  // Transition screen
  document.getElementById("auth-phone-screen").classList.add("hidden");
  document.getElementById("auth-otp-screen").classList.remove("hidden");
  showToast("Mock SMS OTP sent!", "success");
}

function verifyOTPCode() {
  const digits = document.querySelectorAll(".otp-digit");
  let entered = "";
  digits.forEach(d => entered += d.value.trim());

  if (entered.length < 4) {
    showToast("Please enter a 4-digit verification code!", "error");
    return;
  }

  // Friction-free developer override: accepts either the sent SMS code OR any 4-digit code.
  const phone = document.getElementById("auth-phone-input").value.trim();
  const name = document.getElementById("auth-name-input").value.trim();

  // Save session
  const user = ExamEdgeDB.login("+234" + phone, name);
  showToast(`Welcome back, ${user.name}!`, "success");
  
  // Routing view handles visibility automatically!
  navigate("dashboard");
}

function backToPhoneScreen() {
  document.getElementById("auth-phone-screen").classList.remove("hidden");
  document.getElementById("auth-otp-screen").classList.add("hidden");
}

// 2. Student Dashboard Screen
function renderDashboardView() {
  const user = ExamEdgeDB.getUser();
  if (!user) return;

  const xp = ExamEdgeDB.getXP();
  const limitInfo = ExamEdgeDB.getDailyLimitInfo();
  const readiness = ExamEdgeDB.getExamReadinessScore(ExamEdgeDB.getQuestions());
  const weakness = ExamEdgeDB.getWeaknessMap(ExamEdgeDB.getQuestions());

  // Compile "Focus Areas Today"
  let focusHtml = "";
  let focusCount = 0;
  const weakSpots = [];

  Object.keys(weakness).forEach(sub => {
    Object.keys(weakness[sub]).forEach(top => {
      const data = weakness[sub][top];
      if (data.status === "Needs Work") {
        weakSpots.push({ subject: sub, topic: top, accuracy: data.accuracy });
      }
    });
  });

  // Sort by lowest accuracy first
  weakSpots.sort((a, b) => a.accuracy - b.accuracy);

  // Take top 3 or default to core subject syllabus
  const focusList = weakSpots.slice(0, 3);
  if (focusList.length === 0) {
    focusList.push({ subject: "Mathematics", topic: "Quadratic Equations" });
    focusList.push({ subject: "English Language", topic: "Lexis and Structure" });
    focusList.push({ subject: "Biology", topic: "Ecology" });
  }

  focusList.forEach(item => {
    focusHtml += `
      <div class="flex items-center justify-between p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl hover:border-indigo-800 transition-all cursor-pointer" onclick="startFocusPractice('${item.subject}', '${item.topic}')">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm font-bold text-indigo-400">
            ${item.subject[0]}
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white">${item.topic}</h4>
            <span class="text-xs text-indigo-300/60">${item.subject}</span>
          </div>
        </div>
        <span class="text-xs font-semibold px-2 py-1 bg-rose-500/10 text-rose-400 rounded-md border border-rose-500/20">Weak Spot</span>
      </div>
    `;
  });

  // Render dynamic dashboard view elements
  const container = document.getElementById("view-dashboard");
  container.innerHTML = `
    <!-- Top Greeting Banner -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Kedu, ${user.name}! 👋</h1>
        <p class="text-gray-400 text-sm mt-1">Ready to step up your exam scores today?</p>
      </div>

      <!-- Streak and XP badges -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <span class="text-amber-400 text-xl font-extrabold streak-active">🔥</span>
          <div>
            <div class="text-xs text-amber-500 font-bold uppercase tracking-wider leading-none">Streak</div>
            <div class="text-sm font-black text-amber-300 leading-none mt-1">${user.study_streak} Days</div>
          </div>
        </div>

        <div class="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <span class="text-indigo-400 text-xl font-bold">✨</span>
          <div>
            <div class="text-xs text-indigo-400 font-bold uppercase tracking-wider leading-none">Total XP</div>
            <div class="text-sm font-black text-indigo-200 leading-none mt-1">${xp} PTS</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Countdown Timer and Limit warnings -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      <!-- Target Countdown -->
      <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 relative overflow-hidden flex flex-col justify-between">
        <div>
          <span class="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Countdown to ${user.exam_target}</span>
          <h2 class="text-2xl font-black text-white mt-1" id="dash-countdown-text">-- Days -- Hours</h2>
        </div>
        <div class="mt-4 pt-4 border-t border-indigo-900/60 flex items-center justify-between text-xs text-gray-400">
          <span>Target Exam Date:</span>
          <span class="font-bold text-white">${new Date(user.exam_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <!-- Readiness Score Gauge -->
      <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 flex items-center justify-between gap-4">
        <div class="flex-1">
          <span class="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Exam Readiness</span>
          <h3 class="text-3xl font-extrabold text-white mt-1">${readiness}%</h3>
          <p class="text-xs text-gray-400 mt-2">
            ${readiness < 40 ? "Needs massive practice. Keep working!" : readiness < 75 ? "You're getting closer! Practice 10 more Biology sessions." : "Super ready! Go crush that exam!"}
          </p>
        </div>
        
        <!-- Circular SVG Meter -->
        <div class="relative w-20 h-20">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="34" stroke="rgba(99, 102, 241, 0.1)" stroke-width="6" fill="transparent"/>
            <circle cx="40" cy="40" r="34" stroke="${readiness < 40 ? '#f43f5e' : readiness < 75 ? '#f59e0b' : '#10b981'}" stroke-width="6" fill="transparent" 
              stroke-dasharray="${2 * Math.PI * 34}" 
              stroke-dashoffset="${2 * Math.PI * 34 * (1 - readiness / 100)}"/>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-300">
            ${readiness}%
          </div>
        </div>
      </div>

      <!-- Practice Limit Cards (Tier Gate) -->
      <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Daily Limit</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full ${user.subscription_tier === 'premium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-gray-500/20 text-gray-400'}">
              ${user.subscription_tier.toUpperCase()}
            </span>
          </div>
          <h3 class="text-2xl font-bold text-white mt-1">${limitInfo.count} / ${limitInfo.limit} Qs</h3>
          
          <div class="w-full bg-indigo-950/60 rounded-full h-2 mt-3 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style="width: ${Math.min((limitInfo.count / limitInfo.limit) * 100, 100)}%"></div>
          </div>
        </div>

        <div class="mt-4">
          ${user.subscription_tier === 'free' 
            ? `<button onclick="openPaystackSim()" class="w-full text-center text-xs font-bold text-amber-400 hover:text-amber-300 py-1 border border-dashed border-amber-500/30 hover:border-amber-500 rounded-lg transition-all">🔑 Go Premium for Unlimited Practice</button>`
            : `<span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">✅ Unlimited Practice Active</span>`
          }
        </div>
      </div>

    </div>

    <!-- Core Actions & Smart Study lists -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Focus List -->
      <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-indigo-500/10">
        <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span> Your Focus Today (Weakness map targets)
        </h3>
        
        <div class="flex flex-col gap-3">
          ${focusHtml}
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button onclick="startStandardPractice()" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <span>📝</span> Practice Mode
          </button>
          
          <button onclick="startCBTMode()" class="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <span>⏱️</span> Timed Mock Exam
          </button>
        </div>
      </div>

      <!-- Quick Advice & Support Corner -->
      <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span> Study Coach Advice
          </h3>
          <p class="text-sm text-gray-300 italic font-light leading-relaxed">
            ${MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-indigo-900/60">
          <button onclick="navigate('wellbeing')" class="w-full bg-violet-950/40 hover:bg-violet-950/60 border border-violet-800/40 text-violet-300 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            <span>🍃</span> Wellbeing Corner (Breathing/Anxiety)
          </button>
        </div>
      </div>

    </div>
  `;

  // Initialize counting text
  updateCountdownTimerText();
}

function updateCountdownTimerText() {
  const elem = document.getElementById("dash-countdown-text");
  if (!elem) return;

  const now = Date.now();
  const distance = TARGET_DATE - now;

  if (distance < 0) {
    elem.innerText = "EXAM TIME STARTED!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  elem.innerText = `${days}d ${hours}h left`;
}

function startClockCountdowns() {
  setInterval(() => {
    updateCountdownTimerText();
  }, 60000); // refresh every minute
}

// Focus practice trigger
function startFocusPractice(subject, topic) {
  PRACTICE_SESSION.subject = subject;
  PRACTICE_SESSION.mode = "study";
  
  // Filter questions by subject and topic
  PRACTICE_SESSION.questions = ExamEdgeDB.getQuestions().filter(q => q.subject === subject && q.topic === topic);
  
  if (PRACTICE_SESSION.questions.length === 0) {
    showToast("No questions available for this specific topic yet!", "error");
    return;
  }

  startActivePracticeFlow();
}

function startStandardPractice() {
  PRACTICE_SESSION.mode = "study";
  navigate("practice");
}

function startCBTMode() {
  PRACTICE_SESSION.mode = "mock";
  navigate("practice");
}

// 3. Selection of Practice Parameters
function renderPracticeSelection() {
  const container = document.getElementById("view-practice");
  const mode = PRACTICE_SESSION.mode;

  container.innerHTML = `
    <div class="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-indigo-500/10">
      <h2 class="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
        ${mode === 'study' ? '📝 Practice & Review' : '⏱️ Timed CBT Mock Exam'}
      </h2>
      <p class="text-gray-400 text-sm mb-8">
        ${mode === 'study' ? 'Gain immediate feedback, review correct solutions, and ask AI tutor tips.' : 'Simulate authentic WAEC/JAMB digital conditions. Timed countdown with score report.'}
      </p>

      <!-- Subject Picker -->
      <div class="mb-6">
        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Select Subject</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="prac-subject-picker">
          <button onclick="selectPracticeSubject('All')" class="subject-btn py-3 px-4 rounded-xl text-left bg-indigo-950/20 border border-indigo-900/60 text-white font-semibold flex justify-between items-center hover:border-indigo-400 transition-all active border-indigo-500">
            <span>All Core Subjects</span>
            <span class="text-xs text-indigo-400 font-bold">${ExamEdgeDB.getQuestions().length} Qs</span>
          </button>
          
          <button onclick="selectPracticeSubject('Mathematics')" class="subject-btn py-3 px-4 rounded-xl text-left bg-indigo-950/20 border border-indigo-900/60 text-white font-semibold flex justify-between items-center hover:border-indigo-400 transition-all">
            <span>Mathematics</span>
            <span class="text-xs text-indigo-400 font-bold">20 Qs</span>
          </button>

          <button onclick="selectPracticeSubject('English Language')" class="subject-btn py-3 px-4 rounded-xl text-left bg-indigo-950/20 border border-indigo-900/60 text-white font-semibold flex justify-between items-center hover:border-indigo-400 transition-all">
            <span>English Language</span>
            <span class="text-xs text-indigo-400 font-bold">20 Qs</span>
          </button>

          <button onclick="selectPracticeSubject('Biology')" class="subject-btn py-3 px-4 rounded-xl text-left bg-indigo-950/20 border border-indigo-900/60 text-white font-semibold flex justify-between items-center hover:border-indigo-400 transition-all">
            <span>Biology</span>
            <span class="text-xs text-indigo-400 font-bold">20 Qs</span>
          </button>

          <button onclick="selectPracticeSubject('Chemistry')" class="subject-btn py-3 px-4 rounded-xl text-left bg-indigo-950/20 border border-indigo-900/60 text-white font-semibold flex justify-between items-center hover:border-indigo-400 transition-all">
            <span>Chemistry</span>
            <span class="text-xs text-indigo-400 font-bold">20 Qs</span>
          </button>

          <button onclick="selectPracticeSubject('Physics')" class="subject-btn py-3 px-4 rounded-xl text-left bg-indigo-950/20 border border-indigo-900/60 text-white font-semibold flex justify-between items-center hover:border-indigo-400 transition-all">
            <span>Physics</span>
            <span class="text-xs text-indigo-400 font-bold">20 Qs</span>
          </button>
        </div>
      </div>

      <!-- Year Filter Picker -->
      <div class="mb-8">
        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Choose Practice Year</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <button id="prac-opt-full" onclick="selectPracticeOption('full')" class="opt-btn py-3 px-4 rounded-xl text-left bg-indigo-500/10 border border-indigo-400 text-white font-semibold flex flex-col transition-all">
            <span>Full Syllabus Mix</span>
            <span class="text-xs text-indigo-300/60 mt-1">Cross-topic practice across all years</span>
          </button>

          <div>
            <select id="prac-opt-year-select" onchange="selectPracticeOption(this.value)" class="w-full bg-indigo-950/20 border border-indigo-900/60 text-white rounded-xl px-4 py-3 text-sm">
              <option value="full">All Years (2000–2025)</option>
              ${Array.from({ length: 26 }, (_, idx) => 2000 + idx).map(year => `<option value="${year}">${year}</option>`).join('')}
            </select>
            <p class="text-xs text-indigo-300/60 mt-2">Pick a year between 2000 and 2025 for targeted past-question practice.</p>
          </div>
        </div>
      </div>

      <button onclick="launchPracticeSession()" class="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all text-center">
        Start ${mode === 'study' ? 'Practice' : 'CBT Mock Exam'}
      </button>
    </div>
  `;

  // Set default parameters
  PRACTICE_SESSION.subject = "All";
  PRACTICE_SESSION.option = "full";
}

function selectPracticeSubject(subject) {
  PRACTICE_SESSION.subject = subject;

  // Visual toggle
  const btns = document.querySelectorAll(".subject-btn");
  btns.forEach(btn => {
    if (btn.innerText.includes(subject === "All" ? "All" : subject)) {
      btn.classList.add("border-indigo-500", "bg-indigo-500/10");
    } else {
      btn.classList.remove("border-indigo-500", "bg-indigo-500/10");
    }
  });
}

function selectPracticeOption(opt) {
  PRACTICE_SESSION.option = opt;

  const btnFull = document.getElementById("prac-opt-full");
  const yearSelect = document.getElementById("prac-opt-year-select");

  if (yearSelect) {
    yearSelect.value = opt;
  }

  if (btnFull) {
    btnFull.className = opt === "full"
      ? "opt-btn py-3 px-4 rounded-xl text-left bg-indigo-500/10 border border-indigo-400 text-white font-semibold flex flex-col transition-all"
      : "opt-btn py-3 px-4 rounded-xl text-left bg-indigo-950/20 border border-indigo-900/60 text-white font-semibold flex flex-col transition-all";
  }
}

function shuffleArray(array) {
  const items = [...array];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function launchPracticeSession() {
  let questions = [...ExamEdgeDB.getQuestions()];

  // Apply filters
  if (PRACTICE_SESSION.subject !== "All") {
    questions = questions.filter(q => q.subject === PRACTICE_SESSION.subject);
  }
  if (PRACTICE_SESSION.option !== "full") {
    const yearNum = parseInt(PRACTICE_SESSION.option, 10);
    if (!Number.isNaN(yearNum)) {
      questions = questions.filter(q => q.year === yearNum);
    }
  }

  if (questions.length === 0) {
    showToast("No questions matched your filter parameters!", "error");
    return;
  }

  questions = questions
    .map(q => {
      const choiceEntries = Object.entries(q.options).map(([key, text]) => ({ originalKey: key, text }));
      const shuffledChoices = shuffleArray(choiceEntries).map((choice, idx) => ({
        displayKey: ["A", "B", "C", "D"][idx],
        originalKey: choice.originalKey,
        text: choice.text
      }));
      const correctDisplayKey = (shuffledChoices.find(item => item.originalKey === q.answer) || shuffledChoices[0]).displayKey;
      return {
        ...q,
        _displayOptions: shuffledChoices,
        _correctDisplayKey: correctDisplayKey
      };
    })
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  PRACTICE_SESSION.questions = questions;
  startActivePracticeFlow();
}

// Initiates the practicing screen
function startActivePracticeFlow() {
  PRACTICE_SESSION.currentIndex = 0;
  PRACTICE_SESSION.selectedAnswers = {};
  PRACTICE_SESSION.flaggedQuestions = {};
  PRACTICE_SESSION.dailyLimitTriggered = false;
  PRACTICE_SESSION.startTime = Date.now();

  navigate("practice-active");
  renderPracticeInterface();

  // Setup mock countdown timer if CBT
  if (PRACTICE_SESSION.mode === "mock") {
    // 10 minutes (600 seconds) for mock exam
    PRACTICE_SESSION.timeRemainingSeconds = 600;
    
    // Clear old interval
    if (PRACTICE_SESSION.timerInterval) clearInterval(PRACTICE_SESSION.timerInterval);

    PRACTICE_SESSION.timerInterval = setInterval(() => {
      PRACTICE_SESSION.timeRemainingSeconds -= 1;
      updateCBTMockTimerText();

      if (PRACTICE_SESSION.timeRemainingSeconds <= 0) {
        clearInterval(PRACTICE_SESSION.timerInterval);
        submitMockExamSession(true); // Forced submit
      }
    }, 1000);
    updateCBTMockTimerText();
  }
}

function updateCBTMockTimerText() {
  const elem = document.getElementById("mock-timer-display");
  if (!elem) return;

  const min = Math.floor(PRACTICE_SESSION.timeRemainingSeconds / 60);
  const sec = PRACTICE_SESSION.timeRemainingSeconds % 60;
  elem.innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  // Make text red when under 60 seconds
  if (PRACTICE_SESSION.timeRemainingSeconds <= 60) {
    elem.classList.add("text-rose-500", "animate-pulse");
    elem.classList.remove("text-indigo-400");
  } else {
    elem.classList.remove("text-rose-500", "animate-pulse");
    elem.classList.add("text-indigo-400");
  }
}

// ----------------------------------------------------
// ACTIVE PRACTICE MODULE (STUDY & CBT MOCK)
// ----------------------------------------------------

function renderPracticeInterface() {
  const container = document.getElementById("view-practice-active");
  const qList = PRACTICE_SESSION.questions;
  const idx = PRACTICE_SESSION.currentIndex;
  const q = qList[idx];
  const mode = PRACTICE_SESSION.mode;

  if (!q) return;

  const total = qList.length;
  const user = ExamEdgeDB.getUser();

  // Selected Option
  const selectedOpt = PRACTICE_SESSION.selectedAnswers[idx];

  // CBT Mode Header elements
  let headerHtml = "";
  if (mode === "mock") {
    headerHtml = `
      <div class="flex justify-between items-center p-4 bg-indigo-950/60 border-b border-indigo-900/60 rounded-t-2xl">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold px-2 py-0.5 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-md">CBT MOCK EXAM</span>
          <span class="text-xs text-gray-400">${q.subject}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 uppercase tracking-widest font-semibold">Time Remaining:</span>
          <span class="text-lg font-black font-mono text-indigo-400" id="mock-timer-display">00:00</span>
        </div>
      </div>
    `;
  } else {
    headerHtml = `
      <div class="flex justify-between items-center p-4 bg-indigo-950/20 border-b border-indigo-900/20 rounded-t-2xl">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md">STUDY MODE</span>
          <span class="text-xs text-gray-400">${q.subject} / ${q.topic}</span>
        </div>
        <span class="text-xs text-gray-400 font-bold">Question ${idx + 1} of ${total}</span>
      </div>
    `;
  }

  // Answer selection banner (only shown in Study Mode after choosing an answer)
  let studyFeedbackHtml = "";
  if (mode === "study" && selectedOpt) {
    const correctKey = q._correctDisplayKey || q.answer;
    const isCorrect = selectedOpt === correctKey;
    studyFeedbackHtml = `
      <div class="mt-6 p-5 rounded-xl border ${isCorrect ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'}">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">${isCorrect ? '✅' : '❌'}</span>
          <h4 class="font-bold text-sm">${isCorrect ? 'Correct Answer!' : 'Incorrect. Try again!'}</h4>
        </div>
        <p class="text-xs leading-relaxed opacity-90 mb-4 whitespace-pre-line">${q.explanation}</p>
        
        <div class="pt-4 border-t border-indigo-900/60 flex flex-wrap gap-3">
          <button onclick="openAiTutor('${q.id}')" class="text-xs font-semibold px-3 py-1.5 bg-violet-600/20 text-violet-300 rounded-lg border border-violet-800/40 hover:bg-violet-600/40 transition-all">
            🤖 Ask AI Tutor
          </button>
          <button onclick="triggerWhatsAppDailyChallengeSim('${q.id}')" class="text-xs font-semibold px-3 py-1.5 bg-indigo-600/20 text-indigo-300 rounded-lg border border-indigo-800/40 hover:bg-indigo-600/40 transition-all">
            💬 Share to WhatsApp
          </button>
        </div>
      </div>
    `;
  }

  // CBT Question Grid selectors
  let sideGridHtml = "";
  if (mode === "mock") {
    let gridNumbersHtml = "";
    qList.forEach((item, index) => {
      const isAnswered = PRACTICE_SESSION.selectedAnswers[index] !== undefined;
      const isFlagged = PRACTICE_SESSION.flaggedQuestions[index] === true;
      const isActive = index === idx;

      let styleClass = "bg-indigo-950/30 border-indigo-900/60 text-gray-400";
      if (isAnswered) styleClass = "bg-indigo-600 text-white border-indigo-500";
      if (isFlagged) styleClass = "bg-amber-500/20 text-amber-400 border-amber-500/50";
      if (isActive) styleClass += " ring-2 ring-indigo-400 ring-offset-2 ring-offset-indigo-950";

      gridNumbersHtml += `
        <button onclick="jumpToQuestion(${index})" class="w-10 h-10 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${styleClass}">
          ${index + 1}
        </button>
      `;
    });

    sideGridHtml = `
      <div class="glass-panel p-5 rounded-2xl border border-indigo-500/10">
        <h4 class="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-4">Question Navigator</h4>
        <div class="cbt-grid mb-6">
          ${gridNumbersHtml}
        </div>
        <button onclick="confirmSubmitMockExam()" class="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl transition-all text-xs">
          Submit Exam Session
        </button>
      </div>
    `;
  }

  // Question Form Options
  let optionsHtml = "";
  const optionSet = q._displayOptions || Object.entries(q.options).map(([originalKey, text], idx) => ({
    displayKey: ["A", "B", "C", "D"][idx],
    originalKey,
    text
  }));
  const correctKey = q._correctDisplayKey || q.answer;

  optionSet.forEach(option => {
    const key = option.displayKey;
    const text = option.text;
    const isSelected = selectedOpt === key;
    let optStyle = "bg-indigo-950/20 border-indigo-900/60 hover:border-indigo-700";

    if (isSelected) {
      if (mode === "study") {
        optStyle = key === correctKey 
          ? "bg-emerald-950/30 border-emerald-500/60 text-emerald-200" 
          : "bg-rose-950/30 border-rose-500/60 text-rose-200";
      } else {
        optStyle = "bg-indigo-500/20 border-indigo-500 text-indigo-200";
      }
    }

    const clickHandler = (mode === "study" && selectedOpt) ? "" : `onclick="selectOption('${key}')"`;

    optionsHtml += `
      <div ${clickHandler} class="p-4 rounded-xl border text-sm font-semibold flex items-center gap-3 cursor-pointer transition-all ${optStyle}">
        <div class="w-6 h-6 rounded-full border border-indigo-500/30 flex items-center justify-center text-xs ${isSelected ? 'bg-indigo-500 text-white border-transparent' : 'text-indigo-400'}">
          ${key}
        </div>
        <div class="text-gray-300 font-light flex-1">${text}</div>
      </div>
    `;
  });

  // Action Bar options
  const isFirst = idx === 0;
  const isLast = idx === total - 1;
  const hasAnswered = selectedOpt !== undefined;

  let actionBarHtml = "";
  if (mode === "mock") {
    actionBarHtml = `
      <div class="flex justify-between items-center mt-8 pt-6 border-t border-indigo-900/40">
        <button onclick="prevQuestion()" ${isFirst ? 'disabled' : ''} class="px-5 py-2.5 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all">
          ⬅️ Back
        </button>

        <button onclick="toggleFlagQuestion()" class="px-5 py-2.5 rounded-xl border border-amber-500/20 text-xs font-semibold flex items-center gap-2 ${PRACTICE_SESSION.flaggedQuestions[idx] ? 'bg-amber-500/20 text-amber-400' : 'bg-transparent text-gray-400 hover:text-amber-400'} transition-all">
          <span>🚩</span> Flag Question
        </button>

        <button onclick="nextQuestion()" ${isLast ? 'disabled' : ''} class="px-5 py-2.5 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all">
          Next ➡️
        </button>
      </div>
    `;
  } else {
    // Study Mode Next action logic
    actionBarHtml = `
      <div class="flex justify-between items-center mt-8 pt-6 border-t border-indigo-900/40">
        <button onclick="prevQuestion()" ${isFirst ? 'disabled' : ''} class="px-5 py-2.5 bg-indigo-950/40 border border-indigo-900/60 rounded-xl text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all">
          ⬅️ Back
        </button>

        ${isLast 
          ? `<button onclick="finishStudySession()" class="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all">Finish Session</button>`
          : `<button onclick="nextQuestion()" ${!hasAnswered ? 'disabled' : ''} class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs disabled:opacity-40 disabled:pointer-events-none shadow-lg transition-all">Next Question ➡️</button>`
        }
      </div>
    `;
  }

  // Combine into a grid for CBT / single card for study
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Primary Question Area -->
      <div class="lg:col-span-2 glass-panel rounded-2xl border border-indigo-500/10 overflow-hidden flex flex-col justify-between">
        <div>
          ${headerHtml}
          
          <div class="p-6">
            <!-- Question Content -->
            <div class="text-base text-white leading-relaxed mb-6 font-light">
              ${q.question}
            </div>

            <!-- Options Grid -->
            <div class="flex flex-col gap-3">
              ${optionsHtml}
            </div>

            <!-- Immediate Study Feedbacks -->
            ${studyFeedbackHtml}
          </div>
        </div>

        <div class="p-6 bg-indigo-950/10 border-t border-indigo-900/30">
          ${actionBarHtml}
        </div>

      </div>

      <!-- CBT Sidebar grid -->
      <div class="lg:col-span-1">
        ${mode === 'mock' 
          ? sideGridHtml 
          : `
            <div class="glass-panel p-6 rounded-2xl border border-indigo-500/10 text-center">
              <span class="text-3xl mb-3 block">🍃</span>
              <h3 class="text-base font-bold text-white mb-2">Feeling anxious during practice?</h3>
              <p class="text-xs text-gray-400 leading-relaxed mb-4">Exam stress is real. Take 60 seconds to calm down with a deep breathing rhythm.</p>
              <button onclick="navigate('wellbeing')" class="w-full bg-violet-950/40 border border-violet-800/40 text-violet-300 text-xs font-bold py-2 rounded-xl transition-all">
                Start Relax Guide
              </button>
            </div>
          `
        }
      </div>

    </div>
  `;

  // Start active countdown timer for mock view if needed
  if (mode === "mock") {
    updateCBTMockTimerText();
  }
}

function selectOption(optionKey) {
  const user = ExamEdgeDB.getUser();
  if (!user) return;

  const idx = PRACTICE_SESSION.currentIndex;
  const q = PRACTICE_SESSION.questions[idx];
  const mode = PRACTICE_SESSION.mode;

  // Save selected option
  PRACTICE_SESSION.selectedAnswers[idx] = optionKey;

  if (mode === "study") {
    const correctKey = q._correctDisplayKey || q.answer;
    const isCorrect = optionKey === correctKey;
    
    // Log active progress in DB
    const res = ExamEdgeDB.logAttempt(q.id, isCorrect, 10);
    
    if (res && res.success === false && res.reason === "limit_reached") {
      PRACTICE_SESSION.dailyLimitTriggered = true;
      openPaystackSim();
      showToast("Daily limit of 20 practice questions reached! Go Premium.", "warning");
      return;
    }

    // Play correctness sound or show confetti for a correct answer
    if (isCorrect) {
      showToast("Correct! +25 XP", "success");
      triggerMicroConfetti();
    } else {
      showToast("Incorrect. Let's study the answer explanation.", "error");
    }

    // Refresh display to show explanation feedback
    renderPracticeInterface();
  } else {
    // For CBT Mock, just update the navigator grid indicators
    renderPracticeInterface();
  }
}

function toggleFlagQuestion() {
  const idx = PRACTICE_SESSION.currentIndex;
  PRACTICE_SESSION.flaggedQuestions[idx] = !PRACTICE_SESSION.flaggedQuestions[idx];
  renderPracticeInterface();
}

function prevQuestion() {
  if (PRACTICE_SESSION.currentIndex > 0) {
    PRACTICE_SESSION.currentIndex -= 1;
    renderPracticeInterface();
  }
}

function nextQuestion() {
  const total = PRACTICE_SESSION.questions.length;
  if (PRACTICE_SESSION.currentIndex < total - 1) {
    PRACTICE_SESSION.currentIndex += 1;
    renderPracticeInterface();
  }
}

function jumpToQuestion(index) {
  PRACTICE_SESSION.currentIndex = index;
  renderPracticeInterface();
}

// ----------------------------------------------------
// FINISHING & SUBMITTING SESSIONS
// ----------------------------------------------------

function finishStudySession() {
  showToast("Practice session completed! Progress saved.", "success");
  navigate("dashboard");
}

function confirmSubmitMockExam() {
  const total = PRACTICE_SESSION.questions.length;
  const answered = Object.keys(PRACTICE_SESSION.selectedAnswers).length;
  const unanswered = total - answered;

  const msg = unanswered > 0 
    ? `You have ${unanswered} unanswered questions remaining. Are you sure you want to submit?`
    : `Are you ready to submit your CBT mock exam?`;

  if (confirm(msg)) {
    submitMockExamSession(false);
  }
}

function submitMockExamSession(forced = false) {
  if (PRACTICE_SESSION.timerInterval) clearInterval(PRACTICE_SESSION.timerInterval);

  const qList = PRACTICE_SESSION.questions;
  const answers = PRACTICE_SESSION.selectedAnswers;
  
  let correctCount = 0;
  let loggedAttempts = 0;
  let limitBlocked = false;

  qList.forEach((q, index) => {
    const chosen = answers[index];
    if (chosen !== undefined) {
      const correctKey = q._correctDisplayKey || q.answer;
      const isCorrect = chosen === correctKey;
      if (isCorrect) correctCount += 1;

      // Log attempts in database
      const res = ExamEdgeDB.logAttempt(q.id, isCorrect, 15);
      if (res && res.success === false) {
        limitBlocked = true;
      } else {
        loggedAttempts += 1;
      }
    }
  });

  const total = qList.length;
  const percent = Math.round((correctCount / total) * 100);

  // Render CBT report scorecard screen
  const container = document.getElementById("view-practice-active");
  container.innerHTML = `
    <div class="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-indigo-500/10 text-center">
      <span class="text-4xl mb-4 block">${percent >= 70 ? '🏆' : percent >= 40 ? '👍' : '📚'}</span>
      
      <h2 class="text-2xl font-black text-white">Mock Exam Scorecard</h2>
      <p class="text-gray-400 text-xs mt-1">CBT Simulation completed successfully.</p>

      <div class="my-8 flex justify-center items-center gap-8">
        <div>
          <div class="text-3xl font-black text-indigo-400">${correctCount}/${total}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Score</div>
        </div>

        <div class="w-px h-10 bg-indigo-900/60"></div>

        <div>
          <div class="text-3xl font-black text-indigo-400">${percent}%</div>
          <div class="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Accuracy</div>
        </div>
      </div>

      <div class="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-xl mb-6 text-left text-xs text-gray-300 leading-relaxed">
        ${percent >= 70 
          ? "<b>Excellent job!</b> You are performing well in these subject topics. Keep maintaining this pace to easily secure an A in WAEC." 
          : percent >= 40 
            ? "<b>Fair score!</b> However, you have some prominent weak topics. Go to your Dashboard and review your <b>Focus Today</b> areas."
            : "<b>Needs deep revision.</b> Your accuracy is below the 40% readiness threshold. Review explanations in <b>Study Mode</b> for immediate coaching."
        }
      </div>

      ${limitBlocked 
        ? `<div class="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 font-semibold text-left">
             ⚠️ Some questions weren't logged because your free tier 20-question limit was reached! Upgrade to Premium to log all practice attempts.
           </div>`
        : ""
      }

      <div class="flex gap-4">
        <button onclick="navigate('dashboard')" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all text-xs">
          Back to Dashboard
        </button>
        <button onclick="startCBTMode()" class="flex-1 bg-indigo-950/60 hover:bg-indigo-950 border border-indigo-900/60 text-indigo-300 font-bold py-3 rounded-xl transition-all text-xs">
          Try Another Mock
        </button>
      </div>
    </div>
  `;

  if (percent >= 70) {
    triggerMicroConfetti();
  }

  showToast("Timed mock submitted!", "success");
}

// ----------------------------------------------------
// ADDITIONAL ROLE PORTALS & PORTLETS
// ----------------------------------------------------

// 4. State/National Leaderboard View
function renderLeaderboardView() {
  const container = document.getElementById("view-leaderboard");
  const leaderboard = ExamEdgeDB.getLeaderboard();

  let rowsHtml = "";
  leaderboard.forEach(entry => {
    rowsHtml += `
      <tr class="border-b border-indigo-900/30 ${entry.isUser ? 'bg-indigo-600/10 font-bold border-l-2 border-l-indigo-400' : ''}">
        <td class="px-6 py-4 text-sm text-gray-300">${entry.rank}</td>
        <td class="px-6 py-4 text-sm text-white">
          <div class="flex items-center gap-2">
            ${entry.isUser ? '⭐' : ''} ${entry.name}
          </div>
        </td>
        <td class="px-6 py-4 text-xs text-gray-400">${entry.school}</td>
        <td class="px-6 py-4 text-xs text-gray-400">${entry.state}</td>
        <td class="px-6 py-4 text-sm text-right text-indigo-300 font-black">${entry.xp}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="max-w-4xl mx-auto glass-panel p-8 rounded-2xl border border-indigo-500/10">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-extrabold text-white">National School Leaderboard</h2>
          <p class="text-gray-400 text-xs mt-1">Live competition rankings for top-performing secondary students.</p>
        </div>
        <div class="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-bold text-amber-400">
          🏆 WEEK 24 ACTIVE
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-indigo-900/60 bg-indigo-950/10">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-indigo-950/40 text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-indigo-900/60">
              <th class="px-6 py-3">Rank</th>
              <th class="px-6 py-3">Student Name</th>
              <th class="px-6 py-3">School Name</th>
              <th class="px-6 py-3">State</th>
              <th class="px-6 py-3 text-right">XP Points</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 5. Wellbeing Anxiety Corner with Breathing Exercise
let breathingGuideState = "Hold";
function renderWellbeingView() {
  const container = document.getElementById("view-wellbeing");
  container.innerHTML = `
    <div class="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-indigo-500/10 text-center">
      <span class="text-4xl mb-3 block">🌿</span>
      <h2 class="text-2xl font-extrabold text-white">Student Wellbeing Corner</h2>
      <p class="text-gray-400 text-sm mb-8">Exam preparation is a marathon, not a sprint. Take care of your mental peace.</p>

      <!-- Mood selector portal -->
      <div class="mb-8 p-6 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl text-left">
        <h3 class="text-sm font-bold text-white mb-2">How are you feeling right now?</h3>
        <p class="text-xs text-gray-500 mb-4">Choose a mood indicator to check in with yourself.</p>
        
        <div class="flex justify-around gap-4">
          <button onclick="logStudentMood('fine')" class="flex-1 py-3 bg-indigo-950/40 border border-indigo-900 hover:border-emerald-500 rounded-xl flex flex-col items-center gap-1 transition-all">
            <span class="text-2xl">😊</span>
            <span class="text-xs text-gray-300 font-semibold">Fine & Motivated</span>
          </button>
          
          <button onclick="logStudentMood('neutral')" class="flex-1 py-3 bg-indigo-950/40 border border-indigo-900 hover:border-amber-500 rounded-xl flex flex-col items-center gap-1 transition-all">
            <span class="text-2xl">😐</span>
            <span class="text-xs text-gray-300 font-semibold">Tired / Calm</span>
          </button>

          <button onclick="logStudentMood('anxious')" class="flex-1 py-3 bg-indigo-950/40 border border-indigo-900 hover:border-rose-500 rounded-xl flex flex-col items-center gap-1 transition-all">
            <span class="text-2xl">😔</span>
            <span class="text-xs text-gray-300 font-semibold">Anxious / Stressed</span>
          </button>
        </div>
      </div>

      <!-- Breathing Guide bubble -->
      <div class="p-8 bg-indigo-950/10 border border-indigo-900/30 rounded-2xl flex flex-col items-center">
        <h3 class="text-sm font-bold text-white mb-1">De-Stress Breathing Bubble</h3>
        <p class="text-xs text-gray-400 mb-8">Follow the contracting visual circle: inhale, hold, exhale.</p>

        <div class="w-36 h-36 rounded-full flex items-center justify-center relative bg-indigo-600/10 border border-indigo-500/20 mb-8">
          <!-- Animated Pulsing Circle -->
          <div class="w-16 h-16 rounded-full breathing-circle absolute"></div>
          
          <span class="text-white text-xs font-black z-10 font-mono tracking-widest uppercase" id="breathing-stage-lbl">Breathe</span>
        </div>

        <button onclick="toggleBreathingLoop()" id="breath-action-btn" class="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-all">
          Start Relaxation Timer
        </button>
      </div>
    </div>
  `;

  resetBreathingTextLoop();
}

let breathingIntervalId = null;
function toggleBreathingLoop() {
  const btn = document.getElementById("breath-action-btn");
  const stage = document.getElementById("breathing-stage-lbl");

  if (breathingIntervalId) {
    clearInterval(breathingIntervalId);
    breathingIntervalId = null;
    btn.innerText = "Start Relaxation Timer";
    stage.innerText = "Breathe";
    stage.className = "text-white text-xs font-black z-10 font-mono tracking-widest uppercase";
    return;
  }

  btn.innerText = "Stop Timer";
  let count = 0;
  
  breathingIntervalId = setInterval(() => {
    count += 1;
    const stages = ["Inhale 💨", "Hold 🧘", "Exhale 🍃"];
    stage.innerText = stages[count % 3];
  }, 2000);
  stage.innerText = "Inhale 💨";
  showToast("Breathing relaxation timer active. Focus on the circle.", "success");
}

function resetBreathingTextLoop() {
  if (breathingIntervalId) {
    clearInterval(breathingIntervalId);
    breathingIntervalId = null;
  }
}

function logStudentMood(mood) {
  if (mood === 'anxious') {
    showToast("Take it easy. Exams are just tests, your value is unique!", "warning");
  } else if (mood === 'fine') {
    showToast("Awesome spirit! Go practice a couple of questions now.", "success");
  } else {
    showToast("Mood registered. Remember to take study breaks!", "success");
  }
}

// 6. Settings and Reset portal
function renderSettingsView() {
  const container = document.getElementById("view-settings");
  const user = ExamEdgeDB.getUser();
  if (!user) return;

  container.innerHTML = `
    <div class="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-indigo-500/10">
      <h2 class="text-2xl font-extrabold text-white mb-6">Settings & Subscription Management</h2>

      <!-- Profile Summary -->
      <div class="mb-6 pb-6 border-b border-indigo-900/60 text-left">
        <h3 class="text-base font-bold text-white mb-2">Account Profile</h3>
        <p class="text-xs text-gray-400">Name: <span class="text-white font-semibold">${user.name}</span></p>
        <p class="text-xs text-gray-400 mt-1">Phone: <span class="text-white font-semibold">${user.phone}</span></p>
        <p class="text-xs text-gray-400 mt-1">School: <span class="text-white font-semibold">${user.school_name}</span></p>
        <p class="text-xs text-gray-400 mt-1">Subscription Tier: <span class="text-amber-400 font-extrabold">${user.subscription_tier.toUpperCase()}</span></p>
      </div>

      <!-- Upgrade Premium Banner -->
      ${user.subscription_tier === 'free' 
        ? `
          <div class="p-6 bg-gradient-to-br from-amber-600/20 to-yellow-600/10 border border-amber-500/30 rounded-2xl text-left mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 class="text-base font-bold text-amber-300">🔑 Unlock Student Premium</h3>
              <p class="text-xs text-gray-400 mt-1 leading-relaxed">Gain unlimited questions, mock exams, full statistics logging, and offline subject bundles.</p>
            </div>
            <button onclick="openPaystackSim()" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-amber-500/10">
              Upgrade (₦2,500/mo)
            </button>
          </div>
        `
        : `
          <div class="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-left mb-8">
            <h3 class="text-base font-bold text-emerald-400">✨ Premium Subscription Active</h3>
            <p class="text-xs text-gray-400 mt-1">Enjoy unlimited question bank access, PWA downloads, and readiness scoring. Thank you for studying with ExamEdge!</p>
          </div>
        `
      }

      <!-- Offline subject bundles (Premium) -->
      <div class="text-left mb-8 pb-8 border-b border-indigo-900/60">
        <h3 class="text-sm font-bold text-indigo-400 mb-2">Offline Subject Downloads</h3>
        <p class="text-xs text-gray-500 mb-3">Download a full subject for offline practice (Premium).</p>
        <div class="flex flex-wrap gap-2">
          ${(user.subjects || ["Mathematics", "Biology", "Chemistry"]).map(s => `
            <button onclick="downloadSubjectOffline('${s}')" class="px-3 py-1.5 bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-900/40">${s}</button>
          `).join("")}
        </div>
      </div>

      <!-- Portal links -->
      <div class="text-left mb-8 pb-8 border-b border-indigo-900/60 grid gap-2">
        <a href="teacher.html" class="text-xs text-indigo-400 hover:underline">👩‍🏫 Teacher Dashboard</a>
        <a href="parent.html" class="text-xs text-indigo-400 hover:underline">👨‍👩‍👧 Parent Portal</a>
        <a href="school-portal.html" class="text-xs text-indigo-400 hover:underline">🏫 School Institutional Portal</a>
      </div>

      <!-- Admin Portal Link -->
      <div class="text-left mb-8 pb-8 border-b border-indigo-900/60">
        <h3 class="text-sm font-bold text-indigo-400 mb-2">Platform Administration</h3>
        <p class="text-xs text-gray-500 mb-4">Manage past questions, view all student logs, and perform full system database resets.</p>
        <a href="admin.html" class="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/15">
          🛡️ Open Admin Panel
        </a>
      </div>

      <!-- Danger Zone Reset -->
      <div class="text-left">
        <h3 class="text-sm font-bold text-rose-400 mb-2">Danger Zone</h3>
        <p class="text-xs text-gray-500 mb-4">Reset all of your locally recorded study history, streaks, and mock scores.</p>
        
        <div class="flex gap-4">
          <button onclick="triggerResetStorageData()" class="px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-bold transition-all">
            Clear Study Progress
          </button>
          
          <button onclick="triggerAppLogout()" class="px-5 py-2.5 bg-gray-500/10 border border-gray-500/30 text-gray-400 hover:bg-gray-500/20 rounded-xl text-xs font-bold transition-all">
            Logout Profile
          </button>
        </div>
      </div>

    </div>
  `;
}

function triggerResetStorageData() {
  if (confirm("This will permanently clear all of your scores, weakness maps, XP, and streaks. Are you absolutely sure?")) {
    ExamEdgeDB.resetData();
    showToast("Storage progress cleared successfully!", "success");
    navigate("dashboard");
  }
}

function triggerAppLogout() {
  if (confirm("Are you sure you want to logout?")) {
    ExamEdgeDB.logout();
    showToast("Logged out successfully!", "success");
    document.getElementById("sidebar-nav").classList.add("hidden");
    document.getElementById("bottom-nav").classList.add("hidden");
    navigate("auth");
  }
}

// ----------------------------------------------------
// INTERACTIVE INTEGRATION WIDGETS
// ----------------------------------------------------

// 1. Simulated Paystack Payment Sandbox Gateway
function openPaystackSim() {
  const overlay = document.getElementById("paystack-sim-overlay");
  overlay.innerHTML = `
    <div class="glass-panel w-full max-w-sm p-6 rounded-2xl border border-indigo-500/20 relative shadow-2xl overflow-hidden text-center">
      
      <!-- Close button -->
      <button onclick="closePaystackSim()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-lg">&times;</button>

      <!-- Paystack Logo Mock -->
      <div class="flex justify-center items-center gap-1.5 mb-4">
        <span class="text-emerald-400 text-lg">⚡</span>
        <span class="text-white font-black tracking-tight text-sm">paystack</span>
        <span class="text-xs text-gray-500">SANDBOX</span>
      </div>

      <!-- Price summary -->
      <div class="mb-6">
        <span class="text-xs text-gray-400 font-bold block uppercase tracking-wider">ExamEdge Student Premium</span>
        <h2 class="text-2xl font-black text-white mt-1">₦2,500.00</h2>
        <span class="text-xs text-emerald-400 font-semibold block mt-1">chidi.adebayo@gmail.com</span>
      </div>

      <!-- card input fields -->
      <div id="paystack-card-view">
        <div class="text-left mb-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Card Number</label>
          <div class="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-3 flex items-center gap-2">
            <span class="text-sm">💳</span>
            <input type="text" placeholder="4012 8888 8888 1881" class="w-full bg-transparent text-sm text-white placeholder-gray-700 outline-none font-semibold">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="text-left">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Expiry Date</label>
            <input type="text" placeholder="MM / YY" class="w-full bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-3 text-sm text-white placeholder-gray-700 outline-none font-semibold">
          </div>
          <div class="text-left">
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">CVV</label>
            <input type="text" placeholder="123" class="w-full bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-3 text-sm text-white placeholder-gray-700 outline-none font-semibold">
          </div>
        </div>

        <button onclick="processPaystackCard()" class="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 transition-all text-sm">
          Pay ₦2,500
        </button>
      </div>

      <!-- OTP Authorization View -->
      <div id="paystack-otp-view" class="hidden">
        <p class="text-gray-400 text-xs mb-4 leading-relaxed">A simulated bank 4-digit security code has been sent to your phone. Enter it below.</p>
        
        <input type="text" id="paystack-otp-input" placeholder="Enter Mock Bank Code" class="w-full bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-3.5 text-center text-lg font-bold text-white placeholder-gray-700 outline-none mb-4">

        <button onclick="submitPaystackOTP()" class="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3.5 rounded-xl transition-all text-sm">
          Authorize Charge
        </button>
      </div>

      <!-- Success Screen -->
      <div id="paystack-success-view" class="hidden">
        <div class="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-xl mx-auto mb-4">
          ✓
        </div>
        <h3 class="text-lg font-bold text-white mb-2">Payment Successful!</h3>
        <p class="text-xs text-gray-400 mb-6">Your student account has been successfully upgraded to Premium. Restarting dashboard.</p>
        
        <button onclick="closePaystackSim(true)" class="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold py-3 rounded-xl transition-all text-xs">
          Return to Dashboard
        </button>
      </div>

    </div>
  `;

  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
}

function closePaystackSim(success = false) {
  const overlay = document.getElementById("paystack-sim-overlay");
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");

  if (success) {
    ExamEdgeDB.upgradeToPremium();
    showToast("Premium successfully activated! Enjoy unlimited questions.", "success");
    triggerMicroConfetti();
    
    // Refresh active views
    navigate(ACTIVE_VIEW);
  }
}

function processPaystackCard() {
  showToast("Routing transaction to bank security...", "info");
  
  // Visual transition
  document.getElementById("paystack-card-view").classList.add("hidden");
  document.getElementById("paystack-otp-view").classList.remove("hidden");

  // Show bank secure banner
  showSMSBanner("[BANK SYSTEM SECURE OTP] Verification code for Paystack ₦2,500 is: 7712");
}

function submitPaystackOTP() {
  const entered = document.getElementById("paystack-otp-input").value.trim();
  if (entered !== "7712") {
    showToast("Invalid bank verification code!", "error");
    return;
  }

  document.getElementById("paystack-otp-view").classList.add("hidden");
  document.getElementById("paystack-success-view").classList.remove("hidden");
}

// 2. WhatsApp Study Bot Widget Simulator
function toggleWhatsApp() {
  WHATSAPP_SESSION.open = !WHATSAPP_SESSION.open;
  const widget = document.getElementById("whatsapp-widget");
  const panel = document.getElementById("whatsapp-panel");

  if (WHATSAPP_SESSION.open) {
    // Populate chat messages
    renderWhatsAppMessages();
    panel.classList.remove("hidden");
    widget.classList.add("ring-2", "ring-emerald-500");
  } else {
    panel.classList.add("hidden");
    widget.classList.remove("ring-2", "ring-emerald-500");
  }
}

function renderWhatsAppMessages() {
  const box = document.getElementById("whatsapp-msg-box");
  if (!box) return;

  let msgHtml = "";
  WHATSAPP_SESSION.messages.forEach(msg => {
    const isBot = msg.sender === "bot";
    msgHtml += `
      <div class="flex flex-col ${isBot ? 'items-start' : 'items-end'} mb-3">
        <div class="max-w-4/5 p-3 rounded-2xl text-xs leading-relaxed ${isBot ? 'bg-[#202c33] text-white border border-[#2f3b43] rounded-tl-none' : 'bg-[#005c4b] text-white rounded-tr-none'}">
          ${msg.text}
        </div>
        <span class="text-[10px] text-gray-500 mt-1 px-1">${msg.time}</span>
      </div>
    `;
  });

  box.innerHTML = msgHtml;
  box.scrollTop = box.scrollHeight; // Scroll to bottom
}

function sendWhatsAppMessage() {
  const input = document.getElementById("whatsapp-input-field");
  if (!input) return;

  const txt = input.value.trim().toUpperCase();
  if (txt === "") return;

  // Add student message
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  WHATSAPP_SESSION.messages.push({
    sender: "student",
    text: txt,
    time: timeStr
  });

  input.value = "";
  renderWhatsAppMessages();

  // Trigger typing indicator and reply
  const box = document.getElementById("whatsapp-msg-box");
  const typingDiv = document.createElement("div");
  typingDiv.className = "flex items-start mb-3" + " typing-indicator-node";
  typingDiv.innerHTML = `
    <div class="bg-[#202c33] p-3 rounded-2xl flex items-center gap-1">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  box.appendChild(typingDiv);
  box.scrollTop = box.scrollHeight;

  setTimeout(() => {
    // Remove typing
    document.querySelectorAll(".typing-indicator-node").forEach(n => n.remove());

    // Generate responsive bot reply
    let replyText = "";
    if (txt === "B") {
      replyText = "🎉 <b>CORRECT!</b> Green plants are primary producers because they make their own food through photosynthesis.<br><br>💡 <b>Explanation:</b> Chlorophyll captures solar energy to convert CO2 and water into glucose.<br><br>👉 Want to practice 20 more questions? Tap here: <a onclick=\"navigate('practice')\" class=\"text-emerald-400 font-bold underline cursor-pointer\">Start Mock Session</a>";
    } else if (["A", "C", "D"].includes(txt)) {
      replyText = "❌ <b>INCORRECT.</b> The correct answer was <b>B (Green plant)</b>.<br><br>💡 <b>Explanation:</b> Grasshoppers are primary consumers; lions are top carnivores; frogs are secondary consumers. Only green plants make food from scratch.<br><br>👉 Study the topic step-by-step: <a onclick=\"navigate('practice')\" class=\"text-emerald-400 font-bold underline cursor-pointer\">Review Practice Engine</a>";
    } else {
      replyText = "👋 Welcome to <b>ExamEdge Opt-In Daily Question Bot!</b><br><br>Please respond only with the letter <b>A</b>, <b>B</b>, <b>C</b>, or <b>D</b> to answer the active question above.";
    }

    WHATSAPP_SESSION.messages.push({
      sender: "bot",
      text: replyText,
      time: timeStr
    });

    renderWhatsAppMessages();
  }, 1500);
}

// Allows direct sharing of questions from the study mode feedback screen to the WhatsApp simulator widget
function triggerWhatsAppDailyChallengeSim(questionId) {
  const q = ExamEdgeDB.getQuestions().find(item => item.id === questionId);
  if (!q) return;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const textFormat = `
    ⭐ <b>Student shared a new challenge!</b><br>
    <b>Subject:</b> ${q.subject}<br>
    <b>Topic:</b> ${q.topic}<br>
    <b>Question:</b> <i>${q.question}</i><br>
    A) ${q.options.A}<br>
    B) ${q.options.B}<br>
    C) ${q.options.C}<br>
    D) ${q.options.D}<br><br>
    Reply with <b>A</b>, <b>B</b>, <b>C</b>, or <b>D</b>!
  `;

  WHATSAPP_SESSION.messages.push({
    sender: "bot",
    text: textFormat,
    time: timeStr
  });

  // Re-link simulated bot answering check to match new shared question answer keys
  // For simplicity, we trigger the bot widget open so the student sees it immediately!
  if (!WHATSAPP_SESSION.open) {
    toggleWhatsApp();
  } else {
    renderWhatsAppMessages();
  }

  showToast("Question shared to WhatsApp Simulator!", "success");
}

// ----------------------------------------------------
// PLATFORM LEVEL MISC ASSISTS
// ----------------------------------------------------

// Custom Toast alert builder
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  let bgStyle = "bg-emerald-950 border-emerald-500 text-emerald-300";
  if (type === "error") bgStyle = "bg-rose-950 border-rose-500 text-rose-300";
  if (type === "warning") bgStyle = "bg-amber-950 border-amber-500 text-amber-300";
  if (type === "info") bgStyle = "bg-indigo-950 border-indigo-500 text-indigo-300";

  toast.className = `p-4 border rounded-xl text-xs font-semibold shadow-lg ${bgStyle} flex items-center justify-between pointer-events-auto min-w-[280px] animate-bounce`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="ml-4 font-bold opacity-50 hover:opacity-100" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  // Auto remove in 3.5s
  setTimeout(() => {
    toast.classList.remove("animate-bounce");
    toast.classList.add("opacity-0", "transition-all", "duration-500");
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3500);
}

// Simulated SMS Banner pusher (Visual notification)
function showSMSBanner(text) {
  const container = document.getElementById("sms-banner-container");
  if (!container) return;

  const banner = document.createElement("div");
  banner.className = "bg-indigo-650/95 border-b border-indigo-500/30 text-white font-mono p-3 text-xs w-full shadow-lg flex items-center justify-between animate-slide-down relative z-[99999]";
  banner.innerHTML = `
    <div class="flex items-center gap-2">
      <span>✉️</span>
      <span class="font-bold">MOCK SMS:</span>
      <span class="opacity-95 select-all">${text}</span>
    </div>
    <button class="font-bold opacity-60 hover:opacity-100 px-2" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(banner);

  // Keep it persistent or auto remove after 12s
  setTimeout(() => {
    if (banner.parentElement) {
      banner.remove();
    }
  }, 12000);
}

// Sparkle micro confetti effects on correct completions
function triggerMicroConfetti() {
  const colors = ["#8b5cf6", "#6366f1", "#f59e0b", "#10b981", "#f43f5e"];
  for (let i = 0; i < 40; i++) {
    const flake = document.createElement("div");
    flake.className = "confetti";
    
    // Random placement and velocities
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.top = `-10px`;
    flake.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    flake.style.transform = `rotate(${Math.random() * 360}deg)`;
    flake.style.width = `${Math.random() * 6 + 6}px`;
    flake.style.height = `${Math.random() * 6 + 6}px`;
    
    // Set custom transition duration
    const speed = Math.random() * 2 + 1.5;
    flake.style.animation = `confetti-fall ${speed}s linear forwards`;

    document.body.appendChild(flake);

    setTimeout(() => {
      flake.remove();
    }, speed * 1000);
  }
}

// Global click binders
function setupEventListeners() {
  // Bind sidebar logo trigger to Home dashboard
  const logo = document.getElementById("nav-logo-btn");
  if (logo) {
    logo.addEventListener("click", () => navigate("dashboard"));
  }

  // Bind key inputs for SMS widget
  const whatsappInput = document.getElementById("whatsapp-input-field");
  if (whatsappInput) {
    whatsappInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendWhatsAppMessage();
      }
    });
  }
}
