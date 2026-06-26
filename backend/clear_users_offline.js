const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '../data/prepfast-db.json');

if (!fs.existsSync(backupPath)) {
  console.log("No database backup found. Your database is already empty.");
  process.exit(0);
}

try {
  let dump = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

  if (dump && dump.public && dump.public.tables) {
    const tablesToClear = ['users', 'students', 'teachers', 'parents', 'parent_links', 'parent_student_links', 'otp_codes', 'waitlist'];
    
    tablesToClear.forEach(tableName => {
      if (dump.public.tables[tableName]) {
        dump.public.tables[tableName].records = [];
      }
    });

    // Write back the modified dump
    fs.writeFileSync(backupPath, JSON.stringify(dump));
    console.log("All registered users have been cleared. The database is clean.");
  } else {
    console.log("Could not find tables in the backup.");
  }
} catch (e) {
  console.error("Failed to update database backup:", e);
}
