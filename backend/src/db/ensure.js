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

  // Ensure schools table has email, phone, address
  try {
    await query("SELECT email FROM schools LIMIT 1");
  } catch {
    console.log("[DB] Adding schools columns (email, phone, address)...");
    await query("ALTER TABLE schools ADD COLUMN IF NOT EXISTS email TEXT");
    await query("ALTER TABLE schools ADD COLUMN IF NOT EXISTS phone TEXT");
    await query("ALTER TABLE schools ADD COLUMN IF NOT EXISTS address TEXT");
  }

  // Ensure teachers table has subject_taught, purpose
  try {
    await query("SELECT subject_taught FROM teachers LIMIT 1");
  } catch {
    console.log("[DB] Adding teachers columns (subject_taught, purpose)...");
    await query("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subject_taught TEXT");
    await query("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS purpose TEXT");
  }

  // Ensure users table role CHECK constraint is updated
  try {
    await query("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
    await query("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'parent', 'school', 'admin'))");
  } catch (e) {
    console.log("[DB] Could not update users.role constraint:", e.message);
  }

  // Ensure parent_links table exists
  const hasParentLinks = await tableExists("parent_links");
  if (!hasParentLinks) {
    console.log("[DB] Creating parent_links table...");
    await query(`
      CREATE TABLE IF NOT EXISTS parent_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
        student_id UUID REFERENCES users(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('linked', 'pending')),
        requested_code TEXT,
        child_name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (parent_id, student_id)
      )
    `);
  }
}

module.exports = { ensureDatabaseReady, migrateSchema };
