/**
 * ExamEdge Question Importer
 * Imports extra_questions.json and generated_questions.json into the running server.
 *
 * Usage: node import_questions.js
 *
 * Steps:
 *  1. Register/login as admin to get a JWT token
 *  2. Read both JSON files
 *  3. Validate each question has required fields
 *  4. POST in batches of 100 to /api/questions/bulk
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "http://127.0.0.1:8000";
const BATCH_SIZE = 100;

// ── Step 1: Obtain a JWT token via session/resume (no OTP needed in dev) ─────
async function getToken() {
  const phone = "+2348000000001";

  const res = await fetch(`${BASE_URL}/api/auth/session/resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, name: "ImportBot", role: "student" }),
  });
  const data = await res.json();
  console.log("[Auth] session/resume:", JSON.stringify(data).slice(0, 120));

  if (!data.token) {
    throw new Error("Could not obtain JWT token: " + JSON.stringify(data));
  }
  return data.token;
}

// ── Step 2: Validate a question ───────────────────────────────────────────────
function isValid(q) {
  if (!q || typeof q !== "object") return false;
  if (typeof q.question !== "string" || !q.question.trim()) return false;
  if (!q.options || typeof q.options !== "object") return false;
  const keys = Object.keys(q.options);
  if (keys.length < 2) return false;
  if (!q.answer || typeof q.answer !== "string") return false;
  return true;
}

// ── Step 3: Post a batch ──────────────────────────────────────────────────────
async function postBatch(questions, token) {
  const res = await fetch(`${BASE_URL}/api/questions/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questions }),
  });
  const data = await res.json();
  return data;
}

// ── Step 4: Import a file ─────────────────────────────────────────────────────
async function importFile(filePath, token) {
  console.log(`\n[Import] Reading ${path.basename(filePath)}...`);
  const raw = fs.readFileSync(filePath, "utf8");
  const all = JSON.parse(raw);
  console.log(`[Import]   Total records: ${all.length}`);

  const valid = all.filter(isValid);
  console.log(`[Import]   Valid questions: ${valid.length}`);
  console.log(`[Import]   Skipped (invalid): ${all.length - valid.length}`);

  let totalImported = 0;
  let batchNum = 0;

  for (let i = 0; i < valid.length; i += BATCH_SIZE) {
    const batch = valid.slice(i, i + BATCH_SIZE);
    batchNum++;
    try {
      const result = await postBatch(batch, token);
      totalImported += result.imported || 0;
      process.stdout.write(
        `\r[Import]   Batch ${batchNum}/${Math.ceil(valid.length / BATCH_SIZE)} — imported so far: ${totalImported}`
      );
    } catch (err) {
      console.error(`\n[Import]   Batch ${batchNum} ERROR: ${err.message}`);
    }
  }
  console.log(`\n[Import]   Done! Imported ${totalImported} questions from ${path.basename(filePath)}`);
  return totalImported;
}

// ── Step 5: Verify total count ────────────────────────────────────────────────
async function getCount() {
  const res = await fetch(`${BASE_URL}/api/questions/stats`);
  const data = await res.json();
  return data.total;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(60));
  console.log("  ExamEdge Question Importer");
  console.log("=".repeat(60));

  // 1. Get token
  let token;
  try {
    token = await getToken();
    console.log("[Auth] Token obtained.");
  } catch (err) {
    console.error("[Auth] FAILED:", err.message);
    process.exit(1);
  }

  const before = await getCount();
  console.log(`\n[DB] Questions before import: ${before}`);

  const root = path.join(__dirname);
  const files = [
    path.join(root, "extra_questions.json"),
    path.join(root, "generated_questions.json"),
  ];

  let grandTotal = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn(`[Import] File not found, skipping: ${file}`);
      continue;
    }
    grandTotal += await importFile(file, token);
  }

  const after = await getCount();
  console.log("\n" + "=".repeat(60));
  console.log(`  Import Complete!`);
  console.log(`  Questions before: ${before}`);
  console.log(`  Questions after:  ${after}`);
  console.log(`  New records:      ${after - before}`);
  console.log("=".repeat(60));

  if (after < 5000) {
    console.warn(`\n⚠️  Target is 5,000+ questions. Current: ${after}`);
  } else {
    console.log(`\n✅  Target reached! ${after} questions in DB.`);
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
