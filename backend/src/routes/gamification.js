const express = require("express");
const { query } = require("../db/pool");
const { authRequired } = require("../middleware/auth");
const { getLeaderboard } = require("../services/gamification");

const router = express.Router();

router.get("/leaderboard", async (req, res) => {
  const { school_id, state, limit } = req.query;
  const entries = await getLeaderboard({
    schoolId: school_id,
    state,
    limit: parseInt(limit, 10) || 10,
  });
  res.json({ leaderboard: entries });
});

router.get("/badges/me", authRequired, async (req, res) => {
  const rows = await query(
    `SELECT b.*, sb.earned_at FROM student_badges sb
     JOIN badges b ON b.id = sb.badge_id
     WHERE sb.student_id = $1`,
    [req.user.id]
  );
  res.json({ badges: rows.rows });
});

router.post("/mood", authRequired, async (req, res) => {
  const { mood, session_type } = req.body;
  await query(
    `INSERT INTO mood_checkins (student_id, mood, session_type) VALUES ($1, $2, $3)`,
    [req.user.id, mood, session_type || "practice"]
  );
  res.json({ saved: true });
});

module.exports = router;
