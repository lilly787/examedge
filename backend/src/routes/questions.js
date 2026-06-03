const express = require("express");
const { query } = require("../db/pool");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

function mapQuestion(row) {
  return {
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
    video_url: row.explanation_video_url,
    difficulty: row.difficulty,
    tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
  };
}

router.get("/", async (req, res) => {
  try {
    const {
      subject,
      year,
      exam_body,
      topic,
      difficulty,
      limit = 50,
      offset = 0,
      ids,
    } = req.query;

    const conditions = [];
    const params = [];
    let n = 1;

    if (subject) {
      conditions.push(`subject = $${n++}`);
      params.push(subject);
    }
    if (year) {
      conditions.push(`year = $${n++}`);
      params.push(parseInt(year, 10));
    }
    if (exam_body) {
      conditions.push(`exam_body = $${n++}`);
      params.push(exam_body);
    }
    if (topic) {
      conditions.push(`topic ILIKE $${n++}`);
      params.push(`%${topic}%`);
    }
    if (difficulty) {
      conditions.push(`difficulty = $${n++}`);
      params.push(difficulty);
    }
    if (ids) {
      const idList = ids.split(",");
      conditions.push(`id = ANY($${n++})`);
      params.push(idList);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    params.push(Math.min(parseInt(limit, 10) || 50, 200));
    params.push(parseInt(offset, 10) || 0);

    const countRes = await query(
      `SELECT COUNT(*)::int AS total FROM questions ${where}`,
      params.slice(0, -2)
    );

    const result = await query(
      `SELECT * FROM questions ${where} ORDER BY year DESC, subject LIMIT $${n++} OFFSET $${n}`,
      params
    );

    res.json({
      total: countRes.rows[0].total,
      questions: result.rows.map(mapQuestion),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/stats", async (_req, res) => {
  const total = await query("SELECT COUNT(*)::int AS c FROM questions");
  const bySubject = await query(
    `SELECT subject, COUNT(*)::int AS count FROM questions GROUP BY subject ORDER BY count DESC`
  );
  res.json({ total: total.rows[0].c, bySubject: bySubject.rows });
});

router.get("/:id", async (req, res) => {
  const result = await query("SELECT * FROM questions WHERE id = $1", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found" });
  res.json(mapQuestion(result.rows[0]));
});

router.post("/bulk", authRequired, async (req, res) => {
  const { questions } = req.body;
  if (!Array.isArray(questions)) return res.status(400).json({ error: "questions array required" });
  let count = 0;
  for (const q of questions) {
    await query(
      `INSERT INTO questions (id, subject, topic, subtopic, year, exam_body, type, question_text, options, correct_answer, explanation_text, difficulty, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO NOTHING`,
      [
        q.id,
        q.subject,
        q.topic || "General",
        q.subtopic || "",
        q.year,
        q.exam_body,
        q.type || "MCQ",
        q.question,
        JSON.stringify(q.options),
        q.answer,
        q.explanation,
        q.difficulty || "medium",
        JSON.stringify(q.tags || []),
      ]
    );
    count++;
  }
  res.json({ imported: count });
});

module.exports = router;
