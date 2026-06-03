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
        const linkCode = `EE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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
        await query("INSERT INTO teachers (user_id, subjects) VALUES ($1, $2)", [
          id,
          JSON.stringify(profile?.subjects || []),
        ]);
      } else if (role === "parent") {
        await query("INSERT INTO parents (user_id) VALUES ($1)", [id]);
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

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        school_name: user.school_name,
        subscription_tier: user.subscription_tier,
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

    if (!userResult.rows.length) {
      const id = uuidv4();
      const userRole = role || "student";
      await query(
        `INSERT INTO users (id, name, phone, role, school_name, subscription_tier) VALUES ($1, $2, $3, $4, $5, 'free')`,
        [id, name || "Student", normalized, userRole, school_name || null]
      );
      if (userRole === "student") {
        const linkCode = `EE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await query(
          `INSERT INTO students (user_id, ss_class, subjects, exam_target, parent_link_code)
           VALUES ($1, 'SS3', $2, 'WAEC', $3)`,
          [
            id,
            JSON.stringify([
              "Mathematics",
              "English Language",
              "Biology",
              "Chemistry",
              "Physics",
            ]),
            linkCode,
          ]
        );
      } else if (userRole === "teacher") {
        await query("INSERT INTO teachers (user_id, subjects) VALUES ($1, '[]')", [id]);
      } else if (userRole === "parent") {
        await query("INSERT INTO parents (user_id) VALUES ($1)", [id]);
      }
      userResult = await query("SELECT * FROM users WHERE id = $1", [id]);
    } else {
      if (name || school_name) {
        await query(
          "UPDATE users SET name = COALESCE($1, name), school_name = COALESCE($2, school_name), updated_at = NOW() WHERE id = $3",
          [name || null, school_name || null, userResult.rows[0].id]
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

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        school_name: user.school_name,
        subscription_tier: user.subscription_tier,
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
