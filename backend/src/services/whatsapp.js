const { query } = require("../db/pool");
const config = require("../config");
const { normalizePhone } = require("./otp");

async function sendWhatsAppText(to, text) {
  if (!config.whatsapp.token || !config.whatsapp.phoneNumberId) {
    console.log(`[WhatsApp] Dev — to ${to}: ${text.slice(0, 80)}...`);
    return { simulated: true };
  }

  const res = await fetch(
    `https://graph.facebook.com/v18.0/${config.whatsapp.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.whatsapp.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalizePhone(to),
        type: "text",
        text: { body: text },
      }),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return { simulated: false };
}

async function getDailyQuestion() {
  const result = await query(
    `SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`
  );
  return result.rows[0] || null;
}

function formatDailyQuestion(q) {
  const opts = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
  return (
    `📚 ExamEdge Daily Question (${q.subject})\n\n` +
    `${q.question_text}\n\n` +
    `A) ${opts.A}\nB) ${opts.B}\nC) ${opts.C}\nD) ${opts.D}\n\n` +
    `Reply with A, B, C, or D.`
  );
}

async function handleIncomingMessage(from, body) {
  const phone = normalizePhone(from);
  const text = (body || "").trim().toUpperCase();

  const session = await query(
    "SELECT active_question_id FROM whatsapp_sessions WHERE phone = $1",
    [phone]
  );

  let questionId = session.rows[0]?.active_question_id;

  if (!questionId) {
    const q = await getDailyQuestion();
    if (!q) return "No questions available. Visit examedge.app";
    await query(
      `INSERT INTO whatsapp_sessions (phone, active_question_id, last_message_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (phone) DO UPDATE SET active_question_id = $2, last_message_at = NOW()`,
      [phone, q.id]
    );
    return formatDailyQuestion(q);
  }

  if (!["A", "B", "C", "D"].includes(text)) {
    return "Please reply with A, B, C, or D only.";
  }

  const qRow = await query("SELECT * FROM questions WHERE id = $1", [questionId]);
  const q = qRow.rows[0];
  if (!q) return "Session expired. Send any message for a new question.";

  const correct = q.correct_answer.toUpperCase() === text;
  const explanation = q.explanation_text || `The correct answer is ${q.correct_answer}.`;

  await query("DELETE FROM whatsapp_sessions WHERE phone = $1", [phone]);

  if (correct) {
    return `✅ Correct!\n\n${explanation}\n\n👉 Practice more: ${config.appUrl}`;
  }
  return `❌ Incorrect. The answer is ${q.correct_answer}.\n\n${explanation}\n\n👉 Review: ${config.appUrl}`;
}

module.exports = {
  sendWhatsAppText,
  getDailyQuestion,
  formatDailyQuestion,
  handleIncomingMessage,
};
