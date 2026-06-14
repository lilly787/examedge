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

router.post("/enroll/bulk", authRequired, requireRole("school", "admin"), async (req, res) => {
  const { students } = req.body;
  if (!Array.isArray(students)) return res.status(400).json({ error: "students array required" });

  const admin = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
  const schoolId = admin.rows[0]?.school_id;
  let enrolled = 0;

  for (const row of students) {
    const userId = uuidv4();
    const phone = row.phone.replace(/\D/g, "");
    const existing = await query("SELECT id FROM users WHERE phone = $1", [phone]);
    let targetUserId = userId;

    if (existing.rows.length) {
      targetUserId = existing.rows[0].id;
      await query("UPDATE users SET school_id = $1 WHERE id = $2", [schoolId, targetUserId]);
    } else {
      await query(
        `INSERT INTO users (id, name, phone, role, school_id) VALUES ($1, $2, $3, 'student', $4)`,
        [userId, row.name, phone, schoolId]
      );
      const linkCode = `PF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      await query(
        `INSERT INTO students (user_id, ss_class, subjects, exam_target, parent_link_code) VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [userId, row.class || row.ss_class || "SS3", JSON.stringify(row.subjects || []), row.exam_target || "WAEC", linkCode]
      );
    }
    enrolled++;
  }
  res.json({ enrolled });
});

router.post("/questions/upload", authRequired, requireRole("school", "admin"), async (req, res) => {
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

router.get("/dashboard", authRequired, requireRole("school", "admin"), async (req, res) => {
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

router.get("/profile", authRequired, requireRole("school", "admin"), async (req, res) => {
  try {
    const user = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
    const schoolId = user.rows[0]?.school_id;
    if (!schoolId) return res.status(404).json({ error: "School not found for this user" });

    const school = await query("SELECT * FROM schools WHERE id = $1", [schoolId]);
    res.json({ school: school.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/profile", authRequired, requireRole("school", "admin"), async (req, res) => {
  try {
    const user = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
    const schoolId = user.rows[0]?.school_id;
    if (!schoolId) return res.status(404).json({ error: "School not found for this user" });

    const { name, state, lga, type, phone, email, address } = req.body;
    await query(
      `UPDATE schools SET name = COALESCE($1, name), state = COALESCE($2, state), lga = COALESCE($3, lga),
                          type = COALESCE($4, type), phone = COALESCE($5, phone), email = COALESCE($6, email),
                          address = COALESCE($7, address) WHERE id = $8`,
      [name, state, lga, type, phone, email, address, schoolId]
    );

    if (name) {
      await query("UPDATE users SET school_name = $1 WHERE school_id = $2", [name, schoolId]);
    }

    const school = await query("SELECT * FROM schools WHERE id = $1", [schoolId]);
    res.json({ success: true, school: school.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/students", authRequired, requireRole("school", "admin"), async (req, res) => {
  try {
    const user = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
    const schoolId = user.rows[0]?.school_id;
    const result = await query(
      `SELECT u.id, u.name, u.phone, s.ss_class, s.exam_target, s.last_active_date
       FROM users u
       LEFT JOIN students s ON s.user_id = u.id
       WHERE u.school_id = $1 AND u.role = 'student'
       ORDER BY u.name`,
      [schoolId]
    );
    res.json({ students: result.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/students/:studentId", authRequired, requireRole("school", "admin"), async (req, res) => {
  try {
    const user = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
    const schoolId = user.rows[0]?.school_id;
    
    const student = await query("SELECT school_id FROM users WHERE id = $1 AND role = 'student'", [req.params.studentId]);
    if (!student.rows.length || student.rows[0].school_id !== schoolId) {
      return res.status(403).json({ error: "Forbidden: Student does not belong to your school" });
    }

    await query("DELETE FROM students WHERE user_id = $1", [req.params.studentId]);
    await query("DELETE FROM users WHERE id = $1", [req.params.studentId]);
    res.json({ success: true, message: "Student removed" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/questions", authRequired, requireRole("school", "admin"), async (req, res) => {
  try {
    const user = await query("SELECT school_id FROM users WHERE id = $1", [req.user.id]);
    const schoolId = user.rows[0]?.school_id;
    const result = await query("SELECT * FROM school_custom_questions WHERE school_id = $1 ORDER BY uploaded_at DESC", [schoolId]);
    res.json({ questions: result.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
