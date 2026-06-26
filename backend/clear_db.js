const { query, end } = require('./src/db/pool');

async function clearGenerated() {
  try {
    const res = await query("DELETE FROM questions WHERE exam_body != 'Internal'");
    console.log(`Deleted ${res.rowCount} generated questions.`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await end();
  }
}

clearGenerated();
