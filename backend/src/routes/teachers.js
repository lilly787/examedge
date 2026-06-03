const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");
const { getWeaknessMap, getExamReadinessScore } = require("../services/analytics");

const router = express.Router();
router.use(authRequired, requireRole("teacher", "admin"));

router.get("/classes", async (req, res) => {
  const rows = await query(
    "SELECT * FROM classes WHERE teacher_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json({ classes: rows.rows });
});

router.post("/classes", async (req, res) => {
  const { name, ss_level, subject, school_id, student_ids } = req.body;
  const id = uuidv4();
  await query(
    `INSERT INTO classes (id, school_id, teacher_id, name, ss_level, subject, student_ids)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id,
      school_id || null,
      req.user.id,
      name,
      ss_level,
      subject,
      JSON.stringify(student_ids || []),
    ]
  );
  res.json({ id });
});

router.get("/classes/:classId/students", async (req, res) => {
  const cls = await query(
    "SELECT student_ids FROM classes WHERE id = $1 AND teacher_id = $2",
    [req.params.classId, req.user.id]
  );
  if (!cls.rows.length) return res.status(404).json({ error: "Class not found" });
  const ids = cls.rows[0].student_ids || [];
  if (!ids.length) return res.json({ students: [] });

  const students = await query(
    `SELECT u.id, u.name, u.phone, s.ss_class, s.readiness_score, s.study_streak, s.last_active_date
     FROM users u JOIN students s ON s.user_id = u.id WHERE u.id = ANY($1::uuid[])`,
    [ids]
  );

  const enriched = [];
  for (const st of students.rows) {
    const readiness = st.readiness_score || (await getExamReadinessScore(st.id));
    const daysInactive = st.last_active_date
      ? Math.floor((Date.now() - new Date(st.last_active_date)) / 86400000)
      : 99;
    enriched.push({
      ...st,
      readiness_score: readiness,
      at_risk: readiness < 40 && daysInactive >= 5,
    });
  }
  res.json({ students: enriched });
});

router.post("/assignments", async (req, res) => {
  const { class_id, title, question_ids, due_date } = req.body;
  const id = uuidv4();
  await query(
    `INSERT INTO assignments (id, teacher_id, class_id, title, question_ids, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, req.user.id, class_id, title, JSON.stringify(question_ids), due_date]
  );
  res.json({ id });
});

router.get("/assignments/:id/results", async (req, res) => {
  const a = await query(
    "SELECT * FROM assignments WHERE id = $1 AND teacher_id = $2",
    [req.params.id, req.user.id]
  );
  if (!a.rows.length) return res.status(404).json({ error: "Not found" });
  const subs = await query(
    "SELECT * FROM assignment_submissions WHERE assignment_id = $1",
    [req.params.id]
  );
  res.json({ assignment: a.rows[0], submissions: subs.rows });
});

router.get("/analytics/class/:classId", async (req, res) => {
  const cls = await query(
    "SELECT student_ids, subject FROM classes WHERE id = $1 AND teacher_id = $2",
    [req.params.classId, req.user.id]
  );
  if (!cls.rows.length) return res.status(404).json({ error: "Class not found" });
  const topicStats = {};
  for (const sid of cls.rows[0].student_ids || []) {
    const wm = await getWeaknessMap(sid);
    Object.keys(wm).forEach((sub) => {
      Object.keys(wm[sub]).forEach((top) => {
        const key = `${sub} — ${top}`;
        if (!topicStats[key]) topicStats[key] = { attempts: 0, totalAccuracy: 0, count: 0 };
        topicStats[key].attempts += wm[sub][top].attempts;
        topicStats[key].totalAccuracy += wm[sub][top].accuracy;
        topicStats[key].count += 1;
      });
    });
  }
  const struggles = Object.entries(topicStats)
    .map(([topic, d]) => ({
      topic,
      avg_accuracy: d.count ? Math.round(d.totalAccuracy / d.count) : 0,
    }))
    .filter((t) => t.avg_accuracy < 60)
    .sort((a, b) => a.avg_accuracy - b.avg_accuracy)
    .slice(0, 5);

  res.json({ struggles });
});

module.exports = router;
