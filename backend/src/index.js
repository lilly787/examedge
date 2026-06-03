const path = require("path");
const express = require("express");
const cors = require("cors");
const config = require("./config");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const progressRoutes = require("./routes/progress");
const aiRoutes = require("./routes/ai");
const paymentRoutes = require("./routes/payments");
const whatsappRoutes = require("./routes/whatsapp");
const waitlistRoutes = require("./routes/waitlist");
const teacherRoutes = require("./routes/teachers");
const parentRoutes = require("./routes/parents");
const schoolRoutes = require("./routes/schools");
const gamificationRoutes = require("./routes/gamification");
const offlineRoutes = require("./routes/offline");

const app = express();
const rootDir = path.join(__dirname, "../..");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    const { query } = require("./db/pool");
    await query("SELECT 1");
    res.json({
      status: "ok",
      phase: "0-2",
      env: config.nodeEnv,
    });
  } catch (e) {
    res.status(503).json({ status: "degraded", error: e.message });
  }
});

app.get("/api/config/public", (_req, res) => {
  res.json({
    paystack_public_key: config.paystack.publicKey,
    free_daily_limit: config.freeTier.dailyQuestionLimit,
    premium_monthly_naira: config.premium.monthlyKobo / 100,
    features: {
      ai_tutor: !!config.anthropic.apiKey,
      whatsapp: !!config.whatsapp.token,
      sms_otp: !!config.termii.apiKey,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/offline", offlineRoutes);

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

app.use(express.static(rootDir));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  let filePath = path.join(rootDir, req.path === "/" ? "landing.html" : req.path);
  if (!path.extname(filePath)) filePath += ".html";
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("Not found");
  });
});

app.listen(config.port, "127.0.0.1", () => {
  console.log(`\n✅ ExamEdge running at ${config.appUrl}`);
  console.log(`   API: ${config.appUrl}/api/health`);
  console.log(`   Student app: ${config.appUrl}/index.html`);
  console.log(`   Landing: ${config.appUrl}/landing.html\n`);
});
