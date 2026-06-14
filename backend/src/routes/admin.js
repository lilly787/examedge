const express = require("express");
const jwt = require("jsonwebtoken");
const { query } = require("../db/pool");
const config = require("../config");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Impersonate a user
router.get("/impersonate/:userId", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    if (!uuidRegex.test(targetUserId)) {
      return res.status(400).json({ error: "Invalid target user ID format" });
    }
    const result = await query("SELECT id, name, phone, role FROM users WHERE id = $1", [targetUserId]);
    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const targetUser = result.rows[0];

    // Sign a token for 15 minutes with isAdminView: true
    const token = jwt.sign(
      { id: targetUser.id, role: targetUser.role, phone: targetUser.phone, isAdminView: true },
      config.jwtSecret,
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      token,
      user: targetUser
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
