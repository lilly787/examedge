const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const res = await pool.query(`
      SELECT subject, exam_body, year, COUNT(*) 
      FROM questions 
      GROUP BY subject, exam_body, year 
      ORDER BY year DESC, subject ASC
    `);
    
    console.log("Here are the groups of questions currently in Supabase:");
    res.rows.forEach(r => {
      console.log(`- ${r.subject} (${r.exam_body} ${r.year}): ${r.count} questions`);
    });

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
