const express = require("express");
const { query } = require("../db/pool");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/bundle/:subject", authRequired, requireRole("student"), async (req, res) => {
  const subject = decodeURIComponent(req.params.subject);
  const user = await query("SELECT subscription_tier FROM users WHERE id = $1", [req.user.id]);
  if (user.rows[0].subscription_tier === "free") {
    return res.status(403).json({
      error: "Offline downloads require Premium",
      upgrade: true,
    });
  }

  const result = await query(
    `SELECT id, subject, topic, subtopic, year, exam_body, type, question_text, options,
            correct_answer, explanation_text, difficulty, tags
     FROM questions WHERE subject ILIKE $1`,
    [subject]
  );

  const questions = result.rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    topic: row.topic,
    subtopic: row.subtopic,
    year: row.year,
    exam_body: row.exam_body,
    type: row.type,
    question: row.question_text,
    options: typeof row.options === "string" ? JSON.parse(row.options) : row.options,
    answer: row.correct_answer,
    explanation: row.explanation_text,
    difficulty: row.difficulty,
    tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
  }));

  await query(
    `INSERT INTO offline_downloads (student_id, subject) VALUES ($1, $2)
     ON CONFLICT (student_id, subject) DO UPDATE SET downloaded_at = NOW()`,
    [req.user.id, subject]
  );

  res.json({
    subject,
    count: questions.length,
    downloaded_at: new Date().toISOString(),
    questions,
  });
});

router.get("/downloads", authRequired, requireRole("student"), async (req, res) => {
  const rows = await query(
    "SELECT subject, downloaded_at FROM offline_downloads WHERE student_id = $1",
    [req.user.id]
  );
  res.json({ downloads: rows.rows });
});

module.exports = router;
