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
    common_mistakes: row.common_mistakes,
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
    const qId = q.id || "imported-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
    await query(
      `INSERT INTO questions (id, subject, topic, subtopic, year, exam_body, type, question_text, options, correct_answer, explanation_text, common_mistakes, difficulty, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO NOTHING`,
      [
        qId,
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
        q.common_mistakes || "",
        q.difficulty || "medium",
        JSON.stringify(q.tags || []),
      ]
    );
    count++;
  }
  res.json({ imported: count });
});


const { requireRole } = require("../middleware/auth");

router.post("/", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const q = req.body;
    if (!q.question || !q.subject || !q.answer || !q.options) {
      return res.status(400).json({ error: "Missing required fields (question, subject, answer, options)" });
    }

    const id = q.id || "cust-" + Date.now();
    await query(
      `INSERT INTO questions (id, subject, topic, subtopic, year, exam_body, type, question_text, options, correct_answer, explanation_text, common_mistakes, difficulty, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         subject = EXCLUDED.subject,
         topic = EXCLUDED.topic,
         subtopic = EXCLUDED.subtopic,
         year = EXCLUDED.year,
         exam_body = EXCLUDED.exam_body,
         question_text = EXCLUDED.question_text,
         options = EXCLUDED.options,
         correct_answer = EXCLUDED.correct_answer,
         explanation_text = EXCLUDED.explanation_text,
         common_mistakes = EXCLUDED.common_mistakes,
         difficulty = EXCLUDED.difficulty,
         tags = EXCLUDED.tags`,
      [
        id,
        q.subject,
        q.topic || "General",
        q.subtopic || "",
        q.year || 2025,
        q.exam_body || "WAEC",
        q.type || "MCQ",
        q.question,
        JSON.stringify(q.options),
        q.answer,
        q.explanation || "",
        q.common_mistakes || "",
        q.difficulty || "medium",
        JSON.stringify(q.tags || []),
      ]
    );

    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const result = await query("DELETE FROM questions WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
