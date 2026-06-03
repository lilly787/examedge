const fs = require("fs");
const path = require("path");
const { query } = require("./pool");
const { seedDatabase } = require("./seed");

async function tableExists(name) {
  try {
    await query(`SELECT 1 FROM ${name} LIMIT 1`);
    return true;
  } catch {
    return false;
  }
}

async function migrateSchema() {
  let sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  sql = sql.replace(/CREATE EXTENSION[^;]+;/gi, "");
  await query(sql);
}

async function ensureDatabaseReady() {
  const hasUsers = await tableExists("users");
  if (!hasUsers) {
    console.log("[DB] First run — creating tables...");
    await migrateSchema();
  }

  const count = await query("SELECT COUNT(*)::int AS c FROM questions");
  if (count.rows[0].c === 0) {
    console.log("[DB] Seeding questions from questions.js...");
    await seedDatabase();
  }

  try {
    await query("SELECT school_name FROM users LIMIT 1");
  } catch {
    console.log("[DB] Adding users.school_name column...");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS school_name TEXT");
  }
}

module.exports = { ensureDatabaseReady, migrateSchema };
