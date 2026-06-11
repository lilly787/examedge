const { query } = require("../db/pool");
const config = require("../config");

function normalizePhone(phone) {
  let p = String(phone).replace(/\D/g, "");
  if (p.startsWith("0")) p = "234" + p.slice(1);
  if (!p.startsWith("234")) p = "234" + p;
  return p;
}

async function sendOtp(phone) {
  const normalized = normalizePhone(phone);
  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await query("DELETE FROM otp_codes WHERE phone = $1", [normalized]);
  await query(
    "INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)",
    [normalized, code, expiresAt]
  );

  const isTermiiConfigured =
    config.termii.apiKey &&
    config.termii.apiKey !== "your-termii-api-key-here";

  if (isTermiiConfigured) {
    try {
      const res = await fetch("https://api.ng.termii.com/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: config.termii.apiKey,
          to: normalized,
          from: config.termii.senderId,
          sms: `Your PrepFast verification code is ${code}. Valid for 10 minutes.`,
          type: "plain",
          channel: "generic",
        }),
      });

      if (res.ok) {
        console.log(`[SMS] OTP sent to ${normalized} via Termii`);
        return { phone: normalized, devCode: null };
      }

      const errText = await res.text();
      // Graceful fallback: log Termii error but don't crash the app.
      // This allows dev/test to proceed while the sender ID is registered.
      console.warn(
        `[SMS] Termii rejected (${res.status}): ${errText}. Falling back to dev-mode OTP.`
      );
    } catch (fetchErr) {
      console.warn(`[SMS] Termii unreachable: ${fetchErr.message}. Falling back to dev-mode OTP.`);
    }
  }

  // Dev-mode / fallback: print OTP to server console
  console.log(`[OTP] ${normalized}: ${code}  ← use this code to log in`);
  return {
    phone: normalized,
    devCode: config.nodeEnv === "development" ? code : null,
  };
}

async function verifyOtp(phone, code) {
  const normalized = normalizePhone(phone);
  const result = await query(
    `SELECT code, expires_at FROM otp_codes WHERE phone = $1 ORDER BY created_at DESC LIMIT 1`,
    [normalized]
  );
  if (!result.rows.length) return false;
  const row = result.rows[0];
  if (new Date(row.expires_at) < new Date()) return false;
  if (row.code !== String(code).trim()) return false;
  await query("DELETE FROM otp_codes WHERE phone = $1", [normalized]);
  return true;
}

module.exports = { sendOtp, verifyOtp, normalizePhone };
