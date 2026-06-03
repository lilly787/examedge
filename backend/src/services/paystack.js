const { v4: uuidv4 } = require("uuid");
const config = require("../config");
const { query } = require("../db/pool");

async function initializePayment(userId, plan) {
  const amounts = {
    monthly: config.premium.monthlyKobo,
    yearly: config.premium.yearlyKobo,
    parent_addon: config.premium.parentAddonKobo,
  };
  const amount = amounts[plan] || amounts.monthly;
  const reference = `EE-${uuidv4().replace(/-/g, "").slice(0, 16)}`;

  await query(
    `INSERT INTO payments (user_id, reference, amount_kobo, status, plan)
     VALUES ($1, $2, $3, 'pending', $4)`,
    [userId, reference, amount, plan]
  );

  if (!config.paystack.secretKey) {
    return {
      reference,
      authorization_url: null,
      access_code: null,
      amount,
      simulated: true,
      message: "Paystack not configured — use dev verify endpoint",
    };
  }

  const user = await query("SELECT email, phone, name FROM users WHERE id = $1", [userId]);
  const u = user.rows[0];

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.paystack.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: u.email || `${u.phone}@examedge.app`,
      amount,
      reference,
      callback_url: `${config.appUrl}/index.html?payment=success`,
      metadata: { user_id: userId, plan },
    }),
  });

  const data = await res.json();
  if (!data.status) throw new Error(data.message || "Paystack init failed");

  return {
    reference,
    authorization_url: data.data.authorization_url,
    access_code: data.data.access_code,
    amount,
    public_key: config.paystack.publicKey,
    simulated: false,
  };
}

async function verifyPayment(reference) {
  if (!config.paystack.secretKey) {
    const pending = await query(
      "SELECT user_id, plan FROM payments WHERE reference = $1",
      [reference]
    );
    if (!pending.rows.length) throw new Error("Payment not found");
    await activateSubscription(pending.rows[0].user_id, pending.rows[0].plan, reference);
    return { status: "success", simulated: true };
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${config.paystack.secretKey}` },
    }
  );
  const data = await res.json();
  if (data.data?.status === "success") {
    const meta = data.data.metadata || {};
    await activateSubscription(meta.user_id, meta.plan || "monthly", reference);
    return { status: "success", simulated: false };
  }
  return { status: "failed" };
}

async function activateSubscription(userId, plan, reference) {
  await query(
    `UPDATE payments SET status = 'success' WHERE reference = $1`,
    [reference]
  );
  const tier = plan === "parent_addon" ? "premium" : "premium";
  await query(
    `UPDATE users SET subscription_tier = $1, updated_at = NOW() WHERE id = $2`,
    [tier, userId]
  );
}

async function handleWebhook(body) {
  if (body.event === "charge.success") {
    const reference = body.data?.reference;
    if (reference) await verifyPayment(reference);
  }
}

module.exports = { initializePayment, verifyPayment, handleWebhook };
