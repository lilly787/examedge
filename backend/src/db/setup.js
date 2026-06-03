const { migrateSchema } = require("./ensure");
const { seedDatabase } = require("./seed");
const { end, saveBackup, isPgMem } = require("./pool");

async function setup() {
  await migrateSchema();
  console.log("[DB] Migration complete.");
  await seedDatabase();
  if (isPgMem()) saveBackup();
  await end();
  console.log("[DB] Setup complete.");
}

setup().catch((err) => {
  console.error("[DB] Setup failed:", err.message);
  process.exit(1);
});
