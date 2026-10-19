import { askAi } from "../services/groq.service.js";

const TIME_LIMITS = {
  mcq_technical:  25 * 60,   // 25 minutes for 12 MCQs
  written:        30 * 60,   // 30 minutes for 4 written
  aptitude:       20 * 60,   // 20 minutes for 10 aptitude
  soft_skills:    20 * 60,   // 20 minutes for 5 scenarios
  project:        15 * 60,   // 15 minutes for 4 project Qs
};

// Helper: safe JSON parsing with fallback
function parseJsonArray(content) {
  try {
    // If it's already an array, return it
    if (Array.isArray(content)) return content;
    
    let parsed;
    if (typeof content === "string") {
      // First, try searching for a JSON array using regex
      const matchArray = content.match(/\[[\s\S]*\]/);
      if (matchArray) {
        try {
          parsed = JSON.parse(matchArray[0]);
        } catch (e) {
          // fallback
        }
      }
      
      if (!parsed) {
        // Next, search for a JSON object using regex
        const matchObj = content.match(/\{[\s\S]*\}/);
        if (matchObj) {
          parsed = JSON.parse(matchObj[0]);
        } else {
          parsed = JSON.parse(content);
        }
      }
    } else {
      parsed = content;
    }

    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.questions)) {
      return parsed.questions;
    }
    if (parsed && typeof parsed === "object") {
      for (const key in parsed) {
        if (Array.isArray(parsed[key])) {
          return parsed[key];
        }
      }
      // If it's a single question object, wrap it in an array
      return [parsed];
    }
    throw new Error("Parsed content is not an array");
  } catch (e) {
    console.error("Failed to parse JSON array from:", content);
    throw new Error("Invalid question format received from AI.");
  }
}

const DEFAULT_COUNTS = {
  mcq_technical: 12,
  written: 4,
  aptitude: 10,
  soft_skills: 5,
  project: 4,
};

async function getTechnicalMCQs(resume_data, role, difficulty_mode = "medium", question_count = 12) {
  const skills = resume_data?.skills || ["Programming", "SQL"];
  const skillsStr = skills.slice(0, 8).join(", ");
  const level = resume_data?.experience_level || "fresher";
  const diffStr = difficulty_mode === "expert" ? "Expert / Advanced" : difficulty_mode.charAt(0).toUpperCase() + difficulty_mode.slice(1);

  const prompt = `Generate exactly ${question_count} technical MCQ questions for a ${level} ${role} candidate.
Difficulty Level Mode: ${diffStr} (Make all questions strictly conform to this difficulty level).
Skills: ${skillsStr}

CRITICAL: Return ONLY a JSON object with a "questions" key containing the array of questions. Do not include any conversational preamble or postamble text outside the JSON object. Do not wrap it in markdown code blocks. The JSON array elements must strictly contain the "explanation" field populated with detailed explanations of why the correct option is right.

Example format:
{
  "questions": [
    {
      "id": 1,
      "question": "What is X?",
      "options": [
        {"label": "A", "text": "option1"},
        {"label": "B", "text": "option2"},
        {"label": "C", "text": "option3"},
        {"label": "D", "text": "option4"}
      ],
      "correct_answer": "A",
      "explanation": "Because X is option1 which has block scope."
    }
  ]
}

Generate exactly ${question_count} questions in this exact JSON object format. All ${question_count} questions must be strictly ${diffStr} level.`;

  const messages = [{ role: "system", content: prompt }];
  const response = await askAi(messages, { 
    json: true, 
    returnParsed: true, 
    temperature: 0.15,
    max_tokens: Math.max(800, question_count * 200)
  });
  return parseJsonArray(response);
}

async function getWrittenQuestions(resume_data, role, difficulty_mode = "medium", question_count = 4) {
  const skills = resume_data?.skills || ["Programming", "SQL"];
  const skillsStr = skills.slice(0, 6).join(", ");
  const level = resume_data?.experience_level || "fresher";
  const diffStr = difficulty_mode === "expert" ? "Expert / Advanced" : difficulty_mode.charAt(0).toUpperCase() + difficulty_mode.slice(1);

  const prompt = `Generate exactly ${question_count} written answer questions for a ${level} ${role} candidate.
Difficulty Level Mode: ${diffStr} (Make all questions strictly conform to this difficulty level).
Skills: ${skillsStr}

CRITICAL: Return ONLY a JSON object with a "questions" key containing the array of questions. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
{
  "questions": [
    {
      "id": 1,
      "question": "Explain X with examples.",
      "key_points": ["point1", "point2", "point3"],
      "difficulty": "medium",
      "expected_length": "medium"
    }
  ]
}

Generate exactly ${question_count} questions in this exact JSON object format. All ${question_count} questions must be strictly ${diffStr} level.`;

  const messages = [{ role: "system", content: prompt }];
  const response = await askAi(messages, { 
    json: true, 
    returnParsed: true, 
    temperature: 0.2,
    max_tokens: Math.max(500, question_count * 150)
  });
  return parseJsonArray(response);
}

async function getAptitudeQuestions(difficulty_mode = "medium", question_count = 10) {
  const diffStr = difficulty_mode === "expert" ? "Expert / Advanced" : difficulty_mode.charAt(0).toUpperCase() + difficulty_mode.slice(1);

  const prompt = `Generate exactly ${question_count} aptitude MCQ questions for a placement exam.
Difficulty Level Mode: ${diffStr} (Make all questions strictly conform to this difficulty level).
Mix: logical reasoning, quantitative, data interpretation, and verbal questions.

CRITICAL: Return ONLY a JSON object with a "questions" key containing the array of questions. Do not include any conversational preamble or postamble text outside the JSON object. Do not wrap it in markdown code blocks. The JSON array elements must strictly contain the "explanation" field populated with detailed explanations of why the correct option is right.

Example format:
{
  "questions": [
    {
      "id": 1,
      "type": "logical",
      "question": "If A is B then C is?",
      "options": [
        {"label": "A", "text": "option1"},
        {"label": "B", "text": "option2"},
        {"label": "C", "text": "option3"},
        {"label": "D", "text": "option4"}
      ],
      "correct_answer": "B",
      "explanation": "Because logic says C is the direct match for B."
    }
  ]
}

Generate exactly ${question_count} questions in this exact JSON object format. All ${question_count} questions must be strictly ${diffStr} level.`;

  const messages = [{ role: "system", content: prompt }];
  const response = await askAi(messages, { 
    json: true, 
    returnParsed: true, 
    temperature: 0.1,
    max_tokens: Math.max(800, question_count * 200)
  });
  return parseJsonArray(response);
}

async function getSoftSkillQuestions(role, difficulty_mode = "medium", question_count = 5) {
  const diffStr = difficulty_mode === "expert" ? "Expert / Advanced" : difficulty_mode.charAt(0).toUpperCase() + difficulty_mode.slice(1);

  const prompt = `Generate exactly ${question_count} soft skill scenario questions for a ${role} position.
Difficulty Level Mode: ${diffStr} (Make all scenarios and questions strictly conform to this difficulty level).
Test: communication, teamwork, problem solving, leadership, conflict resolution.

CRITICAL: Return ONLY a JSON object with a "questions" key containing the array of questions. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
{
  "questions": [
    {
      "id": 1,
      "skill_tested": "communication",
      "scenario": "Your team disagrees on approach.",
      "question": "What would you do?",
      "evaluation_criteria": ["shows clarity", "shows empathy", "shows solution focus"]
    }
  ]
}

Generate exactly ${question_count} questions in this exact JSON object format. All ${question_count} questions must be strictly ${diffStr} level.`;

  const messages = [{ role: "system", content: prompt }];
  const response = await askAi(messages, { 
    json: true, 
    returnParsed: true, 
    temperature: 0.25,
    max_tokens: Math.max(500, question_count * 150)
  });
  return parseJsonArray(response);
}

async function getProjectQuestions(resume_data, role, difficulty_mode = "medium", question_count = 4) {
  const projects = resume_data?.projects || [];
  if (projects.length === 0) {
    return [];
  }

  const projectsStr = projects.map(p => `${p.name}: ${p.description}`).join(" | ");
  const diffStr = difficulty_mode === "expert" ? "Expert / Advanced" : difficulty_mode.charAt(0).toUpperCase() + difficulty_mode.slice(1);

  const prompt = `Generate exactly ${question_count} questions about these projects for a ${role} interview.
Difficulty Level Mode: ${diffStr} (Make all questions strictly conform to this difficulty level).
Projects: ${projectsStr}

CRITICAL: Return ONLY a JSON object with a "questions" key containing the array of questions. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
{
  "questions": [
    {
      "id": 1,
      "related_project": "Project Name",
      "question": "How did you handle X in this project?",
      "key_points": ["technical depth", "challenges faced"],
      "difficulty": "medium"
    }
  ]
}

Generate exactly ${question_count} questions in this exact JSON object format. All ${question_count} questions must be strictly ${diffStr} level.`;

  const messages = [{ role: "system", content: prompt }];
  const response = await askAi(messages, { 
    json: true, 
    returnParsed: true, 
    temperature: 0.2,
    max_tokens: Math.max(500, question_count * 150)
  });
  return parseJsonArray(response);
}

export const generateQuestionsMaster = async (req, res) => {
  try {
    const { resume_data, target_role, test_type, difficulty_mode = "medium", question_count } = req.body;
    if (!test_type) {
      return res.status(400).json({ detail: "test_type is required." });
    }

    const count = question_count ? parseInt(question_count) : DEFAULT_COUNTS[test_type];
    let questions = [];

    if (test_type === "mcq_technical") {
      questions = await getTechnicalMCQs(resume_data, target_role, difficulty_mode, count);
    } else if (test_type === "written") {
      questions = await getWrittenQuestions(resume_data, target_role, difficulty_mode, count);
    } else if (test_type === "aptitude") {
      questions = await getAptitudeQuestions(difficulty_mode, count);
    } else if (test_type === "soft_skills") {
      questions = await getSoftSkillQuestions(target_role, difficulty_mode, count);
    } else if (test_type === "project") {
      questions = await getProjectQuestions(resume_data, target_role, difficulty_mode, count);
    } else {
      return res.status(400).json({ detail: `Invalid test_type: ${test_type}` });
    }

    const defaultTime = TIME_LIMITS[test_type] || 20 * 60;
    const defaultCount = DEFAULT_COUNTS[test_type] || 5;
    const calculatedTime = Math.round((defaultTime / defaultCount) * count);

    return res.json({
      test_type,
      questions,
      total: questions.length,
      time_limit_seconds: calculatedTime
    });
  } catch (error) {
    console.error("generateQuestionsMaster error:", error);
    return res.status(500).json({ detail: `Question generation failed: ${error.message}` });
  }
};

export const generateTechnical = async (req, res) => {
  try {
    const { resume_data, target_role, difficulty_mode = "medium" } = req.body;
    const questions = await getTechnicalMCQs(resume_data, target_role, difficulty_mode);
    return res.json({
      test_type: "mcq_technical",
      test_number: 1,
      test_name: "Technical Knowledge",
      questions,
      total: questions.length,
      time_limit_seconds: TIME_LIMITS["mcq_technical"]
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

export const generateWritten = async (req, res) => {
  try {
    const { resume_data, target_role, difficulty_mode = "medium" } = req.body;
    const questions = await getWrittenQuestions(resume_data, target_role, difficulty_mode);
    return res.json({
      test_type: "written",
      test_number: 2,
      test_name: "Knowledge Depth",
      questions,
      total: questions.length,
      time_limit_seconds: TIME_LIMITS["written"]
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

export const generateAptitude = async (req, res) => {
  try {
    const { difficulty_mode = "medium" } = req.body;
    const questions = await getAptitudeQuestions(difficulty_mode);
    return res.json({
      test_type: "aptitude",
      test_number: 3,
      test_name: "Aptitude & Reasoning",
      questions,
      total: questions.length,
      time_limit_seconds: TIME_LIMITS["aptitude"]
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

export const generateSoftskills = async (req, res) => {
  try {
    const { target_role, difficulty_mode = "medium" } = req.body;
    const questions = await getSoftSkillQuestions(target_role, difficulty_mode);
    return res.json({
      test_type: "soft_skills",
      test_number: 4,
      test_name: "Soft Skills & Communication",
      questions,
      total: questions.length,
      time_limit_seconds: TIME_LIMITS["soft_skills"]
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

export const generateProject = async (req, res) => {
  try {
    const { resume_data, target_role, difficulty_mode = "medium" } = req.body;
    const questions = await getProjectQuestions(resume_data, target_role, difficulty_mode);
    return res.json({
      test_type: "project",
      test_number: 5,
      test_name: "Project Deep Dive",
      questions,
      total: questions.length,
      skipped: questions.length === 0,
      skip_reason: questions.length === 0 ? "No projects found in resume" : null,
      time_limit_seconds: TIME_LIMITS["project"]
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};
