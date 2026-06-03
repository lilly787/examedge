const express = require("express");
const { query } = require("../db/pool");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, role, source } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }
    await query(
      `INSERT INTO waitlist (name, email, phone, role, source) VALUES ($1, $2, $3, $4, $5)`,
      [name || null, email || null, phone || null, role || "student", source || "landing"]
    );
    const count = await query("SELECT COUNT(*)::int AS c FROM waitlist");
    res.json({ success: true, total: count.rows[0].c });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/count", async (_req, res) => {
  const count = await query("SELECT COUNT(*)::int AS c FROM waitlist");
  res.json({ count: count.rows[0].c });
});

module.exports = router;
