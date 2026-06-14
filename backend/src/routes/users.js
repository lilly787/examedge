const express = require("express");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

// Retrieve all registered users
router.get("/", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, phone, email, role, school_name, subscription_tier, created_at FROM users ORDER BY role, name"
    );
    res.json({ users: result.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update a user's role (promote/demote)
router.put("/:id/role", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: "Role required" });
    }

    const validRoles = ["student", "teacher", "parent", "school", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    }

    const existing = await query("SELECT id, role FROM users WHERE id = $1", [req.params.id]);
    if (!existing.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const oldRole = existing.rows[0].role;
    if (oldRole === role) {
      return res.json({ success: true, message: "Role is already set to this value" });
    }

    // Update in users table
    await query("UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2", [role, req.params.id]);

    // Handle student/teacher/parent records if they switch between main roles
    // We keep it simple: just update the role in the main users table,
    // and if a specific student/teacher/parent record does not exist for the new role, create it.
    if (role === "student") {
      const s = await query("SELECT 1 FROM students WHERE user_id = $1", [req.params.id]);
      if (!s.rows.length) {
        const linkCode = `PF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await query(
          "INSERT INTO students (user_id, ss_class, subjects, exam_target, parent_link_code) VALUES ($1, 'SS3', '[]', 'WAEC', $2)",
          [req.params.id, linkCode]
        );
      }
    } else if (role === "teacher") {
      const t = await query("SELECT 1 FROM teachers WHERE user_id = $1", [req.params.id]);
      if (!t.rows.length) {
        await query("INSERT INTO teachers (user_id, subjects) VALUES ($1, '[]')", [req.params.id]);
      }
    } else if (role === "parent") {
      const p = await query("SELECT 1 FROM parents WHERE user_id = $1", [req.params.id]);
      if (!p.rows.length) {
        await query("INSERT INTO parents (user_id) VALUES ($1)", [req.params.id]);
      }
    } else if (role === "school") {
      const sc = await query("SELECT 1 FROM schools WHERE admin_user_id = $1", [req.params.id]);
      if (!sc.rows.length) {
        const schoolId = uuidv4();
        const schoolCode = `SCH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        await query(
          "INSERT INTO schools (id, name, school_code, subscription_tier, admin_user_id) VALUES ($1, $2, $3, 'school', $4)",
          [schoolId, "School Admin User", schoolCode, req.params.id]
        );
        await query("UPDATE users SET school_id = $1 WHERE id = $2", [schoolId, req.params.id]);
      }
    }

    res.json({ success: true, message: `Successfully updated user role to ${role}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete a user account
router.delete("/:id", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const existing = await query("SELECT id FROM users WHERE id = $1", [req.params.id]);
    if (!existing.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete cascading references manually just in case
    await query("DELETE FROM students WHERE user_id = $1", [req.params.id]);
    await query("DELETE FROM teachers WHERE user_id = $1", [req.params.id]);
    await query("DELETE FROM parents WHERE user_id = $1", [req.params.id]);
    await query("DELETE FROM progress WHERE student_id = $1", [req.params.id]);
    await query("DELETE FROM users WHERE id = $1", [req.params.id]);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
