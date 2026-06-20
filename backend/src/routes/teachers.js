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
  // generate short class code e.g. BIO-SS2-X7K2
  const subjectPrefix = (subject || "GEN").substring(0, 3).toUpperCase();
  const levelPrefix = (ss_level || "ALL").toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const classCode = `${subjectPrefix}-${levelPrefix}-${randomStr}`;

  await query(
    `INSERT INTO classes (id, school_id, teacher_id, class_code, name, ss_level, subject, student_ids)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      school_id || null,
      req.user.id,
      classCode,
      name,
      ss_level,
      subject,
      JSON.stringify(student_ids || []),
    ]
  );
  res.json({ id, class_code: classCode });
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

router.get("/classes/:classId/analytics", async (req, res) => {
  try {
    const cls = await query(
      "SELECT student_ids FROM classes WHERE id = $1 AND teacher_id = $2",
      [req.params.classId, req.user.id]
    );
    if (!cls.rows.length) return res.status(404).json({ error: "Class not found" });
    const studentIds = cls.rows[0].student_ids || [];

    if (!studentIds.length) {
      return res.json({
        overview: { average_readiness: 0, questions_answered: 0, active_students: 0, assignments_completed: 0 },
        struggles: []
      });
    }

    const readinessRes = await query(
      `SELECT AVG(readiness_score)::int AS avg_readiness FROM students WHERE user_id = ANY($1::uuid[])`,
      [studentIds]
    );
    const progressRes = await query(
      `SELECT COUNT(*)::int AS total_answered FROM student_progress WHERE student_id = ANY($1::uuid[])`,
      [studentIds]
    );
    const activeRes = await query(
      `SELECT COUNT(*)::int AS active_count FROM students WHERE user_id = ANY($1::uuid[]) AND last_active_date >= NOW() - INTERVAL '7 days'`,
      [studentIds]
    );
    const completedRes = await query(
      `SELECT COUNT(*)::int AS completed_count FROM assignment_submissions 
       WHERE student_id = ANY($1::uuid[]) AND completed = TRUE AND assignment_id IN (
         SELECT id FROM assignments WHERE class_id = $2
       )`,
      [studentIds, req.params.classId]
    );

    const wmRes = await query(
      `SELECT topic, AVG(accuracy_rate)::int AS avg_accuracy, SUM(CASE WHEN accuracy_rate < 50 THEN 1 ELSE 0 END)::int AS struggling_count
       FROM weakness_map 
       WHERE student_id = ANY($1::uuid[])
       GROUP BY topic`,
      [studentIds]
    );

    res.json({
      overview: {
        average_readiness: readinessRes.rows[0].avg_readiness || 0,
        questions_answered: progressRes.rows[0].total_answered || 0,
        active_students: activeRes.rows[0].active_count || 0,
        assignments_completed: completedRes.rows[0].completed_count || 0,
      },
      struggles: wmRes.rows.map(row => ({
        topic: row.topic,
        avg_accuracy: row.avg_accuracy || 0,
        struggling_students: row.struggling_count || 0
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/at-risk-students", async (req, res) => {
  try {
    const classesRes = await query("SELECT student_ids FROM classes WHERE teacher_id = $1", [req.user.id]);
    const studentIds = [];
    for (const row of classesRes.rows) {
      if (row.student_ids) {
        studentIds.push(...row.student_ids);
      }
    }

    if (!studentIds.length) {
      return res.json({ students: [] });
    }

    const uniqueIds = [...new Set(studentIds)];
    const students = await query(
      `SELECT u.id, u.name, u.phone, s.ss_class, s.readiness_score, s.study_streak, s.last_active_date
       FROM users u JOIN students s ON s.user_id = u.id 
       WHERE u.id = ANY($1::uuid[])`,
      [uniqueIds]
    );

    const enriched = [];
    for (const st of students.rows) {
      const readiness = st.readiness_score || 0;
      const daysInactive = st.last_active_date
        ? Math.floor((Date.now() - new Date(st.last_active_date)) / 86400000)
        : 99;
      if (readiness < 40 || daysInactive >= 5) {
        // Find top weak subject from weakness_map
        const wmRes = await query(
          "SELECT subject FROM weakness_map WHERE student_id = $1 ORDER BY accuracy_rate ASC LIMIT 1",
          [st.id]
        );
        const weakSubject = wmRes.rows.length ? wmRes.rows[0].subject : "General";

        enriched.push({
          ...st,
          readiness_score: readiness,
          days_inactive: daysInactive,
          top_weak_subject: weakSubject
        });
      }
    }
    res.json({ students: enriched });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/students/:studentId/nudge", async (req, res) => {
  try {
    const student = await query("SELECT u.name, u.phone FROM users u WHERE u.id = $1", [req.params.studentId]);
    if (!student.rows.length) return res.status(404).json({ error: "Student not found" });

    console.log(`[DEV MODE] WhatsApp Nudge sent to ${student.rows[0].name} (${student.rows[0].phone}): Hey ${student.rows[0].name.split(' ')[0]}, you have an outstanding assignment or need to practice on ExamEdge!`);

    res.json({ success: true, message: `WhatsApp Nudge sent to ${student.rows[0].name}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
