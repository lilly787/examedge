const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../db/pool");
const config = require("../config");
const { sendOtp, verifyOtp, normalizePhone } = require("../services/otp");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, phone: user.phone },
    config.jwtSecret,
    { expiresIn: "30d" }
  );
}

router.post("/otp/send", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });
    const result = await sendOtp(phone);
    res.json({ success: true, phone: result.phone, devCode: result.devCode });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/otp/verify", async (req, res) => {
  try {
    const { phone, code, profile } = req.body;
    if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

    const valid = await verifyOtp(phone, code);
    if (!valid) return res.status(401).json({ error: "Invalid or expired code" });

    const normalized = normalizePhone(phone);
    let userResult = await query("SELECT * FROM users WHERE phone = $1", [normalized]);

    if (!userResult.rows.length) {
      const id = uuidv4();
      const role = profile?.role || "student";
      await query(
        `INSERT INTO users (id, name, phone, email, role, school_name, subscription_tier)
         VALUES ($1, $2, $3, $4, $5, $6, 'free')`,
        [
          id,
          profile?.name || "Student",
          normalized,
          profile?.email || null,
          role,
          profile?.school_name || null,
        ]
      );

      if (role === "student") {
        const linkCode = `PF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await query(
          `INSERT INTO students (user_id, ss_class, subjects, exam_target, exam_date, parent_link_code)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            id,
            profile?.ss_class || "SS3",
            JSON.stringify(profile?.subjects || []),
            profile?.exam_target || "WAEC",
            profile?.exam_date || null,
            linkCode,
          ]
        );
      } else if (role === "teacher") {
        await query(
          "INSERT INTO teachers (user_id, subjects, subject_taught, purpose) VALUES ($1, $2, $3, $4)",
          [
            id,
            JSON.stringify(profile?.subjects || []),
            profile?.subject_taught || null,
            profile?.purpose || null,
          ]
        );
      } else if (role === "parent") {
        await query("INSERT INTO parents (user_id) VALUES ($1)", [id]);
        const childCode = profile?.child_student_id;
        const childName = profile?.child_name || null;
        if (childCode) {
          const studentRes = await query("SELECT user_id FROM students WHERE parent_link_code = $1", [childCode.toUpperCase()]);
          if (studentRes.rows.length) {
            const studentId = studentRes.rows[0].user_id;
            await query(
              `INSERT INTO parent_links (parent_id, student_id, status, requested_code, child_name)
               VALUES ($1, $2, 'linked', $3, $4) ON CONFLICT (parent_id, student_id) DO NOTHING`,
              [id, studentId, childCode, childName]
            );
            await query(
              `INSERT INTO parent_student_links (parent_user_id, student_user_id)
               VALUES ($1, $2) ON CONFLICT DO NOTHING`,
              [id, studentId]
            );
          } else {
            await query(
              `INSERT INTO parent_links (parent_id, student_id, status, requested_code, child_name)
               VALUES ($1, NULL, 'pending', $2, $3)`,
              [id, childCode, childName]
            );
          }
        }
      } else if (role === "school") {
        const schoolId = uuidv4();
        const schoolCode = profile?.school_code || `SCH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await query(
          `INSERT INTO schools (id, name, school_code, email, phone, address, admin_user_id, subscription_tier)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'school')`,
          [
            schoolId,
            profile?.school_name || "School",
            schoolCode,
            profile?.email || null,
            normalized,
            profile?.address || null,
            id,
          ]
        );
        await query("UPDATE users SET school_id = $1 WHERE id = $2", [schoolId, id]);
      }

      userResult = await query("SELECT * FROM users WHERE id = $1", [id]);
    }

    let user = userResult.rows[0];
    if (user && (profile?.name || profile?.school_name)) {
      await query(
        "UPDATE users SET name = COALESCE($1, name), school_name = COALESCE($2, school_name), updated_at = NOW() WHERE id = $3",
        [profile?.name || null, profile?.school_name || null, user.id]
      );
      if (profile?.name) user = { ...user, name: profile.name };
      if (profile?.school_name) user = { ...user, school_name: profile.school_name };
    }

    const token = signToken(user);

    let student = null;
    if (user.role === "student") {
      const s = await query("SELECT * FROM students WHERE user_id = $1", [user.id]);
      student = s.rows[0];
    }

    let pendingLink = false;
    if (user.role === "parent") {
      const pLinks = await query("SELECT COUNT(*)::int AS c FROM parent_links WHERE parent_id = $1 AND status = 'pending'", [user.id]);
      if (pLinks.rows[0].c > 0) {
        pendingLink = true;
      }
    }

    res.json({
      token,
      pendingLink,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        school_name: user.school_name,
        subscription_tier: user.subscription_tier,
        school_id: user.school_id,
        pendingLink,
        ...(student && {
          ss_class: student.ss_class,
          subjects: student.subjects,
          exam_target: student.exam_target,
          exam_date: student.exam_date,
          study_streak: student.study_streak,
          parent_link_code: student.parent_link_code,
          readiness_score: student.readiness_score,
        }),
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Resume API session for users logged in locally (no JWT yet)
router.post("/session/resume", async (req, res) => {
  try {
    const { phone, name, school_name, role } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });

    const normalized = normalizePhone(phone);
    let userResult = await query("SELECT * FROM users WHERE phone = $1", [normalized]);

    const profile = req.body.profile || req.body;
    const userRole = profile.role || role || "student";

    if (!userResult.rows.length) {
      const id = uuidv4();
      await query(
        `INSERT INTO users (id, name, phone, role, school_name, subscription_tier) VALUES ($1, $2, $3, $4, $5, 'free')`,
        [id, name || profile.name || "Student", normalized, userRole, school_name || profile.school_name || null]
      );
      if (userRole === "student") {
        const linkCode = `PF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await query(
          `INSERT INTO students (user_id, ss_class, subjects, exam_target, parent_link_code)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            id,
            profile.ss_class || 'SS3',
            JSON.stringify(profile.subjects || [
              "Mathematics",
              "English Language",
              "Biology",
              "Chemistry",
              "Physics",
            ]),
            profile.exam_target || 'WAEC',
            linkCode,
          ]
        );
      } else if (userRole === "teacher") {
        await query(
          "INSERT INTO teachers (user_id, subjects, subject_taught, purpose) VALUES ($1, $2, $3, $4)",
          [
            id,
            JSON.stringify(profile.subjects || []),
            profile.subject_taught || null,
            profile.purpose || null,
          ]
        );
      } else if (userRole === "parent") {
        await query("INSERT INTO parents (user_id) VALUES ($1)", [id]);
        const childCode = profile.child_student_id;
        const childName = profile.child_name || null;
        if (childCode) {
          const studentRes = await query("SELECT user_id FROM students WHERE parent_link_code = $1", [childCode.toUpperCase()]);
          if (studentRes.rows.length) {
            const studentId = studentRes.rows[0].user_id;
            await query(
              `INSERT INTO parent_links (parent_id, student_id, status, requested_code, child_name)
               VALUES ($1, $2, 'linked', $3, $4) ON CONFLICT (parent_id, student_id) DO NOTHING`,
              [id, studentId, childCode, childName]
            );
            await query(
              `INSERT INTO parent_student_links (parent_user_id, student_user_id)
               VALUES ($1, $2) ON CONFLICT DO NOTHING`,
              [id, studentId]
            );
          } else {
            await query(
              `INSERT INTO parent_links (parent_id, student_id, status, requested_code, child_name)
               VALUES ($1, NULL, 'pending', $2, $3)`,
              [id, childCode, childName]
            );
          }
        }
      } else if (userRole === "school") {
        const schoolId = uuidv4();
        const schoolCode = profile.school_code || `SCH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await query(
          `INSERT INTO schools (id, name, school_code, email, phone, address, admin_user_id, subscription_tier)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'school')`,
          [
            schoolId,
            profile.school_name || "School",
            schoolCode,
            profile.email || null,
            normalized,
            profile.address || null,
            id,
          ]
        );
        await query("UPDATE users SET school_id = $1 WHERE id = $2", [schoolId, id]);
      }
      userResult = await query("SELECT * FROM users WHERE id = $1", [id]);
    } else {
      if (name || school_name || profile.name || profile.school_name) {
        await query(
          "UPDATE users SET name = COALESCE($1, name), school_name = COALESCE($2, school_name), updated_at = NOW() WHERE id = $3",
          [name || profile.name || null, school_name || profile.school_name || null, userResult.rows[0].id]
        );
      }
      userResult = await query("SELECT * FROM users WHERE id = $1", [userResult.rows[0].id]);
    }

    const user = userResult.rows[0];
    const token = signToken(user);

    let student = null;
    if (user.role === "student") {
      const s = await query("SELECT * FROM students WHERE user_id = $1", [user.id]);
      student = s.rows[0];
    }

    let pendingLink = false;
    if (user.role === "parent") {
      const pLinks = await query("SELECT COUNT(*)::int AS c FROM parent_links WHERE parent_id = $1 AND status = 'pending'", [user.id]);
      if (pLinks.rows[0].c > 0) {
        pendingLink = true;
      }
    }

    res.json({
      token,
      pendingLink,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        school_name: user.school_name,
        subscription_tier: user.subscription_tier,
        school_id: user.school_id,
        pendingLink,
        ...(student && {
          ss_class: student.ss_class,
          subjects: student.subjects,
          exam_target: student.exam_target,
          exam_date: student.exam_date,
          study_streak: student.study_streak,
          parent_link_code: student.parent_link_code,
          readiness_score: student.readiness_score,
        }),
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    if (password !== config.adminPassword) {
      return res.status(401).json({ error: "Invalid admin passcode" });
    }

    // Return a virtual/mock admin or find one if we already have one
    const adminUser = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Administrator",
      phone: "+2348000000000",
      role: "admin",
      subscription_tier: "premium"
    };

    const token = signToken(adminUser);
    res.json({ token, user: adminUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/me", authRequired, async (req, res) => {
  const user = await query(
    "SELECT id, name, phone, email, role, school_name, subscription_tier, school_id FROM users WHERE id = $1",
    [req.user.id]
  );
  if (!user.rows.length) return res.status(404).json({ error: "User not found" });

  const payload = { user: user.rows[0] };
  if (user.rows[0].role === "student") {
    const s = await query("SELECT * FROM students WHERE user_id = $1", [req.user.id]);
    payload.student = s.rows[0];
  }
  res.json(payload);
});

module.exports = router;
