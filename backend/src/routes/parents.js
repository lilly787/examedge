const express = require("express");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");
const { getExamReadinessScore, getWeaknessMap } = require("../services/analytics");

const router = express.Router();
router.use(authRequired, requireRole("parent"));

router.post("/link", async (req, res) => {
  const { code } = req.body;
  const student = await query(
    "SELECT user_id FROM students WHERE parent_link_code = $1",
    [code?.toUpperCase()]
  );
  if (!student.rows.length) return res.status(404).json({ error: "Invalid link code" });

  await query(
    `INSERT INTO parent_student_links (parent_user_id, student_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [req.user.id, student.rows[0].user_id]
  );
  res.json({ success: true, student_id: student.rows[0].user_id });
});

router.post("/link-child", async (req, res) => {
  try {
    const { child_phone } = req.body;
    if (!child_phone) return res.status(400).json({ error: "Phone number or link code required" });

    // 1. Try to search by phone in users
    let student = await query(
      "SELECT s.user_id FROM students s JOIN users u ON u.id = s.user_id WHERE u.phone = $1 OR s.parent_link_code = $2",
      [child_phone, child_phone.toUpperCase()]
    );

    if (!student.rows.length) {
      return res.status(404).json({ error: "Child account not found. Verify phone or code." });
    }

    await query(
      `INSERT INTO parent_student_links (parent_user_id, student_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user.id, student.rows[0].user_id]
    );
    res.json({ success: true, message: "Link request sent! Ask your child to confirm." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/children", async (req, res) => {
  const rows = await query(
    `SELECT u.id, u.name, s.ss_class, s.exam_target, s.exam_date, s.readiness_score, s.study_streak, s.last_active_date
     FROM parent_student_links psl
     JOIN users u ON u.id = psl.student_user_id
     JOIN students s ON s.user_id = u.id
     WHERE psl.parent_user_id = $1`,
    [req.user.id]
  );
  res.json({ children: rows.rows });
});

router.get("/reports/:studentId", async (req, res) => {
  const link = await query(
    "SELECT 1 FROM parent_student_links WHERE parent_user_id = $1 AND student_user_id = $2",
    [req.user.id, req.params.studentId]
  );
  if (!link.rows.length) return res.status(403).json({ error: "Not linked to this child" });

  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const activity = await query(
    `SELECT COUNT(*)::int AS questions,
            SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::int AS correct
     FROM student_progress WHERE student_id = $1 AND attempted_at >= $2`,
    [req.params.studentId, weekAgo]
  );

  const readiness = await getExamReadinessScore(req.params.studentId);
  const weakness = await getWeaknessMap(req.params.studentId);
  const student = await query(
    "SELECT last_active_date, study_streak FROM students WHERE user_id = $1",
    [req.params.studentId]
  );

  const lastActive = student.rows[0]?.last_active_date;
  const daysSince = lastActive
    ? Math.floor((Date.now() - new Date(lastActive)) / 86400000)
    : null;

  res.json({
    week: {
      questions_answered: activity.rows[0].questions,
      correct: activity.rows[0].correct,
      accuracy: activity.rows[0].questions
        ? Math.round((activity.rows[0].correct / activity.rows[0].questions) * 100)
        : 0,
    },
    readiness_score: readiness,
    study_streak: student.rows[0]?.study_streak,
    inactive_alert: daysSince !== null && daysSince >= 3,
    days_since_study: daysSince,
    weakness_summary: weakness,
  });
});

router.get("/children/:studentId/report", async (req, res) => {
  // Redirect to existing report handler
  req.url = `/reports/${req.params.studentId}`;
  return router.handle(req, res);
});

module.exports = router;
