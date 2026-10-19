import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../utils/serverUrl";
import { toast, Toaster } from "react-hot-toast";
import { jobRoles } from "../utils/jobRoles";
import {
  BsTerminal,
  BsChatSquareText,
  BsPeople,
  BsBriefcase,
  BsCheckCircleFill,
  BsFileEarmarkPdf,
  BsSliders,
  BsJournalCheck,
  BsCardText,
  BsStars
} from "react-icons/bs";

const TABS = [
  { id: "technical",  label: "Technical Round",  icon: <BsTerminal size={18} /> },
  { id: "hr",         label: "HR Round",          icon: <BsChatSquareText size={18} /> },
  { id: "gd",         label: "Group Discussion",  icon: <BsPeople size={18} /> },
  { id: "coding",     label: "Coding Round",      icon: <BsBriefcase size={18} /> },
];

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Data Analyst",
  "Product Manager",
  "DevOps Engineer",
];

const TECHNICAL_TIPS = [
  {
    title: "Master the Fundamentals First",
    content: `Before anything else, make sure your core concepts are solid. Recruiters test fundamentals before anything else.\n\nFor Data Science / ML roles: Statistics, Probability, Linear Algebra, Python, Pandas, Scikit-learn, ML algorithms, overfitting, and bias-variance tradeoff.\n\nFor Software Engineering: OOP concepts, SOLID principles, Data Structures (Arrays, Linked Lists, Trees, Graphs, Hash Maps), and Algorithms (sorting, searching, dynamic programming).\n\nFor Web Dev / Full Stack: HTML/CSS/JS deeply, React/Node fundamentals, REST APIs, databases (SQL vs NoSQL), HTTP protocol, and authentication.`,
  },
  {
    title: "How to Answer Technical Questions",
    content: `Most candidates jump straight to the answer. Use the Think-Out-Loud method:\n\nStep 1 → Repeat the question: "So you're asking about overfitting — let me explain..."\nStep 2 → Define it clearly: Give a textbook-clean definition first.\nStep 3 → Give an analogy: "It's like a student who memorizes answers without understanding..."\nStep 4 → Give a real example: "In my prediction project, my model had 99% train accuracy but 60% test accuracy..."\nStep 5 → Mention how to solve it: "I used cross-validation and L2 regularization to fix it."`,
  },
  {
    title: "The Most Common Technical Questions (By Role)",
    content: `DATA SCIENCE / ML:\n- What is the difference between supervised and unsupervised learning?\n- Explain bias-variance tradeoff with an example.\n- When would you use Random Forest over Logistic Regression?\n- How do you handle missing data and class imbalance?\n\nSOFTWARE ENGINEERING:\n- Explain OOP concepts with real-world examples.\n- What is time complexity? Explain Big O notation.\n- Difference between stack and heap memory.\n- What is a deadlock? How do you prevent it?\n\nWEB DEVELOPMENT:\n- What is the difference between == and === in JavaScript?\n- Explain the event loop in Node.js.\n- What is the virtual DOM in React?\n- Difference between SQL and NoSQL databases.`,
  },
  {
    title: "System Design Questions (For Mid-Level)",
    content: `If you face system design questions, follow this framework:\n\n1. Clarify requirements — "Is this read-heavy or write-heavy? How many users?"\n2. Estimate scale — "1 million users, 100k requests per day"\n3. Define components — Frontend, Backend API, Database, Cache\n4. Choose tech stack — "I'd use PostgreSQL for structured data, Redis for caching"\n5. Discuss trade-offs — "SQL gives ACID compliance but NoSQL scales better horizontally"`,
  },
];

const HR_TIPS = [
  {
    title: "Tell Me About Yourself — The Perfect Answer",
    content: `This is asked in 100% of interviews. Formula (60-90 seconds):\n\n1. Who you are: "I'm a B.Tech CSE student from [college], specializing in Data Science."\n2. What you've built: "I've built 3 ML projects including a stock prediction model and healthcare diagnosis system."\n3. What you're good at: "I'm strongest in Python, machine learning, and SQL."\n4. Why you're here: "I'm targeting Data Analyst roles where I can use my skills. Your company's focus on AI-driven analytics excites me."`,
  },
  {
    title: "The STAR Method for Behavioral Questions",
    content: `HR questions like "Tell me about a challenge you faced" need the STAR method:\n\nS — Situation: Set the context briefly. "During my project, our team had 2 weeks to build a complete ML pipeline."\nT — Task: What was your specific responsibility? "I was responsible for the model training and evaluation."\nA — Action: What did YOU do? "I selected XGBoost and handled class imbalance using SMOTE."\nR — Result: What was the outcome? Use numbers. "The model achieved 91% accuracy and our project won the best project award."`,
  },
  {
    title: "Salary Negotiation for Freshers",
    content: `When asked "What are your salary expectations?":\n\nOption 1 (Safe): "I'm flexible and open to your standard fresher compensation. Based on my research, I understand it's in the range of X to Y. Is that the ballpark?"\n\nOption 2 (Confident): "Based on my skills in machine learning and the market rate, I'm looking for around X LPA. Is that achievable?"`,
  },
  {
    title: "Questions to Ask the Interviewer",
    content: `At the end of the interview, always ask questions to show interest:\n\n- "What does a typical day look like for someone in this role?"\n- "What projects would I be working on in the first 3 months?"\n- "What learning and development opportunities does the company offer?"\n- "How is the team structured?"`,
  },
];

const GD_TIPS = [
  {
    title: "What Evaluators Look For in GD",
    content: `Group Discussions are not about who talks the most. Evaluators watch for:\n\n1. Communication Clarity — Express ideas concisely.\n2. Listening Skills — Acknowledge others' points before countering.\n3. Leadership — Bring structure to a chaotic discussion.\n4. Team Player — Let others speak and summarize key themes.`,
  },
  {
    title: "How to Start the GD (First Mover Advantage)",
    content: `Speaking first gives you visibility. But only if you start well:\n\n"The topic today is [X]. I'd like to begin by defining the scope — [definition]. From my perspective, [your opening point with a fact or statistic]."\n\nIf you don't start first, don't panic. Listen to the first speakers and enter with: "Building on what [name] said about X, I'd like to add..."`,
  },
  {
    title: "Handling Aggressive Participants",
    content: `Do not match aggressive energy. Use these strategies:\n\nStrategy 1 — The Calm Counter: "That's an interesting point. However, the data suggests a different perspective..."\nStrategy 2 — The Bridge: "I hear your point about X. If we also consider Y, we get a more complete picture..."\nStrategy 3 — Bring others in: "We've heard strong views. I'd like to hear what others think before we conclude."`,
  },
];

const CODING_TIPS = [
  {
    title: "How to Approach a Coding Problem",
    content: `Use this 5-step approach:\n\nStep 1 — Understand (2 mins): Read twice. Ask clarifying questions on edge cases.\nStep 2 — Examples (1 min): Write 2-3 test cases on a board.\nStep 3 — Plan (2 mins): State time and space complexity before coding.\nStep 4 — Code (10-15 mins): Write clean, readable code and talk while coding.\nStep 5 — Test & Optimize (3 mins): Test with your edge cases.`,
  },
  {
    title: "Must-Know Data Structures",
    content: `- Arrays & Strings (Two pointers, sliding window)\n- Linked Lists (Cycle detection, reverse)\n- Trees & Graphs (BFS, DFS)\n- Hash Maps (Frequency count, cache)\n- Stacks & Queues (Valid parentheses, monotonic stack)`,
  },
  {
    title: "Time and Space Complexity — Quick Reference",
    content: `O(1) — Constant (Hash map lookup)\nO(log n) — Logarithmic (Binary search)\nO(n) — Linear (Single loop)\nO(n log n) — Linearithmic (Merge sort)\nO(n²) — Quadratic (Nested loops)\n\nAlways analyze and state complexity explicitly during coding interviews.`,
  },
];

const DOS_DONTS = {
  technical: {
    dos: [
      "Think out loud while solving problems",
      "Define the concept before explaining",
      "Use real project examples to answer",
      "State time and space complexity",
    ],
    donts: [
      "Don't say 'I don't know' and go silent",
      "Don't memorize answers — understand them",
      "Don't lie about skills on your resume",
      "Don't use jargon you can't explain",
    ]
  },
  hr: {
    dos: [
      "Prepare and practice answers out loud",
      "Use the STAR method for behavioral questions",
      "Ask thoughtful questions at the end",
      "Research the company before the interview",
    ],
    donts: [
      "Don't badmouth previous employers",
      "Don't say your weakness is 'I work too hard'",
      "Don't ask about salary in round 1",
      "Don't check your phone during the interview",
    ]
  },
  gd: {
    dos: [
      "Listen actively before speaking",
      "Support points with facts and data",
      "Acknowledge others' views before countering",
      "Volunteer to summarize at the end",
    ],
    donts: [
      "Don't dominate — let others speak",
      "Don't go off-topic",
      "Don't use aggressive language",
      "Don't interrupt others mid-sentence",
    ]
  },
  coding: {
    dos: [
      "Clarify the problem before coding",
      "State your approach before writing code",
      "Write clean, readable code",
      "Test with edge cases after coding",
    ],
    donts: [
      "Don't start coding without understanding",
      "Don't write unreadable code",
      "Don't forget edge cases",
      "Don't ignore the interviewer's hints",
    ]
  }
};

const CHECKLIST = [
  "Research the company — product, recent news, tech stack",
  "Re-read your own resume — know every line of it",
  "Prepare 3 stories using the STAR method",
  "Practice 'Tell me about yourself' out loud 5 times",
  "Know your projects deeply — every technical decision",
  "Charge your laptop and test audio/video (for online)",
  "Keep resume printouts ready (for offline)",
  "Sleep 7-8 hours before interview day",
  "Reach the venue 15 minutes early (or log in 5 mins early)",
  "Carry a notebook and pen",
  "Have a glass of water nearby",
  "Wear professional clothes",
];

// Helper to load PDF.js from CDN
function loadPDFJSFromCDN() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });
}

// Helper to extract text client side
async function extractPDFText(file) {
  if (!window.pdfjsLib) {
    await loadPDFJSFromCDN();
  }

  const pdfjsLib = window.pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function Guidance() {
  const [mainTab, setMainTab] = useState("ai-guidance"); // "ai-guidance" or "general"
  const [activeTab, setActiveTab] = useState("technical"); // General round tab
  const [openAccordion, setOpenAccordion] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [parsing, setParsing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Autocomplete Target Roles State
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const roleInputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (roleInputRef.current && !roleInputRef.current.contains(event.target)) {
        setShowRoleSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleRoleChange = (val) => {
    setTargetRole(val);
    if (val.length > 0) {
      const filtered = jobRoles.filter((r) =>
        r.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredRoles(filtered.slice(0, 8));
      setShowRoleSuggestions(true);
    } else {
      setFilteredRoles([]);
      setShowRoleSuggestions(false);
    }
  };
  const [aiReport, setAiReport] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.");
      return;
    }

    setParsing(true);
    try {
      const text = await extractPDFText(file);
      setResumeText(text);
      toast.success("Resume parsed successfully! Ready for AI guidance.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract text. You can paste resume details manually.");
    } finally {
      setParsing(false);
    }
  };

  const fetchAiGuidance = async () => {
    if (!resumeText.trim()) {
      toast.error("Please paste your resume details or upload a PDF first.");
      return;
    }

    setAiLoading(true);
    setAiReport(null);
    try {
      const response = await axios.post(
        ServerUrl + "/api/resume/guidance",
        {
          resume_text: resumeText,
          target_role: targetRole,
        },
        { withCredentials: true }
      );
      setAiReport(response.data);
      toast.success("Custom guidance compiled successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to generate personalized guidance.");
    } finally {
      setAiLoading(false);
    }
  };

  const tips =
    activeTab === "technical" ? TECHNICAL_TIPS :
    activeTab === "hr"        ? HR_TIPS        :
    activeTab === "gd"        ? GD_TIPS        : CODING_TIPS;

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = (checkedCount / CHECKLIST.length) * 100;

  return (
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
      <Toaster />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="p-3 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition text-gray-600 dark:text-gray-300 cursor-pointer flex-shrink-0 mt-1"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-base" />
          </button>
          <div>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              AI Placement Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Interview Guidance & Prep Planner</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mt-1.5">
              Optimize your preparation with expert strategy guides and dynamic, resume-mapped AI counseling templates.
            </p>
          </div>
        </div>

        {/* Core Mode Switcher */}
        <div className="flex flex-col sm:flex-row bg-white dark:bg-[#111827]/70 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm gap-2 mb-10 transition-colors duration-200">
          <button
            onClick={() => setMainTab("ai-guidance")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mainTab === "ai-guidance"
                ? "bg-black dark:bg-emerald-600 text-white"
                : "text-gray-550 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <BsStars className={mainTab === "ai-guidance" ? "text-emerald-400" : "text-gray-400"} />
            Resume-Based AI Guidance (Personalized)
          </button>
          <button
            onClick={() => setMainTab("general")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              mainTab === "general"
                ? "bg-black dark:bg-emerald-600 text-white"
                : "text-gray-550 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <BsCardText className={mainTab === "general" ? "text-emerald-400" : "text-gray-400"} />
            Standard Round Playbook
          </button>
        </div>

        {/* TAB 1: AI GUIDANCE */}
        {mainTab === "ai-guidance" && (
          <div className="space-y-10">
            {/* Action Box */}
            <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 transition-all duration-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-lg">🎯</span> Tailor Guidance to Your Actual Resume
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Upload your CV or copy/paste details. We will analyze your skills and projects and construct structured examples mapping to the role.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition select-none ${
                    parsing
                      ? "border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20"
                      : "border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/10"
                  }`}
                >
                  <div className="text-3xl mb-2">📄</div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm text-center">
                    {parsing ? "Parsing your PDF resume..." : "Upload Resume PDF"}
                  </h4>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 text-center">Click to select files, PDF only</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Paste Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Or Paste Resume Text / Skill List
                  </label>
                  <textarea
                    className="flex-1 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-gray-100 min-h-[100px]"
                    placeholder="E.g. Amit Kumar Sharma, Web Developer. Projects: wewithyou, Stock Trading. Skills: React, Node, Python, SQL..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>
              </div>

              {/* Target & Submit Row */}
              <div className="flex flex-wrap md:flex-nowrap gap-4 items-end pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex-1 min-w-[200px] space-y-1.5 relative" ref={roleInputRef}>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
                    Target Hiring Role
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search job role..."
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-semibold dark:text-gray-100"
                      value={targetRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      onFocus={() => {
                        const val = targetRole || "";
                        const filtered = jobRoles.filter((r) =>
                          r.toLowerCase().includes(val.toLowerCase())
                        );
                        setFilteredRoles(filtered.slice(0, 8));
                        setShowRoleSuggestions(true);
                      }}
                    />
                    {showRoleSuggestions && filteredRoles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute w-full mt-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto"
                      >
                        {filteredRoles.map((r, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setTargetRole(r);
                              setShowRoleSuggestions(false);
                            }}
                            className="px-4 py-2.5 hover:bg-green-50 dark:hover:bg-emerald-900/30 hover:text-green-700 dark:hover:text-emerald-300 cursor-pointer transition text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-750/30 last:border-none"
                          >
                            {r}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
                <button
                  onClick={fetchAiGuidance}
                  disabled={aiLoading || !resumeText.trim()}
                  className="bg-black dark:bg-emerald-600 text-white hover:opacity-90 font-bold py-3 px-8 rounded-xl text-sm transition cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {aiLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Generate Dynamic Career Guide
                </button>
              </div>
            </div>

            {/* AI Report Card */}
            {aiReport ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Dashboard Summary banner */}
                <div className="bg-gradient-to-br from-gray-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-lg">
                  <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Dynamic Feedback Profile
                  </span>
                  <h2 className="text-2xl font-black mt-4 mb-2">
                    {aiReport.candidateName} — Candidate Preparation Profile
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mt-1">
                    {aiReport.summary}
                  </p>
                </div>

                {/* Skills Checklist & Project maps */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Skills Section */}
                  <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-md font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                      🛠️ Personalized Skills Checklist & Tips
                    </h3>
                    <div className="space-y-4">
                      {aiReport.skillsChecklist?.map((sc, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 rounded-xl p-4 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{sc.skill}</span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              sc.status?.toLowerCase().includes("ready")
                                ? "bg-green-50 dark:bg-emerald-950/20 text-green-700 dark:text-emerald-400 border-green-200 dark:border-emerald-900/30"
                                : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
                            }`}>
                              {sc.status || "Need Review"}
                            </span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{sc.tips}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project specific guide */}
                  <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-md font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                      📁 Project Walkthrough Guide (STAR mapping)
                    </h3>
                    <div className="space-y-6">
                      {aiReport.projectGuidance?.map((proj, idx) => (
                        <div key={idx} className="space-y-3">
                          <div>
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Project {idx + 1}</span>
                            <h4 className="font-black text-gray-800 dark:text-gray-200 text-sm">{proj.projectName}</h4>
                          </div>
                          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 text-xs text-emerald-805 dark:text-emerald-400">
                            <strong>Key Selling Point:</strong> {proj.keySellingPoints}
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Likely Interview Questions</span>
                            <ul className="space-y-1.5">
                              {proj.likelyQuestions?.map((q, qidx) => (
                                <li key={qidx} className="text-xs text-gray-600 dark:text-gray-300 flex gap-2 items-start leading-relaxed">
                                  <span className="text-emerald-500">❓</span>
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Tech & HR tips */}
                <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 transition-colors duration-200">
                  <h3 className="text-md font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                    🎯 Personalized Round Prep Blueprints
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Tech Round tips */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-xs text-gray-400 dark:text-gray-550 uppercase tracking-wider">Technical Prep Plan</h4>
                      {aiReport.customTechnicalTips?.map((tip, i) => (
                        <div key={i} className="border-l-4 border-emerald-500 pl-4 py-1">
                          <h5 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{tip.title}</h5>
                          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{tip.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* HR Round tips */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-xs text-gray-400 dark:text-gray-550 uppercase tracking-wider">Behavioral/HR Prep Plan</h4>
                      {aiReport.customHrTips?.map((tip, i) => (
                        <div key={i} className="border-l-4 border-emerald-500 pl-4 py-1">
                          <h5 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{tip.title}</h5>
                          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action triggers */}
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <button
                    onClick={() => navigate("/placement-test")}
                    className="bg-black dark:bg-emerald-600 text-white hover:opacity-90 font-bold py-3 px-8 rounded-full text-xs shadow-md transition cursor-pointer"
                  >
                    Test Skills in Placement Exam 🚀
                  </button>
                  <button
                    onClick={() => {
                      setResumeText("");
                      setAiReport(null);
                    }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold py-3 px-8 rounded-full text-xs transition cursor-pointer"
                  >
                    Analyze New Resume
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Demo Placeholder matching user profile */
              <div className="bg-emerald-50/50 dark:bg-[#111827]/50 border border-emerald-100 dark:border-gray-800 rounded-3xl p-6 text-center space-y-4 transition-colors duration-200">
                <div className="text-4xl">🚀</div>
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Dynamic Resume Coaching Ready</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
                  Upload your resume above to extract skills and project names automatically. Our system will generate personalized templates showing you exactly how to frame your answers and highlight metrics.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GENERAL ROUND PLAYBOOK */}
        {mainTab === "general" && (
          <div className="space-y-10">
            {/* Playbook Intro banner */}
            <div className="relative bg-gradient-to-br from-gray-900 to-green-950 text-white rounded-3xl p-8 shadow-lg overflow-hidden">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">
                💡
              </div>
              <div className="relative z-10 max-w-2xl">
                <span className="bg-green-500/20 text-green-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
                  Playbook Guides
                </span>
                <h2 className="text-2xl font-bold mb-3">Structured Preparation is Key</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Select the tabs below to read common interview patterns, communication matrices, STAR storytelling formats, and algorithmic references.
                </p>
              </div>
            </div>

            {/* Rounds switcher */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-[#111827]/70 p-2 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm transition-colors duration-200">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setOpenAccordion(null); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition flex-1 justify-center md:flex-initial cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-green-100 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Accordions */}
            <div className="space-y-4">
              {tips.map((tip, i) => (
                <div key={i} className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        openAccordion === i ? "bg-green-100 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}>
                        {i + 1}
                      </span>
                      <span>{tip.title}</span>
                    </div>
                    <span className={`text-xs text-gray-400 transition-transform duration-200 ${openAccordion === i ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>

                  {openAccordion === i && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {tip.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Dos and Donts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Dos */}
              <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 shadow-sm transition-colors duration-200">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <span className="text-green-600">✅</span> Do's
                </h3>
                <ul className="space-y-3">
                  {DOS_DONTS[activeTab].dos.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed items-start">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Donts */}
              <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 shadow-sm transition-colors duration-200">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span> Don'ts
                </h3>
                <ul className="space-y-3">
                  {DOS_DONTS[activeTab].donts.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed items-start">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pre-Interview Checklist */}
            <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">📋 Pre-Interview Day Checklist</h3>
                  <p className="text-gray-400 dark:text-gray-550 text-sm mt-1">Cross off items as you complete your day-before preparation.</p>
                </div>
                <span className="text-xl font-extrabold text-green-600 dark:text-emerald-400">
                  {checkedCount}/{CHECKLIST.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-8 overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="bg-green-500 h-full rounded-full transition-all duration-300"
                />
              </div>

              {/* Checklist Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {CHECKLIST.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex gap-3 items-center p-3 rounded-xl border cursor-pointer select-none transition ${
                      checkedItems[idx]
                        ? "bg-green-50/50 dark:bg-emerald-950/10 border-green-200 dark:border-emerald-900/30 text-gray-400 dark:text-gray-550 line-through"
                        : "bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs flex-shrink-0 transition ${
                      checkedItems[idx]
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 dark:border-gray-700"
                    }`}>
                      {checkedItems[idx] && "✓"}
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {checkedCount === CHECKLIST.length && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 bg-green-50 dark:bg-emerald-950/20 border border-green-200 dark:border-emerald-900/30 rounded-xl p-4 text-center text-green-700 dark:text-green-300 font-bold"
                >
                  🎉 Outstanding! You are fully prepared. Go ace that interview!
                </motion.div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
