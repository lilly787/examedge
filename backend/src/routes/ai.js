const express = require("express");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");
const { tutorReply, generateStudyPlan, buildFallbackPlan } = require("../services/claude");
const { getWeaknessMap } = require("../services/analytics");

const router = express.Router();

router.post("/tutor", authRequired, async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY || "";
    if (!apiKey || apiKey === "your-anthropic-api-key-here" || apiKey.endsWith("your-anthropic-api-key-here")) {
      return res.status(503).json({
        error: "AI tutor not configured",
        message: "Add a valid ANTHROPIC_API_KEY to your .env file"
      });
    }
    // Access ANTHROPIC_MODEL to ensure it is read
    const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

    const { question_id, student_answer, message } = req.body;
    const q = await query("SELECT * FROM questions WHERE id = $1", [question_id]);
    if (!q.rows.length) return res.status(404).json({ error: "Question not found" });

    const user = await query("SELECT subscription_tier FROM users WHERE id = $1", [req.user.id]);
    if (user.rows[0].subscription_tier === "free") {
      return res.status(403).json({
        error: "AI Tutor requires Premium",
        upgrade: true,
      });
    }

    const result = await tutorReply({
      question: q.rows[0],
      studentAnswer: student_answer,
      userMessage: message,
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/study-plan", authRequired, async (req, res) => {
  try {
    const { exam_date, subjects, hours_per_day = 2 } = req.body;
    if (!exam_date) {
      return res.status(400).json({ error: "Exam date is required" });
    }

    const subjectList = Array.isArray(subjects) ? subjects : [];
    
    // Attempt Claude generation first
    let generated;
    try {
      generated = await generateStudyPlan({ 
        examDate: exam_date, 
        subjects: subjectList, 
        weaknessMap: req.user.weakness_map || {}, 
        hoursPerDay: hours_per_day 
      });
    } catch (err) {
      console.error("[study-plan] Claude failed:", err.message);
      generated = { plan: buildFallbackPlan(exam_date, subjectList, hours_per_day), simulated: true };
    }
    const plan = generated.plan;

    let planId = null;
    if (req.user.role === "student") {
      try {
        const inserted = await query(
          `INSERT INTO study_plans (student_id, plan_json, exam_date) VALUES ($1, $2, $3) RETURNING id`,
          [req.user.id, JSON.stringify(plan), exam_date]
        );
        planId = inserted.rows[0].id;
      } catch (saveErr) {
        console.warn("[study-plan] could not save to DB:", saveErr.message);
      }
    }

    res.json({ plan_id: planId, plan, simulated: false });
  } catch (e) {
    console.error("[study-plan]", e);
    res.status(500).json({ error: e.message || "Could not generate study plan" });
  }
});

router.post("/study-plan/local", async (req, res) => {
  const { exam_date, subjects, hours_per_day = 2 } = req.body;
  if (!exam_date) {
    return res.status(400).json({ error: "Exam date is required" });
  }
  const plan = buildFallbackPlan(exam_date, subjects || [], hours_per_day);
  res.json({ plan, simulated: false });
});

router.get("/study-plan/latest", authRequired, requireRole("student"), async (req, res) => {
  const row = await query(
    `SELECT * FROM study_plans WHERE student_id = $1 ORDER BY generated_at DESC LIMIT 1`,
    [req.user.id]
  );
  if (!row.rows.length) return res.json({ plan: null });
  res.json({
    plan_id: row.rows[0].id,
    plan: row.rows[0].plan_json,
    exam_date: row.rows[0].exam_date,
    completed_days: row.rows[0].completed_days,
  });
});

router.post("/study-plan/complete-day", authRequired, requireRole("student"), async (req, res) => {
  const { plan_id, date } = req.body;
  const row = await query("SELECT completed_days FROM study_plans WHERE id = $1 AND student_id = $2", [
    plan_id,
    req.user.id,
  ]);
  if (!row.rows.length) return res.status(404).json({ error: "Plan not found" });
  const completed = row.rows[0].completed_days || [];
  if (!completed.includes(date)) completed.push(date);
  await query("UPDATE study_plans SET completed_days = $1 WHERE id = $2", [
    JSON.stringify(completed),
    plan_id,
  ]);
  res.json({ completed_days: completed });
});

module.exports = router;
