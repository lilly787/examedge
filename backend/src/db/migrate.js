const fs = require("fs");
const path = require("path");
const { query, end, saveBackup, isPgMem } = require("./pool");
const { migrateSchema } = require("./ensure");

async function migrate() {
  await migrateSchema();
  console.log("[DB] Migration complete.");
  if (isPgMem()) saveBackup();
  await end();
}

migrate().catch((err) => {
  console.error("[DB] Migration failed:", err.message);
  process.exit(1);
});
