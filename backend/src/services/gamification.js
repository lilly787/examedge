const { query } = require("../db/pool");

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / 86400000);
  return Math.ceil((days + start.getDay() + 1) / 7);
}

async function awardXp(studentId, amount) {
  await query(
    "UPDATE students SET xp = COALESCE(xp, 0) + $1 WHERE user_id = $2",
    [amount, studentId]
  );
  const row = await query("SELECT xp FROM students WHERE user_id = $1", [studentId]);
  const xp = row.rows[0]?.xp || 0;
  await updateLeaderboard(studentId, xp);
  await checkBadges(studentId, xp);
  return xp;
}

async function updateLeaderboard(studentId, xp) {
  const week = getWeekNumber();
  const year = new Date().getFullYear();
  const user = await query(
    `SELECT u.name, s.user_id, u.school_id FROM students s JOIN users u ON u.id = s.user_id WHERE s.user_id = $1`,
    [studentId]
  );
  if (!user.rows.length) return;

  await query(
    `INSERT INTO leaderboard_entries (student_id, school_id, score, xp, week_number, year, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (student_id, week_number, year) DO UPDATE SET
       xp = EXCLUDED.xp, score = EXCLUDED.score, updated_at = NOW()`,
    [studentId, user.rows[0].school_id, Math.floor(xp / 5), xp, week, year]
  );
}

async function checkBadges(studentId, xp) {
  const student = await query(
    "SELECT study_streak, readiness_score FROM students WHERE user_id = $1",
    [studentId]
  );
  const s = student.rows[0] || {};
  const progress = await query(
    "SELECT COUNT(*)::int AS c FROM student_progress WHERE student_id = $1",
    [studentId]
  );
  const count = progress.rows[0].c;

  const toAward = [];
  if (s.study_streak >= 7) toAward.push("streak-7");
  if (count >= 100) toAward.push("first-100");
  if (s.readiness_score >= 75) toAward.push("jamb-ready");

  for (const badgeId of toAward) {
    await query(
      `INSERT INTO student_badges (student_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [studentId, badgeId]
    );
  }
}

async function getLeaderboard({ schoolId, state, limit = 10 }) {
  const week = getWeekNumber();
  const year = new Date().getFullYear();
  let sql = `
    SELECT le.xp, le.score, u.name, u.id AS user_id,
           COALESCE(sch.name, 'Independent') AS school_name
    FROM leaderboard_entries le
    JOIN students st ON st.user_id = le.student_id
    JOIN users u ON u.id = st.user_id
    LEFT JOIN schools sch ON sch.id = le.school_id
    WHERE le.week_number = $1 AND le.year = $2`;
  const params = [week, year];

  if (schoolId) {
    params.push(schoolId);
    sql += ` AND le.school_id = $${params.length}`;
  }
  if (state) {
    params.push(state);
    sql += ` AND le.state = $${params.length}`;
  }
  params.push(limit);
  sql += ` ORDER BY le.xp DESC LIMIT $${params.length}`;

  const result = await query(sql, params);
  return result.rows.map((r, i) => ({
    rank: i + 1,
    name: r.name,
    school: r.school_name,
    score: r.score,
    xp: r.xp,
    user_id: r.user_id,
  }));
}

module.exports = { awardXp, getLeaderboard, getWeekNumber };
