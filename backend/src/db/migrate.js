const fs = require("fs");
const path = require("path");
const { pool } = require("./pool");

async function migrate() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  console.log("[DB] Migration complete.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("[DB] Migration failed:", err.message);
  process.exit(1);
});
