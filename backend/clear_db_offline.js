const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '../data/prepfast-db.json');

if (!fs.existsSync(backupPath)) {
  console.log("No database backup found. Start and stop your server once to create it, or your database is already empty.");
  process.exit(0);
}

try {
  let dump = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

  // The dump from pg-mem has a specific structure. We need to clear the questions table.
  // Tables are under dump.public.tables.questions.records
  if (dump && dump.public && dump.public.tables && dump.public.tables.questions) {
    const questionsTable = dump.public.tables.questions;
    
    // Filter to keep only questions where exam_body is 'Internal'
    const originalCount = questionsTable.records.length;
    questionsTable.records = questionsTable.records.filter(record => {
      // The record is an array of values corresponding to columns.
      // We need to find the index of the 'exam_body' column.
      const examBodyIndex = questionsTable.columns.findIndex(c => c.name === 'exam_body');
      
      if (examBodyIndex === -1) return false;
      return record[examBodyIndex] === 'Internal';
    });
    
    const newCount = questionsTable.records.length;
    console.log(`Deleted ${originalCount - newCount} generated questions. Kept ${newCount} uploaded questions.`);

    // Write back the modified dump
    fs.writeFileSync(backupPath, JSON.stringify(dump));
    console.log("Database updated successfully.");
  } else {
    console.log("Questions table not found in the backup. No questions to clear.");
  }
} catch (e) {
  console.error("Failed to update database backup:", e);
}
