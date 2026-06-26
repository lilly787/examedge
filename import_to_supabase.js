const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const ALLOWED_SUBJECTS = [
  'Mathematics', 'English Language', 'Biology',
  'Chemistry', 'Physics', 'Economics', 'Government'
];

async function importQuestions() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Load the aloc_mapped_questions.json
    const filePath = path.join(__dirname, 'aloc_mapped_questions.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const allQuestions = JSON.parse(raw);

    // Filter to only the 7 core subjects
    const filtered = allQuestions.filter(q =>
      q && q.question && q.options && q.answer &&
      ALLOWED_SUBJECTS.includes(q.subject)
    );

    console.log(`Found ${allQuestions.length} total questions in file.`);
    console.log(`Filtered to ${filtered.length} questions in the 7 core subjects.`);

    // Count by subject
    const counts = {};
    filtered.forEach(q => {
      counts[q.subject] = (counts[q.subject] || 0) + 1;
    });
    console.log('\nBreakdown by subject:');
    Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([subj, count]) => {
      console.log(`  ${subj}: ${count} questions`);
    });

    // Insert into database
    let inserted = 0;
    for (const q of filtered) {
      try {
        await pool.query(
          `INSERT INTO questions (
            id, subject, topic, subtopic, year, exam_body, type,
            question_text, options, correct_answer, explanation_text,
            difficulty, tags
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
          ON CONFLICT (id) DO NOTHING`,
          [
            q.id,
            q.subject,
            q.topic || 'General',
            q.subtopic || '',
            q.year || 2020,
            q.exam_body || 'WAEC',
            q.type || 'MCQ',
            q.question,
            JSON.stringify(q.options || {}),
            q.answer,
            q.explanation || '',
            q.difficulty || 'medium',
            JSON.stringify(q.tags || []),
          ]
        );
        inserted++;
      } catch (err) {
        console.error(`Failed to insert ${q.id}:`, err.message);
      }
    }

    console.log(`\n✅ Successfully imported ${inserted} questions into Supabase!`);

    // Verify total
    const total = await pool.query('SELECT COUNT(*)::int AS c FROM questions');
    console.log(`Total questions now in database: ${total.rows[0].c}`);

  } catch (err) {
    console.error('Import failed:', err);
  } finally {
    await pool.end();
  }
}

importQuestions();
