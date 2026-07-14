const config = require("../config");
const { GoogleGenAI } = require("@google/genai");

const TUTOR_SYSTEM = `You are PrepFast Tutor — a friendly, expert Nigerian secondary school exam coach helping students prepare for WAEC, NECO, and JAMB.

Your role:
- If the student got it wrong, gently explain why and walk through the concept
- Use simple, clear English appropriate for SS2/SS3 students
- Give real-life Nigerian examples where possible
- For math/science, show working steps numbered 1, 2, 3...
- Be encouraging and never make the student feel bad for getting it wrong
- Keep responses under 200 words unless a step-by-step solution requires more
- End with: "Try a similar question to test your understanding!"`;

async function callGemini(systemInstruction, userMessage, responseMimeType = "text/plain") {
  if (!config.gemini.apiKey) {
    return {
      text:
        "AI Tutor is not configured yet. Add GEMINI_API_KEY to your .env file. " +
        "Meanwhile, read the explanation below and practice similar questions in Weakness Drill mode.",
      simulated: true,
    };
  }

  const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });

  try {
    const response = await ai.models.generateContent({
      model: config.gemini.model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: responseMimeType
      }
    });

    return { text: response.text, simulated: false };
  } catch (err) {
    throw new Error(`Gemini API error: ${err.message || err}`);
  }
}

async function tutorReply({ question, studentAnswer, userMessage }) {
  const context = `
Current context:
Subject: ${question.subject}
Topic: ${question.topic}
Question: ${question.question_text}
Student's answer: ${studentAnswer || "Not answered"}
Correct answer: ${question.correct_answer}
`;

  const finalMessage = context + (userMessage ? `\nStudent asks: ${userMessage}` : "\nPlease explain this question and help the student understand.");

  return callGemini(TUTOR_SYSTEM, finalMessage);
}

async function generateStudyPlan({ examDate, subjects, weaknessMap, hoursPerDay }) {
  const prompt = `Generate a day-by-day study plan JSON array for a Nigerian secondary student.
Exam date: ${examDate}
Subjects: ${subjects.join(", ")}
Weak topics: ${JSON.stringify(weaknessMap)}
Daily study hours: ${hoursPerDay}

Return ONLY a JSON array with this structure, nothing else:
[{"date":"YYYY-MM-DD","subject":"...","topics":["..."],"question_count_target":20}]`;

  try {
    const result = await callGemini(
      "You are a study plan generator. Return only JSON, no markdown.",
      prompt,
      "application/json"
    );

    if (result.simulated) {
      return { plan: buildFallbackPlan(examDate, subjects, hoursPerDay), simulated: true };
    }

    const cleaned = result.text.replace(/```json|```/g, "").trim();
    return { plan: JSON.parse(cleaned), simulated: false };
  } catch (err) {
    console.error("[generateStudyPlan] Gemini failed:", err.message);
    return { plan: buildFallbackPlan(examDate, subjects, hoursPerDay), simulated: true };
  }
}

function buildFallbackPlan(examDate, subjects, hoursPerDay) {
  const subjList =
    Array.isArray(subjects) && subjects.length > 0
      ? subjects
      : ["Mathematics", "English Language", "Biology", "Chemistry", "Physics"];

  const plan = [];
  const end = new Date(examDate);
  if (Number.isNaN(end.getTime())) {
    end.setTime(Date.now() + 60 * 86400000);
  }
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  let day = 0;
  const maxDays = 90;

  while (start <= end && day < maxDays) {
    const d = new Date(start);
    d.setDate(d.getDate() + day);
    const subject = subjList[day % subjList.length];
    plan.push({
      date: d.toISOString().split("T")[0],
      subject,
      topics: ["Past questions", "Topic revision"],
      question_count_target: Math.min(30, Math.max(10, (hoursPerDay || 2) * 10)),
    });
    day++;
  }

  if (!plan.length) {
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      plan.push({
        date: d.toISOString().split("T")[0],
        subject: subjList[i % subjList.length],
        topics: ["General revision"],
        question_count_target: 20,
      });
    }
  }
  return plan;
}

module.exports = { tutorReply, generateStudyPlan, buildFallbackPlan };
