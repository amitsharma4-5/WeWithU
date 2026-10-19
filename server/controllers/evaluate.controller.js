import { askAi } from "../services/groq.service.js";
import {
  scoreMcqBatch,
  calculateTestScore,
  calculateOverallScore
} from "../services/scorer.service.js";

function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const evaluateMcq = async (req, res) => {
  try {
    const submissions = req.body;
    if (!Array.isArray(submissions)) {
      return res.status(400).json({ detail: "Request body must be a list of MCQ submissions." });
    }

    const results = scoreMcqBatch(submissions);
    return res.json(results);
  } catch (error) {
    console.error("evaluateMcq error:", error);
    return res.status(500).json({ detail: error.message });
  }
};

export const evaluateWritten = async (req, res) => {
  try {
    const { question, answer, key_points, role, level } = req.body;

    const cleanedQuestion = cleanText(question);
    const cleanedAnswer = cleanText(answer);
    const keyPointsStr = Array.isArray(key_points) ? key_points.join(", ") : "";

    const prompt = `You are a strict but fair ${role || "Software Developer"} technical interviewer evaluating a ${level || "fresher"} candidate.

Question: ${cleanedQuestion}
Expected key points: ${keyPointsStr}
Candidate answer: "${cleanedAnswer}"

Return ONLY valid JSON (no markdown, no extra text):
{
  "score": 5,
  "verdict": "Average",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestion": "one actionable tip",
  "missed_concepts": ["concept 1", "concept 2"],
  "ideal_answer_hint": "2-3 sentences of perfect answer"
}`;

    const messages = [{ role: "system", content: prompt }];
    const result = await askAi(messages, { json: true, returnParsed: true, temperature: 0.3 });
    return res.json(result);
  } catch (error) {
    console.error("evaluateWritten error:", error);
    return res.status(500).json({ detail: error.message });
  }
};

export const evaluateSoftskill = async (req, res) => {
  try {
    const { scenario, question, answer, role } = req.body;

    const cleanedScenario = cleanText(scenario);
    const cleanedQuestion = cleanText(question);
    const cleanedAnswer = cleanText(answer);

    const prompt = `You are an HR interviewer evaluating soft skills for a ${role || "Software Developer"} position.

Scenario: ${cleanedScenario}
Question: ${cleanedQuestion}
Candidate answer: "${cleanedAnswer}"

Return ONLY valid JSON (no markdown, no extra text):
{
  "score": 5,
  "verdict": "Average",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestion": "one tip",
  "star_method_used": true,
  "communication_rating": "Clear"
}`;

    const messages = [{ role: "system", content: prompt }];
    const result = await askAi(messages, { json: true, returnParsed: true, temperature: 0.3 });
    return res.json(result);
  } catch (error) {
    console.error("evaluateSoftskill error:", error);
    return res.status(500).json({ detail: error.message });
  }
};

export const evaluateProject = async (req, res) => {
  try {
    const { question, answer, role } = req.body;

    const cleanedQuestion = cleanText(question);
    const cleanedAnswer = cleanText(answer);

    const prompt = `You are a technical interviewer evaluating a candidate's project knowledge.

Project: Resume Project
Question: ${cleanedQuestion}
Candidate answer: "${cleanedAnswer}"

Return ONLY valid JSON (no markdown, no extra text):
{
  "score": 5,
  "verdict": "Average",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestion": "one tip",
  "depth_of_knowledge": "Deep"
}`;

    const messages = [{ role: "system", content: prompt }];
    const result = await askAi(messages, { json: true, returnParsed: true, temperature: 0.3 });
    return res.json(result);
  } catch (error) {
    console.error("evaluateProject error:", error);
    return res.status(500).json({ detail: error.message });
  }
};

export const getTestScore = async (req, res) => {
  try {
    const { test_type, answers, total_questions } = req.body;
    const score = calculateTestScore(test_type, answers, total_questions);
    return res.json(score);
  } catch (error) {
    console.error("getTestScore error:", error);
    return res.status(500).json({ detail: error.message });
  }
};

export const getFinalReport = async (req, res) => {
  try {
    const { candidate_name, target_role, level, test_scores, all_weaknesses, all_strengths } = req.body;

    const scoresStr = test_scores.map(ts => `- ${ts.test_name}: ${ts.score}/${ts.total} (${ts.percentage}%)`).join("\n");
    const weaknessesStr = Array.isArray(all_weaknesses) ? all_weaknesses.slice(0, 10).join(", ") : "";
    const strengthsStr = Array.isArray(all_strengths) ? all_strengths.slice(0, 8).join(", ") : "";

    const prompt = `You are a career coach reviewing a complete mock interview session.

Candidate: ${candidate_name}
Target Role: ${target_role}
Level: ${level}
Test Results:
${scoresStr}
Weaknesses: ${weaknessesStr}
Strengths: ${strengthsStr}

Return ONLY valid JSON (no markdown, no extra text):
{
  "overall_score": 7.5,
  "overall_percentage": 75.0,
  "rating": "Strong",
  "summary": "assessment paragraph",
  "positive_areas": ["area 1", "area 2"],
  "negative_areas": ["area 1", "area 2"],
  "study_plan": [
    {
      "topic": "topic name",
      "priority": "high",
      "resource": "resource link/details"
    }
  ],
  "readiness_score": 75,
  "estimated_ready_in": "2 weeks"
}`;

    const messages = [{ role: "system", content: prompt }];
    const result = await askAi(messages, { json: true, returnParsed: true, temperature: 0.35 });
    return res.json(result);
  } catch (error) {
    console.error("getFinalReport error:", error);
    return res.status(500).json({ detail: error.message });
  }
};

export const getOverallScore = async (req, res) => {
  try {
    const { test_scores } = req.body;
    const result = calculateOverallScore(test_scores);
    return res.json(result);
  } catch (error) {
    console.error("getOverallScore error:", error);
    return res.status(500).json({ detail: error.message });
  }
};
