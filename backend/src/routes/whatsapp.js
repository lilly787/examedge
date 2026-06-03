const express = require("express");
const config = require("../config");
const { handleIncomingMessage, sendWhatsAppText, getDailyQuestion, formatDailyQuestion } = require("../services/whatsapp");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === config.whatsapp.verifyToken) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

router.post("/webhook", async (req, res) => {
  try {
    const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];
    if (!message?.from) return res.sendStatus(200);

    const reply = await handleIncomingMessage(message.from, message.text?.body);
    await sendWhatsAppText(message.from, reply);
    res.sendStatus(200);
  } catch (e) {
    console.error("[WhatsApp]", e.message);
    res.sendStatus(200);
  }
});

router.post("/send-daily", authRequired, async (req, res) => {
  const { phone } = req.body;
  const q = await getDailyQuestion();
  if (!q) return res.status(404).json({ error: "No questions" });
  const text = formatDailyQuestion(q);
  await sendWhatsAppText(phone, text);
  res.json({ sent: true });
});

router.post("/simulate", async (req, res) => {
  const { from, body } = req.body;
  const reply = await handleIncomingMessage(from || "2348000000000", body);
  res.json({ reply });
});

module.exports = router;
