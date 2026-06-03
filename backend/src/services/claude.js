const config = require("../config");

const TUTOR_SYSTEM = `You are ExamEdge Tutor — a friendly, expert Nigerian secondary school exam coach helping students prepare for WAEC, NECO, and JAMB.

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
  const plan = [];
  const end = new Date(examDate);
  const start = new Date();
  let day = 0;
  while (start <= end && day < 60) {
    const d = new Date(start);
    d.setDate(d.getDate() + day);
    const subject = subjects[day % subjects.length];
    plan.push({
      date: d.toISOString().split("T")[0],
      subject,
      topics: ["General revision"],
      question_count_target: Math.min(30, hoursPerDay * 10),
    });
    day++;
  }
  return plan;
}

module.exports = { tutorReply, generateStudyPlan };
