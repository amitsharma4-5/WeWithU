import { askAi } from "../services/groq.service.js";

function cleanText(text) {
  if (!text) return "";
  // Remove control characters
  return text
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const parseResume = async (req, res) => {
  try {
    const { resume_text, target_role } = req.body;
    if (!resume_text) {
      return res.status(400).json({ detail: "resume_text is required." });
    }

    const cleaned = cleanText(resume_text).substring(0, 4000);
    const systemPrompt = `You are a resume parser. Parse the resume and return JSON.
Target Role: ${target_role || "Software Developer"}

Return exactly this JSON format:
{
  "name": "Full Name",
  "skills": ["skill1", "skill2"],
  "projects": [{"name": "Project Name", "description": "One sentence description"}],
  "experience_level": "fresher",
  "education": "Degree Field",
  "summary": "Write 2-3 sentences about candidate in ONE LINE. No line breaks."
}

experience_level must be: fresher OR junior OR mid
If no projects, use empty array: []`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Resume Content:\n${cleaned}` }
    ];

    const parsed = await askAi(messages, { json: true, returnParsed: true, temperature: 0.1 });
    return res.json(parsed);
  } catch (error) {
    console.error("parseResume error:", error);
    return res.status(500).json({ detail: `Resume parsing failed: ${error.message}` });
  }
};

export const summarizeResume = async (req, res) => {
  // Direct delegation as they share the same schema and logic
  return parseResume(req, res);
};

export const atsCheck = async (req, res) => {
  try {
    const { resume_text, target_role } = req.body;
    if (!resume_text) {
      return res.status(400).json({ detail: "resume_text is required." });
    }

    const cleaned = cleanText(resume_text).substring(0, 4000);
    const systemPrompt = `Analyze this resume for ATS compatibility for role: ${target_role || "Software Developer"}

Return ONLY this JSON (no markdown, no extra explanation):
{
  "ats_score": 65,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["missing1", "missing2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "verdict": "Good Match"
}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Resume Content:\n${cleaned}` }
    ];

    const result = await askAi(messages, { json: true, returnParsed: true, temperature: 0.2 });
    return res.json(result);
  } catch (error) {
    console.error("atsCheck error:", error);
    return res.status(500).json({ detail: `ATS check failed: ${error.message}` });
  }
};

export const getPersonalizedGuidance = async (req, res) => {
  try {
    const { resume_text, target_role } = req.body;
    if (!resume_text) {
      return res.status(400).json({ detail: "resume_text is required." });
    }

    const cleaned = cleanText(resume_text).substring(0, 4000);
    const systemPrompt = `You are a professional career coach and expert recruiter. Analyze this resume text and generate custom preparation guidance for target role: ${target_role || "Software Developer"}.

Return ONLY this JSON format (no extra text, no markdown block wrappers):
{
  "candidateName": "Candidate's Name",
  "targetRole": "Role name",
  "summary": "2-sentence AI feedback summarizing how their profile aligns with the target role and key gaps to cover.",
  "skillsChecklist": [
    {
      "skill": "React.js",
      "status": "Ready",
      "tips": "Be ready to explain Virtual DOM, Hooks, and component lifecycle."
    }
  ],
  "projectGuidance": [
    {
      "projectName": "Stock Predictor",
      "keySellingPoints": "Focus on the ML algorithms used (LSTM/RandomForest) and the dataset size.",
      "likelyQuestions": [
        "How did you handle the time-series forecasting problem?",
        "Why did you choose this model over simpler regression?"
      ]
    }
  ],
  "customTechnicalTips": [
    {
      "title": "Master Your Core Tech Stack",
      "content": "Since you list Python and Node, expect comparative database questions, scaling, and async event loop logic."
    }
  ],
  "customHrTips": [
    {
      "title": "Telling Your Projects Story",
      "content": "Use the STAR method. Focus specifically on how you built the Stock Predictor to demonstrate initiative."
    }
  ]
}

Please return exactly this JSON. Fill it with rich details extracted from their actual resume and project names. Return 3-5 customTechnicalTips and customHrTips, and map all main skills/projects.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Resume Content:\n${cleaned}` }
    ];

    const result = await askAi(messages, { json: true, returnParsed: true, temperature: 0.3 });
    return res.json(result);
  } catch (error) {
    console.error("getPersonalizedGuidance error:", error);
    return res.status(500).json({ detail: `Failed to generate personalized guidance: ${error.message}` });
  }
};
