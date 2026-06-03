const { query } = require("../db/pool");

async function recalculateWeaknessMap(studentId) {
  const attempts = await query(
    `SELECT sp.is_correct, q.subject, q.topic, COALESCE(q.subtopic, '') AS subtopic
     FROM student_progress sp
     JOIN questions q ON q.id = sp.question_id
     WHERE sp.student_id = $1`,
    [studentId]
  );

  const map = {};
  for (const row of attempts.rows) {
    const key = `${row.subject}|||${row.topic}|||${row.subtopic}`;
    if (!map[key]) {
      map[key] = { subject: row.subject, topic: row.topic, subtopic: row.subtopic, attempts: 0, correct: 0 };
    }
    map[key].attempts += 1;
    if (row.is_correct) map[key].correct += 1;
  }

  for (const data of Object.values(map)) {
    const accuracy = data.attempts ? Math.round((data.correct / data.attempts) * 100) : 0;
    let status = "Unattempted";
    if (data.attempts >= 5 && accuracy < 60) status = "Needs Work";
    else if (accuracy > 85) status = "Strong";
    else if (data.attempts > 0) status = "Progressing";

    await query(
      `INSERT INTO weakness_map (student_id, subject, topic, subtopic, accuracy_rate, attempts_count, last_attempted, status)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),$7)
       ON CONFLICT (student_id, subject, topic, subtopic) DO UPDATE SET
         accuracy_rate = EXCLUDED.accuracy_rate,
         attempts_count = EXCLUDED.attempts_count,
         last_attempted = NOW(),
         status = EXCLUDED.status`,
      [studentId, data.subject, data.topic, data.subtopic, accuracy, data.attempts, status]
    );
  }

  return getWeaknessMap(studentId);
}

async function getWeaknessMap(studentId) {
  const rows = await query(
    `SELECT subject, topic, subtopic, accuracy_rate, attempts_count, status
     FROM weakness_map WHERE student_id = $1`,
    [studentId]
  );
  const subjects = {};
  for (const r of rows.rows) {
    if (!subjects[r.subject]) subjects[r.subject] = {};
    subjects[r.subject][r.topic] = {
      topic: r.topic,
      attempts: r.attempts_count,
      correct: Math.round((r.accuracy_rate / 100) * r.attempts_count),
      accuracy: Number(r.accuracy_rate),
      status: r.status,
    };
  }
  return subjects;
}

async function getExamReadinessScore(studentId) {
  const progress = await query(
    `SELECT is_correct, question_id FROM student_progress WHERE student_id = $1`,
    [studentId]
  );
  const totalQ = await query("SELECT COUNT(*)::int AS c FROM questions");
  const totalQuestions = totalQ.rows[0].c || 1;
  if (!progress.rows.length) return 0;

  const uniqueIds = new Set(progress.rows.map((p) => p.question_id));
  const breadthScore = (uniqueIds.size / totalQuestions) * 100;
  const correct = progress.rows.filter((p) => p.is_correct).length;
  const depthScore = (correct / progress.rows.length) * 100;

  const student = await query(
    "SELECT study_streak FROM students WHERE user_id = $1",
    [studentId]
  );
  const streak = student.rows[0]?.study_streak || 0;
  const consistencyScore = Math.min((streak / 7) * 100, 100);

  const finalScore = Math.round(
    breadthScore * 0.35 + depthScore * 0.55 + consistencyScore * 0.1
  );
  const score = Math.min(finalScore, 100);

  await query(
    "UPDATE students SET readiness_score = $1 WHERE user_id = $2",
    [score, studentId]
  );
  return score;
}

module.exports = {
  recalculateWeaknessMap,
  getWeaknessMap,
  getExamReadinessScore,
};
