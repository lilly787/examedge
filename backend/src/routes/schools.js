const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/register", authRequired, requireRole("admin"), async (req, res) => {
  const { name, state, lga, type, logo_url } = req.body;
  const code = `SCH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const id = uuidv4();
  await query(
    `INSERT INTO schools (id, name, state, lga, type, logo_url, school_code, admin_user_id, subscription_tier)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'school')`,
    [id, name, state, lga, type, logo_url, code, req.user.id]
  );
  await query("UPDATE users SET school_id = $1, role = 'admin' WHERE id = $2", [id, req.user.id]);
  res.json({ school_id: id, school_code: code });
});

router.post("/enroll/bulk", authRequired, requireRole("admin"), async (req, res) => {
  const { students } = req.body;
  if (!Array.isArray(students)) return res.status(400).json({ error: "students array required" });

  const admin = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
  const schoolId = admin.rows[0]?.school_id;
  let enrolled = 0;

  for (const row of students) {
    const userId = uuidv4();
    const phone = row.phone.replace(/\D/g, "");
    await query(
      `INSERT INTO users (id, name, phone, role, school_id) VALUES ($1, $2, $3, 'student', $4)
       ON CONFLICT (phone) DO NOTHING`,
      [userId, row.name, phone, schoolId]
    );
    await query(
      `INSERT INTO students (user_id, ss_class, subjects, exam_target) VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [userId, row.class || "SS3", JSON.stringify(row.subjects || []), row.exam_target || "WAEC"]
    );
    enrolled++;
  }
  res.json({ enrolled });
});

router.post("/questions/upload", authRequired, requireRole("admin"), async (req, res) => {
  const { questions } = req.body;
  const admin = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
  const schoolId = admin.rows[0]?.school_id;
  for (const q of questions) {
    const id = `school-${schoolId}-${uuidv4().slice(0, 8)}`;
    await query(
      `INSERT INTO school_custom_questions (id, school_id, question_data) VALUES ($1, $2, $3)`,
      [id, schoolId, JSON.stringify(q)]
    );
  }
  res.json({ uploaded: questions.length });
});

router.get("/dashboard", authRequired, requireRole("admin"), async (req, res) => {
  const admin = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
  const schoolId = admin.rows[0]?.school_id;
  const students = await query(
    "SELECT COUNT(*)::int AS c FROM users WHERE school_id = $1 AND role = 'student'",
    [schoolId]
  );
  const activity = await query(
    `SELECT COUNT(DISTINCT sp.student_id)::int AS active
     FROM student_progress sp
     JOIN users u ON u.id = sp.student_id
     WHERE u.school_id = $1 AND sp.attempted_at >= NOW() - INTERVAL '7 days'`,
    [schoolId]
  );
  res.json({
    school_id: schoolId,
    total_students: students.rows[0].c,
    active_last_7_days: activity.rows[0].active,
  });
});

module.exports = router;
