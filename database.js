// ExamEdge Client-Side Database Engine & Performance Analyzer
// Powered by LocalStorage to run fully client-side and 100% offline.

const DB_PREFIX = "EXAMEDGE_";

// Helper to interact with LocalStorage safely
const storage = {
  get: (key, defaultVal = null) => {
    try {
      const val = localStorage.getItem(DB_PREFIX + key);
      return val ? JSON.parse(val) : defaultVal;
    } catch (e) {
      console.error("Error reading localStorage key: " + key, e);
      return defaultVal;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(DB_PREFIX + key, JSON.stringify(val));
    } catch (e) {
      console.error("Error writing localStorage key: " + key, e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(DB_PREFIX + key);
    } catch (e) {
      console.error("Error removing localStorage key: " + key, e);
    }
  }
};

// Default User Profile
const DEFAULT_USER = {
  id: "student-99",
  name: "Chidi Adebayo",
  phone: "+2348031234567",
  email: "chidi.adebayo@gmail.com",
  role: "student",
  school_name: "Government College, Lagos",
  role: "student",
  subscription_tier: "free", // "free" or "premium"
  ss_class: "SS3",
  subjects: ["Mathematics", "English Language", "Biology", "Chemistry", "Physics"],
  exam_target: "WAEC", // "WAEC" | "JAMB" | "NECO"
  exam_date: "2026-06-15", // Target Exam Date
  study_streak: 3, // Days in a row
  last_active_date: new Date().toISOString().split("T")[0]
};

// Default Mock Leaderboard
const DEFAULT_LEADERBOARD = [
  { rank: 1, name: "Fatima Yusuf", school: "Queen's College, Yaba", state: "Lagos", score: 960, xp: 4800, isUser: false },
  { rank: 2, name: "Emeka Obi", school: "King's College, Lagos", state: "Lagos", score: 910, xp: 4550, isUser: false },
  { rank: 3, name: "Oluwaseun Balogun", school: "Loyola Jesuit College", state: "Abuja", score: 870, xp: 4350, isUser: false },
  { rank: 4, name: "Amina Bello", school: "Federal Govt College, Kaduna", state: "Kaduna", score: 840, xp: 4200, isUser: false },
  { rank: 5, name: "Chidi Adebayo", school: "Government College, Lagos", state: "Lagos", score: 0, xp: 150, isUser: true }, // Placed dynamically
  { rank: 6, name: "Tunde Bakare", school: "Baptist Academy, Obanikoro", state: "Lagos", score: 720, xp: 3600, isUser: false },
  { rank: 7, name: "Ngozi Okafor", school: "Grange School, Ikeja", state: "Lagos", score: 680, xp: 3400, isUser: false },
  { rank: 8, name: "Ibrahim Musa", school: "Barewa College, Zaria", state: "Kaduna", score: 650, xp: 3250, isUser: false }
];

// ── Complete weakness map schema (all subjects + topics) ─────────────
const INITIAL_WEAKNESS_MAP = {
  "Mathematics": {
    "Algebra":                    { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Calculus":                   { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Geometry":                   { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Statistics & Probability":   { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Mensuration":                { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Number & Numeration":        { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Trigonometry":               { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "English Language": {
    "Vocabulary":                 { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Grammar":                    { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Oral English":               { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Comprehension & Summary":    { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Literature in English":      { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Physics": {
    "Mechanics":                  { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Electricity & Magnetism":    { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Waves & Optics":             { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Heat & Thermodynamics":      { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Nuclear & Modern Physics":   { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Chemistry": {
    "Atomic Structure & Periodic Table": { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Chemical Bonding":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Acids, Bases & Salts":       { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Organic Chemistry":          { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Stoichiometry & Calculations":{ attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Physical Chemistry":         { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Electrochemistry & Redox":   { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Metals, Alloys & Industry":  { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Biology": {
    "Cell Biology":               { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Genetics & Evolution":       { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Ecology & Environment":      { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Human Biology & Health":     { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Plant Biology":              { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Classification & Diversity": { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Economics": {
    "Microeconomics":             { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Macroeconomics":             { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Nigerian Economy":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Government": {
    "Political Concepts":         { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Nigerian Government":        { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Comparative Government":     { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Geography": {
    "Physical Geography":         { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Human Geography":            { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Map Reading":                { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Financial Accounting": {
    "Bookkeeping & Accounts":     { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Company Accounts":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Accounting Concepts":        { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Commerce": {
    "Trade & Distribution":       { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Business Organizations":     { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Banking & Finance":          { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Literature in English": {
    "Poetry":                     { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Prose":                      { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Drama":                      { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "History": {
    "Nigerian History":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "African History":            { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "World History":              { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Agricultural Science": {
    "Crop Production":            { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Animal Husbandry":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Agricultural Economics":     { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Soils & Land Use":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Computer Science": {
    "Hardware & Software":        { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Programming & Logic":        { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Data & Networks":            { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Further Mathematics": {
    "Pure Mathematics":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Statistics":                 { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Mechanics (Further)":        { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Christian Religious Studies": {
    "Old Testament":              { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "New Testament":              { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Christian Living":           { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Islamic Religious Studies": {
    "Quran & Hadith":             { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Pillars & Beliefs":          { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Islamic History & Law":      { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Civic Education": {
    "Citizenship":                { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Governance & Society":       { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "French": {
    "Grammar & Language":         { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Vocabulary & Communication": { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Yoruba": {
    "Grammar":                    { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Literature & Culture":       { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Igbo": {
    "Grammar":                    { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Literature & Culture":       { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  },
  "Hausa": {
    "Grammar":                    { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" },
    "Literature & Culture":       { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" }
  }
};

const ExamEdgeDB = {
  // 1. Authentication & Session Manager
  init: () => {
    // If no user exists, store a flag indicating we need to authenticate first,
    // or seed a default user profile to let the user play.
    if (!storage.get("user")) {
      storage.set("user", null); // Set null to trigger the OTP login page initially
    }
    if (!storage.get("progress")) {
      storage.set("progress", []); // Empty array of attempts
    }
    if (!storage.get("daily_limit")) {
      storage.set("daily_limit", { date: new Date().toISOString().split("T")[0], count: 0 });
    }
    if (!storage.get("leaderboard")) {
      storage.set("leaderboard", DEFAULT_LEADERBOARD);
    }
    if (!storage.get("xp")) {
      storage.set("xp", 150); // Seed XP
    }
    // Seed weakness map with full subject/topic schema if not already present
    if (!storage.get("weaknessMap")) {
      storage.set("weaknessMap", JSON.parse(JSON.stringify(INITIAL_WEAKNESS_MAP)));
    }
  },

  // Log in student via phone (local / demo)
  login: (phone, name = "Chidi Adebayo") => {
    const userProfile = {
      ...DEFAULT_USER,
      phone: phone,
      name: name
    };
    storage.set("user", userProfile);
    ExamEdgeDB.init();

    // Save to examedge_user
    const userObj = {
      id: userProfile.id || 'u-' + Date.now(),
      name: userProfile.name,
      email: userProfile.email || "",
      phone: userProfile.phone,
      role: userProfile.role || "student",
      createdAt: userProfile.joinedAt || userProfile.createdAt || new Date().toISOString()
    };
    localStorage.setItem('examedge_user', JSON.stringify(userObj));

    return userProfile;
  },

  loginProfile: (profile) => {
    const userProfile = { ...DEFAULT_USER, ...profile };
    storage.set("user", userProfile);
    localStorage.setItem("EXAMEDGE_LOGGED_IN", "true");
    ExamEdgeDB.init();

    // Save to examedge_user
    const userObj = {
      id: userProfile.id || 'u-' + Date.now(),
      name: userProfile.name,
      email: userProfile.email || "",
      phone: userProfile.phone,
      role: userProfile.role || "student",
      createdAt: userProfile.joinedAt || userProfile.createdAt || new Date().toISOString()
    };
    localStorage.setItem('examedge_user', JSON.stringify(userObj));

    return userProfile;
  },

  // Log in from API response (Phases 1–2 backend)
  loginFromApi: (apiUser, token) => {
    if (token && typeof ExamEdgeAPI !== "undefined") {
      ExamEdgeAPI.setToken(token);
    } else if (token) {
      localStorage.setItem("EXAMEDGE_token", token);
    }
    const userProfile = {
      ...DEFAULT_USER,
      id: apiUser.id,
      name: apiUser.name,
      phone: apiUser.phone,
      role: apiUser.role || "student",
      school_name: apiUser.school_name || DEFAULT_USER.school_name,
      subscription_tier: apiUser.subscription_tier || "free",
      ss_class: apiUser.ss_class || DEFAULT_USER.ss_class,
      subjects: Array.isArray(apiUser.subjects)
        ? apiUser.subjects
        : typeof apiUser.subjects === "string"
          ? JSON.parse(apiUser.subjects || "[]")
          : DEFAULT_USER.subjects,
      exam_target: apiUser.exam_target || "WAEC",
      exam_date: apiUser.exam_date || DEFAULT_USER.exam_date,
      study_streak: apiUser.study_streak || 0,
      parent_link_code: apiUser.parent_link_code,
    };
    storage.set("user", userProfile);
    localStorage.setItem("EXAMEDGE_LOGGED_IN", "true");

    // Save to examedge_user
    const userObj = {
      id: userProfile.id || 'u-' + Date.now(),
      name: userProfile.name,
      email: userProfile.email || apiUser.email || "",
      phone: userProfile.phone,
      role: userProfile.role || "student",
      createdAt: userProfile.createdAt || apiUser.createdAt || new Date().toISOString()
    };
    localStorage.setItem('examedge_user', JSON.stringify(userObj));

    return userProfile;
  },

  logout: () => {
    storage.remove("user");
    storage.remove("progress");
    storage.remove("daily_limit");
    storage.remove("xp");
    storage.remove("leaderboard");
    localStorage.removeItem("EXAMEDGE_LOGGED_IN");
    if (typeof ExamEdgeAPI !== "undefined") ExamEdgeAPI.setToken(null);
    else localStorage.removeItem("EXAMEDGE_token");

    // Clear examedge_user and other session keys
    localStorage.removeItem("examedge_user");
    localStorage.removeItem("examedge_progress");
    localStorage.removeItem("examedge_streak");
  },

  getUser: () => {
    return storage.get("user");
  },

  updateUser: (fields) => {
    const user = ExamEdgeDB.getUser();
    if (user) {
      const updated = { ...user, ...fields };
      storage.set("user", updated);
      return updated;
    }
    return null;
  },

  // Unlock Premium Mode
  upgradeToPremium: () => {
    const user = ExamEdgeDB.getUser();
    if (user) {
      user.subscription_tier = "premium";
      storage.set("user", user);
      return true;
    }
    return false;
  },

  // Get total XP points
  getXP: () => {
    return storage.get("xp", 150);
  },

  addXP: (amount) => {
    const xp = ExamEdgeDB.getXP() + amount;
    storage.set("xp", xp);

    // Update user rank on Leaderboard dynamically
    const leaderboard = storage.get("leaderboard", DEFAULT_LEADERBOARD);
    const user = ExamEdgeDB.getUser();
    const userEntryIndex = leaderboard.findIndex(e => e.isUser);
    if (userEntryIndex !== -1 && user) {
      leaderboard[userEntryIndex].xp = xp;
      leaderboard[userEntryIndex].score = Math.floor(xp * 0.2) + 50; // Dynamic scores
      leaderboard[userEntryIndex].name = user.name;
      leaderboard[userEntryIndex].school = user.school_name;

      // Resort leaderboard by XP descending
      leaderboard.sort((a, b) => b.xp - a.xp);

      // Reassign rank index
      leaderboard.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });

      storage.set("leaderboard", leaderboard);
    }
  },

  getLeaderboard: () => {
    return storage.get("leaderboard", DEFAULT_LEADERBOARD);
  },

  // 2. Daily Limits Tracker (20 questions / day limit for Free Tier)
  getDailyLimitInfo: () => {
    const user = ExamEdgeDB.getUser();
    const limitInfo = storage.get("daily_limit") || { date: new Date().toISOString().split("T")[0], count: 0 };
    const today = new Date().toISOString().split("T")[0];

    // Reset if it's a new day
    if (limitInfo.date !== today) {
      limitInfo.date = today;
      limitInfo.count = 0;
      storage.set("daily_limit", limitInfo);
    }

    const limitMax = 20;
    const reached = user && user.subscription_tier === "free" && limitInfo.count >= limitMax;

    return {
      count: limitInfo.count,
      limit: limitMax,
      reached: reached,
      tier: user ? user.subscription_tier : "free"
    };
  },

  incrementDailyCount: () => {
    const limitInfo = storage.get("daily_limit") || { date: new Date().toISOString().split("T")[0], count: 0 };
    const today = new Date().toISOString().split("T")[0];

    if (limitInfo.date !== today) {
      limitInfo.date = today;
      limitInfo.count = 1;
    } else {
      limitInfo.count += 1;
    }
    storage.set("daily_limit", limitInfo);
    return limitInfo.count;
  },

  // 3. Question Attempts Logger & Evaluator
  logAttempt: (questionId, isCorrect, timeTakenSeconds, questionObj) => {
    const user = ExamEdgeDB.getUser();
    if (!user) return;

    // Check limit first
    const limitInfo = ExamEdgeDB.getDailyLimitInfo();
    if (user.subscription_tier === "free" && limitInfo.count >= limitInfo.limit) {
      return { success: false, reason: "limit_reached" };
    }

    // Record the attempt
    const progress = storage.get("progress") || [];
    const attemptNumber = progress.filter(p => p.question_id === questionId).length + 1;

    const newAttempt = {
      student_id: user.id,
      question_id: questionId,
      is_correct: isCorrect,
      time_taken_seconds: timeTakenSeconds,
      attempt_number: attemptNumber,
      attempted_at: new Date().toISOString()
    };

    progress.push(newAttempt);
    storage.set("progress", progress);

    // ── Update per-topic weakness map ──────────────────────────────────
    if (questionObj && questionObj.subject && questionObj.topic) {
      const wm = storage.get("weaknessMap") || JSON.parse(JSON.stringify(INITIAL_WEAKNESS_MAP));
      const sub = questionObj.subject;
      const top = questionObj.topic;

      // Ensure subject and topic exist (handles newly tagged topics)
      if (!wm[sub]) wm[sub] = {};
      if (!wm[sub][top]) {
        wm[sub][top] = { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" };
      }

      wm[sub][top].attempts += 1;
      if (isCorrect) wm[sub][top].correct += 1;

      const acc = (wm[sub][top].correct / wm[sub][top].attempts) * 100;
      wm[sub][top].accuracy = parseFloat(acc.toFixed(1));

      // Status thresholds
      if (wm[sub][top].attempts === 0) {
        wm[sub][top].status = "Unattempted";
      } else if (acc < 60) {
        wm[sub][top].status = "Needs Work";
      } else if (acc <= 85) {
        wm[sub][top].status = "Progressing";
      } else {
        wm[sub][top].status = "Strong";
      }

      storage.set("weaknessMap", wm);
    }

    // Increment daily practice limit count
    ExamEdgeDB.incrementDailyCount();

    // Reward XP: 10 XP for attempting, +15 XP if correct (total 25 XP)
    const xpRewarded = 10 + (isCorrect ? 15 : 0);
    ExamEdgeDB.addXP(xpRewarded);

    // Update streak counter
    ExamEdgeDB.updateStreak();

    return { success: true, xpRewarded };
  },

  // Handle Streak updates
  updateStreak: () => {
    const user = ExamEdgeDB.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (user.last_active_date === today) {
      // Already active today, streak remains
      return;
    } else if (user.last_active_date === yesterday) {
      // active yesterday, increment streak
      user.study_streak += 1;
    } else {
      // Broke streak, reset to 1
      user.study_streak = 1;
    }
    user.last_active_date = today;
    storage.set("user", user);
  },

  // 4. Custom Performance Engines (WeaknessMap & Readiness Score)

  // Return the stored weakness map (updated live after each answer)
  getWeaknessMap: (questionsList) => {
    const stored = storage.get("weaknessMap");
    if (stored) return stored;

    // Fallback: build from scratch if not yet persisted
    const wm = JSON.parse(JSON.stringify(INITIAL_WEAKNESS_MAP));
    const progress = storage.get("progress") || [];
    const questions = questionsList || [];

    progress.forEach(attempt => {
      const q = questions.find(item => item.id === attempt.question_id);
      if (q && q.subject && q.topic) {
        if (!wm[q.subject]) wm[q.subject] = {};
        if (!wm[q.subject][q.topic]) {
          wm[q.subject][q.topic] = { attempts: 0, correct: 0, accuracy: 0, status: "Unattempted" };
        }
        wm[q.subject][q.topic].attempts += 1;
        if (attempt.is_correct) wm[q.subject][q.topic].correct += 1;
        const acc = (wm[q.subject][q.topic].correct / wm[q.subject][q.topic].attempts) * 100;
        wm[q.subject][q.topic].accuracy = parseFloat(acc.toFixed(1));
        wm[q.subject][q.topic].status = acc < 60 ? "Needs Work" : acc <= 85 ? "Progressing" : "Strong";
      }
    });

    storage.set("weaknessMap", wm);
    return wm;
  },

  // Live 0–100% Exam Readiness Score calculation
  getExamReadinessScore: (questionsList) => {
    const progress = storage.get("progress") || [];
    if (progress.length === 0) return 0;

    // A beautiful compound formula:
    // Breadth (Coverage) = Unique questions attempted / total questions (weight: 35%)
    // Depth (Accuracy) = Average accuracy rate of attempted questions (weight: 55%)
    // Consistency (Streak) = Daily streak bonus (weight: 10% - caps at 100% streak)

    const totalQuestions = questionsList.length;
    const uniqueAttemptedIds = [...new Set(progress.map(p => p.question_id))];
    const uniqueAttemptedCount = uniqueAttemptedIds.length;

    // 1. Breadth score
    const breadthScore = (uniqueAttemptedCount / totalQuestions) * 100;

    // 2. Depth score
    const correctAttempts = progress.filter(p => p.is_correct).length;
    const totalAttempts = progress.length;
    const depthScore = (correctAttempts / totalAttempts) * 100;

    // 3. Consistency score
    const user = ExamEdgeDB.getUser();
    const streak = user ? user.study_streak : 0;
    const consistencyScore = Math.min((streak / 7) * 100, 100); // 7 day streak is 100% consistency

    const finalScore = Math.round(
      (breadthScore * 0.35) + 
      (depthScore * 0.55) + 
      (consistencyScore * 0.10)
    );

    return Math.min(finalScore, 100);
  },

  // Reset progress and testing statistics
  resetData: () => {
    storage.set("progress", []);
    storage.set("xp", 150);
    storage.set("daily_limit", { date: new Date().toISOString().split("T")[0], count: 0 });
    storage.set("leaderboard", DEFAULT_LEADERBOARD);
    storage.set("weaknessMap", JSON.parse(JSON.stringify(INITIAL_WEAKNESS_MAP)));
    const user = ExamEdgeDB.getUser();
    if (user) {
      user.study_streak = 0;
      user.subscription_tier = "free";
      storage.set("user", user);
    }
  },

  // Get all questions (merged static + custom from localStorage)
  getQuestions: () => {
    const customQs = storage.get("custom_questions");
    if (!customQs) {
      return EXAMEDGE_QUESTIONS;
    }
    return customQs;
  },

  // Save the full list of custom questions
  saveQuestions: (list) => {
    storage.set("custom_questions", list);
  },

  // Reset custom questions back to default
  resetQuestions: () => {
    storage.remove("custom_questions");
  },

  // Clear all registered students to make the user the first
  clearAllStudents: () => {
    storage.remove("user");
    localStorage.removeItem("EXAMEDGE_all_students");
    localStorage.removeItem("EXAMEDGE_LOGGED_IN");
  },

  // Completely reset the system (wipe everything)
  resetSystem: () => {
    localStorage.clear();
    ExamEdgeDB.init();
  }
};

ExamEdgeDB.init();

function getRole() {
  const user = JSON.parse(localStorage.getItem('examedge_user') || 'null');
  return user ? user.role : null;
}

function hasRole(role) { return getRole() === role; }

if (typeof window !== 'undefined') {
  window.getRole = getRole;
  window.hasRole = hasRole;
}

// Exporting as global or ES Module based on loading mechanism
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExamEdgeDB, getRole, hasRole };
}
