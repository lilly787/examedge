const fs = require("fs");
const path = require("path");
const { query, end, saveBackup, isPgMem } = require("./pool");

const BADGES = [
  { id: "streak-7", name: "7-Day Streak", description: "Studied 7 days in a row", icon: "🔥" },
  { id: "bio-master", name: "Biology Master", description: "85%+ accuracy in Biology", icon: "🧬" },
  { id: "mock-warrior", name: "Mock Exam Warrior", description: "Completed 5 mock exams", icon: "⚔️" },
  { id: "first-100", name: "Century Club", description: "Answered 100 questions", icon: "💯" },
  { id: "jamb-ready", name: "JAMB Ready", description: "Readiness score above 75%", icon: "🎯" },
];

function parseQuestionsJs() {
  const filePath = path.join(__dirname, "../../../questions.js");
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/const\s+EXAMEDGE_QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return [];
  return JSON.parse(match[1]);
}

async function seedQuestions(questions) {
  let inserted = 0;
  for (const q of questions) {
    const res = await query(
      `INSERT INTO questions (
        id, subject, topic, subtopic, year, exam_body, type,
        question_text, options, correct_answer, explanation_text,
        explanation_video_url, difficulty, tags
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (id) DO UPDATE SET
        question_text = EXCLUDED.question_text,
        options = EXCLUDED.options,
        explanation_text = EXCLUDED.explanation_text`,
      [
        q.id,
        q.subject,
        q.topic || "General",
        q.subtopic || "",
        q.year || 2020,
        q.exam_body || "WAEC",
        q.type || "MCQ",
        q.question,
        JSON.stringify(q.options || {}),
        q.answer,
        q.explanation || "",
        q.video_url || null,
        q.difficulty || "medium",
        JSON.stringify(q.tags || []),
      ]
    );
    if (res.rowCount) inserted++;
  }
  return inserted;
}

async function seedDemoSchool() {
  const code = "EXEDGE-DEMO";
  const existing = await query("SELECT id FROM schools WHERE school_code = $1", [code]);
  if (existing.rows.length) return existing.rows[0].id;

  const school = await query(
    `INSERT INTO schools (name, state, lga, type, subscription_tier, school_code)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    ["Government College Lagos (Demo)", "Lagos", "Yaba", "public", "school", code]
  );
  return school.rows[0].id;
}

async function seedDatabase() {
  const questions = parseQuestionsJs();
  console.log(`[Seed] Loading ${questions.length} questions from questions.js...`);
  const count = await seedQuestions(questions);
  console.log(`[Seed] Upserted ${count} questions.`);

  for (const b of BADGES) {
    await query(
      `INSERT INTO badges (id, name, description, icon) VALUES ($1,$2,$3,$4)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.name, b.description, b.icon]
    );
  }
  console.log("[Seed] Badges ready.");

  const schoolId = await seedDemoSchool();
  console.log("[Seed] Demo school:", schoolId);

  const total = await query("SELECT COUNT(*)::int AS c FROM questions");
  console.log(`[Seed] Total questions in DB: ${total.rows[0].c}`);
  if (total.rows[0].c < 5000) {
    console.log(
      `[Seed] Note: Blueprint targets 5,000+ questions. Run import_aloc_questions.py or bulk-upload via admin to grow the bank.`
    );
  }

}

if (require.main === module) {
  const { migrateSchema } = require("./ensure");
  migrateSchema()
    .then(() => seedDatabase())
    .then(() => {
      if (isPgMem()) saveBackup();
      return end();
    })
    .catch((err) => {
      console.error("[Seed] Failed:", err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
