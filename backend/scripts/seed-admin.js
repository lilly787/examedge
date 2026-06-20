/**
 * PrepFast Admin Seed Script
 * Creates the initial admin account in the database.
 *
 * Usage:
 *   node backend/scripts/seed-admin.js
 *
 * The admin user is created with role='admin' and a virtual UUID.
 * Admin access to the UI is gated by the ADMIN_PASSWORD env variable set in .env.
 * Do NOT add admin registration to any public-facing page.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

const ADMIN_ID = "00000000-0000-0000-0000-000000000001";
const ADMIN_PHONE = "+2340000000000";
const ADMIN_NAME = "Platform Administrator";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.prepfast_ADMIN_PASSWORD;

async function seedAdmin() {
  if (!ADMIN_PASSWORD) {
    console.error("[seed-admin] ERROR: ADMIN_PASSWORD is not set in .env");
    console.error("  Add ADMIN_PASSWORD=yourSecurePassword to your .env file first.");
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    // Check if admin already exists
    const existing = await client.query("SELECT id FROM users WHERE id = $1 OR role = 'admin'", [ADMIN_ID]);
    if (existing.rows.length > 0) {
      console.log(`[seed-admin] Admin account already exists (id=${existing.rows[0].id}). Skipping.`);
      return;
    }

    // Insert admin user
    await client.query(
      `INSERT INTO users (id, name, phone, role, subscription_tier, email)
       VALUES ($1, $2, $3, 'admin', 'premium', $4)
       ON CONFLICT (id) DO NOTHING`,
      [ADMIN_ID, ADMIN_NAME, ADMIN_PHONE, "admin@prepfast.ng"]
    );

    console.log("✅ Admin account seeded successfully.");
    console.log(`   ID:    ${ADMIN_ID}`);
    console.log(`   Name:  ${ADMIN_NAME}`);
    console.log(`   Phone: ${ADMIN_PHONE}`);
    console.log(`   Role:  admin`);
    console.log();
    console.log("🔐 Admin login uses the ADMIN_PASSWORD env variable (set in .env).");
    console.log("   Access the admin panel at: /admin.html");
    console.log("   NEVER share the admin password or add a link to admin.html on public pages.");
  } catch (err) {
    console.error("[seed-admin] ERROR:", err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin().catch(() => process.exit(1));
