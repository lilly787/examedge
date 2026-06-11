const express = require("express");
const { authRequired } = require("../middleware/auth");
const { initializePayment, verifyPayment, handleWebhook } = require("../services/paystack");
const config = require("../config");

const router = express.Router();

router.get("/config", (_req, res) => {
  res.json({
    public_key: config.paystack.publicKey,
    monthly_naira: config.premium.monthlyKobo / 100,
    yearly_naira: config.premium.yearlyKobo / 100,
  });
});

router.post("/initialize", authRequired, async (req, res) => {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY === "sk_test_your-paystack-key-here" || process.env.PAYSTACK_SECRET_KEY === "sk_test_xxx") {
      return res.status(503).json({
        error: "Paystack payments not configured",
        message: "Add PAYSTACK_SECRET_KEY to your .env file"
      });
    }
    const plan = req.body.plan || "monthly";
    const result = await initializePayment(req.user.id, plan);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/verify/:reference", authRequired, async (req, res) => {
  try {
    const result = await verifyPayment(req.params.reference);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/dev-activate", authRequired, async (req, res) => {
  if (config.nodeEnv === "production") {
    return res.status(403).json({ error: "Not available in production" });
  }
  const { activateSubscription } = require("../services/paystack");
  const plan = req.body.plan || "monthly";
  const init = await initializePayment(req.user.id, plan);
  await activateSubscription(req.user.id, plan, init.reference);
  res.json({ status: "success", reference: init.reference });
});

router.post("/webhook", async (req, res) => {
  try {
    await handleWebhook(req.body);
    res.sendStatus(200);
  } catch {
    res.sendStatus(400);
  }
});

module.exports = router;
