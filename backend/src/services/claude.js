const config = require("../config");

const TUTOR_SYSTEM = `You are PrepFast Tutor — a friendly, expert Nigerian secondary school exam coach helping students prepare for WAEC, NECO, and JAMB.

Your role:
- If the student got it wrong, gently explain why and walk through the concept
- Use simple, clear English appropriate for SS2/SS3 students
- Give real-life Nigerian examples where possible
- For math/science, show working steps numbered 1, 2, 3...
- Be encouraging and never make the student feel bad for getting it wrong
- Keep responses under 200 words unless a step-by-step solution requires more
- End with: "Try a similar question to test your understanding!"`;

async function callClaude(messages, maxTokens = 1024) {
  if (!config.anthropic.apiKey) {
    return {
      text:
        "AI Tutor is not configured yet. Add ANTHROPIC_API_KEY to your .env file. " +
        "Meanwhile, read the explanation below and practice similar questions in Weakness Drill mode.",
      simulated: true,
    };
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.anthropic.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.anthropic.model,
      max_tokens: maxTokens,
      system: messages.system,
      messages: messages.userMessages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${err}`);
  }

  const data = await res.json();
  const text = data.content?.find((c) => c.type === "text")?.text || "";
  return { text, simulated: false };
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

  const userMessages = [
    {
      role: "user",
      content:
        context +
        (userMessage
          ? `\nStudent asks: ${userMessage}`
          : "\nPlease explain this question and help the student understand."),
    },
  ];

  return callClaude({ system: TUTOR_SYSTEM, userMessages });
}

async function generateStudyPlan({ examDate, subjects, weaknessMap, hoursPerDay }) {
  const prompt = `Generate a day-by-day study plan JSON array for a Nigerian secondary student.
Exam date: ${examDate}
Subjects: ${subjects.join(", ")}
Weak topics: ${JSON.stringify(weaknessMap)}
Daily study hours: ${hoursPerDay}

Return ONLY valid JSON array:
[{"date":"YYYY-MM-DD","subject":"...","topics":["..."],"question_count_target":20}]`;

  const result = await callClaude(
    {
      system: "You are a study plan generator. Return only JSON, no markdown.",
      userMessages: [{ role: "user", content: prompt }],
    },
    4096
  );

  try {
    const cleaned = result.text.replace(/```json|```/g, "").trim();
    return { plan: JSON.parse(cleaned), simulated: result.simulated };
  } catch {
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
