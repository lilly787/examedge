const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

let pool = null;
let pgMemDb = null;

function registerPgMemFunctions(db) {
  const { DataType } = require("pg-mem");
  db.public.registerFunction({
    name: "gen_random_uuid",
    returns: DataType.uuid,
    implementation: () => uuidv4(),
  });
}

function loadPgMemBackup(db) {
  const backupPath = config.pgMemBackupPath;
  if (!fs.existsSync(backupPath)) return false;
  try {
    const dump = JSON.parse(fs.readFileSync(backupPath, "utf8"));
    db.restore(dump);
    console.log("[DB] Restored in-memory database from", backupPath);
    return true;
  } catch (e) {
    console.warn("[DB] Could not restore backup:", e.message);
    return false;
  }
}

function savePgMemBackup() {
  if (!pgMemDb || !config.usePgMem) return;
  try {
    const dir = path.dirname(config.pgMemBackupPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const dump = pgMemDb.backup();
    fs.writeFileSync(config.pgMemBackupPath, JSON.stringify(dump));
  } catch (e) {
    console.warn("[DB] Snapshot save skipped:", e.message);
  }
}

function createPgMemPool() {
  const { newDb } = require("pg-mem");
  pgMemDb = newDb();
  registerPgMemFunctions(pgMemDb);

  const restored = loadPgMemBackup(pgMemDb);
  const { Pool: MemPool } = pgMemDb.adapters.createPg();
  const memPool = new MemPool();

  if (!restored) {
    console.log("[DB] Using in-memory PostgreSQL (pg-mem) — no Docker required.");
    console.log("[DB] Run: npm run db:setup   (first time only)");
  }

  return { pool: memPool, saveBackup: savePgMemBackup };
}

function createPostgresPool() {
  const { Pool } = require("pg");
  const pgPool = new Pool({ connectionString: config.databaseUrl });
  pgPool.on("error", (err) => {
    console.error("[DB] Unexpected error:", err.message);
  });
  console.log("[DB] Connected to PostgreSQL:", config.databaseUrl.replace(/:[^:@]+@/, ":***@"));
  return { pool: pgPool, saveBackup: () => {} };
}

function getPool() {
  if (!pool) {
    if (config.usePgMem) {
      const mem = createPgMemPool();
      pool = mem.pool;
      module.exports.saveBackup = mem.saveBackup;
    } else {
      const pg = createPostgresPool();
      pool = pg.pool;
      module.exports.saveBackup = pg.saveBackup;
    }
  }
  return pool;
}

async function query(text, params) {
  const p = getPool();
  return p.query(text, params);
}

async function end() {
  if (config.usePgMem) {
    savePgMemBackup();
    return;
  }
  if (pool) await pool.end();
}

module.exports = {
  query,
  end,
  getPool,
  saveBackup: savePgMemBackup,
  isPgMem: () => config.usePgMem,
};
