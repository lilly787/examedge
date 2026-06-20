const express = require("express");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");
const { recalculateWeaknessMap, getWeaknessMap, getExamReadinessScore } = require("../services/analytics");
const { awardXp } = require("../services/gamification");
const config = require("../config");

const router = express.Router();

async function checkDailyLimit(studentId, tier) {
  if (tier === "premium") return { allowed: true, remaining: 999 };
  const today = new Date().toISOString().split("T")[0];
  const row = await query(
    "SELECT question_count FROM daily_limits WHERE student_id = $1 AND date = $2",
    [studentId, today]
  );
  const count = row.rows[0]?.question_count || 0;
  const max = config.freeTier.dailyQuestionLimit;
  return { allowed: count < max, remaining: Math.max(0, max - count), count };
}

router.post("/", authRequired, requireRole("student"), async (req, res) => {
  try {
    const { question_id, is_correct, time_taken_seconds } = req.body;
    const user = await query("SELECT subscription_tier FROM users WHERE id = $1", [req.user.id]);
    const limit = await checkDailyLimit(req.user.id, user.rows[0].subscription_tier);
    if (!limit.allowed) {
      return res.status(429).json({
        error: "Daily free limit reached",
        remaining: 0,
        upgrade: true,
      });
    }

    const attempts = await query(
      "SELECT COUNT(*)::int AS c FROM student_progress WHERE student_id = $1 AND question_id = $2",
      [req.user.id, question_id]
    );
    const attemptNumber = attempts.rows[0].c + 1;

    await query(
      `INSERT INTO student_progress (student_id, question_id, is_correct, time_taken_seconds, attempt_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, question_id, is_correct, time_taken_seconds || 0, attemptNumber]
    );

    const today = new Date().toISOString().split("T")[0];
    await query(
      `INSERT INTO daily_limits (student_id, date, question_count)
       VALUES ($1, $2, 1)
       ON CONFLICT (student_id, date) DO UPDATE SET question_count = daily_limits.question_count + 1`,
      [req.user.id, today]
    );

    const xpGain = 10 + (is_correct ? 15 : 0);
    const xp = await awardXp(req.user.id, xpGain);

    await updateStreak(req.user.id);
    const weakness = await recalculateWeaknessMap(req.user.id);
    const readiness = await getExamReadinessScore(req.user.id);

    res.json({
      xp,
      readiness_score: readiness,
      weakness,
      daily_remaining: limit.remaining - 1,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function updateStreak(studentId) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const s = await query(
    "SELECT study_streak, last_active_date FROM students WHERE user_id = $1",
    [studentId]
  );
  let streak = s.rows[0]?.study_streak || 0;
  const last = s.rows[0]?.last_active_date;
  if (last === today) return;
  streak = last === yesterday ? streak + 1 : 1;
  await query(
    "UPDATE students SET study_streak = $1, last_active_date = $2 WHERE user_id = $3",
    [streak, today, studentId]
  );
}

router.get("/me", authRequired, requireRole("student"), async (req, res) => {
  try {
    const progress = await query(
      `SELECT * FROM student_progress WHERE student_id = $1 ORDER BY attempted_at DESC LIMIT 500`,
      [req.user.id]
    );
    res.json({ progress: progress.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/analytics/weakness", authRequired, async (req, res) => {
  try {
    const studentId = req.query.student_id || req.user.id;
    const map = await getWeaknessMap(studentId);
    res.json({ weakness: map });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/analytics/readiness", authRequired, async (req, res) => {
  try {
    const studentId = req.query.student_id || req.user.id;
    const score = await getExamReadinessScore(studentId);
    res.json({ readiness_score: score });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/sync", authRequired, requireRole("student"), async (req, res) => {
  try {
    const { attempts } = req.body;
    if (!Array.isArray(attempts)) return res.status(400).json({ error: "attempts array required" });

    // Verify user exists in the database
    const userCheck = await query("SELECT id FROM users WHERE id = $1", [req.user.id]);
    if (!userCheck.rows.length) {
      return res.status(401).json({ error: "User session is invalid. Please log in again." });
    }

    let synced = 0;
    let skipped = 0;
    for (const a of attempts) {
      try {
        const result = await query(
          `INSERT INTO student_progress (student_id, question_id, is_correct, time_taken_seconds, attempted_at)
           VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, NOW()))
           ON CONFLICT DO NOTHING`,
          [req.user.id, a.question_id, a.is_correct, a.time_taken_seconds || 0, a.attempted_at || null]
        );
        // pg rowCount = 0 means conflict was skipped
        if (result.rowCount > 0) synced++;
        else skipped++;
      } catch (rowErr) {
        // Log but continue with remaining attempts
        console.warn("[progress/sync] skipping row:", rowErr.message);
        skipped++;
      }
    }

    await recalculateWeaknessMap(req.user.id);
    const readiness = await getExamReadinessScore(req.user.id);
    res.json({ synced, skipped, readiness_score: readiness });
  } catch (e) {
    console.error("[progress/sync] sync failed:", e.message);
    res.status(500).json({ error: e.message || "Failed to sync progress" });
  }
});

module.exports = router;
