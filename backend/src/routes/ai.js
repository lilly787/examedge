const express = require("express");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");
const { tutorReply, generateStudyPlan } = require("../services/claude");
const { getWeaknessMap } = require("../services/analytics");

const router = express.Router();

router.post("/tutor", authRequired, async (req, res) => {
  try {
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

router.post("/study-plan", authRequired, requireRole("student"), async (req, res) => {
  try {
    const { exam_date, subjects, hours_per_day = 2 } = req.body;
    const weakness = await getWeaknessMap(req.user.id);
    const weakTopics = [];
    Object.keys(weakness).forEach((sub) => {
      Object.keys(weakness[sub]).forEach((top) => {
        if (weakness[sub][top].status === "Needs Work") {
          weakTopics.push(`${sub}: ${top}`);
        }
      });
    });

    const { plan, simulated } = await generateStudyPlan({
      examDate: exam_date,
      subjects: subjects || [],
      weaknessMap: weakTopics,
      hoursPerDay: hours_per_day,
    });

    const inserted = await query(
      `INSERT INTO study_plans (student_id, plan_json, exam_date) VALUES ($1, $2, $3) RETURNING id`,
      [req.user.id, JSON.stringify(plan), exam_date]
    );

    res.json({ plan_id: inserted.rows[0].id, plan, simulated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
