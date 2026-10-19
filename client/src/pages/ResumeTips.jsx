import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { ServerUrl } from "../utils/serverUrl";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "motion/react";
import { toast, Toaster } from "react-hot-toast";
import { BsFileEarmarkPdf, BsCheckCircle, BsXCircle, BsLightbulb, BsSliders, BsJournalCheck, BsLock } from "react-icons/bs";
import { jobRoles } from "../utils/jobRoles";

const COMPARISONS = [
  {
    category: "Work Experience",
    good: "Developed a machine learning model using Python and Scikit-learn that improved customer churn prediction accuracy by 23%, reducing revenue loss by ₹12L annually.",
    bad: "Worked on machine learning project. Used Python. Got good results.",
    tip: "Always quantify your achievements. Numbers make your impact real to recruiters.",
  },
  {
    category: "Skills Section",
    good: "Python (NumPy, Pandas, Scikit-learn), SQL (PostgreSQL, MySQL), Machine Learning, Deep Learning (TensorFlow), Data Visualization (Matplotlib, Seaborn, Tableau)",
    bad: "Python, SQL, Machine Learning, Good Communication, Team Player, MS Office",
    tip: "List specific tools and libraries. Remove generic soft skills from the skills section.",
  },
  {
    category: "Project Description",
    good: "Stock Price Prediction | Python, LSTM, yfinance | GitHub Link\nBuilt a time-series forecasting model using LSTM networks to predict NIFTY 50 closing prices. Achieved 87% directional accuracy on test data. Deployed as a Flask API.",
    bad: "Stock Prediction Project\nMade a project to predict stock prices using machine learning. It worked well.",
    tip: "Include tech stack, measurable results, and a GitHub link for every project.",
  },
  {
    category: "Summary / Objective",
    good: "Final year B.Tech CSE student specializing in Data Science with hands-on experience in ML, Python, and SQL. Built 3 end-to-end ML projects. Seeking a Data Analyst role where I can apply my skills to drive business insights.",
    bad: "I am a hardworking student who wants to work in a good company and learn new things and grow my career.",
    tip: "Be specific. Mention your specialization, what you've built, and what role you want.",
  },
];

const ATS_TIPS = [
  {
    icon: "🔍",
    title: "Use Keywords from Job Description",
    desc: "Copy exact words from the job posting. ATS systems scan for exact keyword matches. If JD says 'data analysis', your resume should say 'data analysis' — not 'data analytics'.",
  },
  {
    icon: "📝",
    title: "Use Standard Section Headings",
    desc: "Use headings like 'Work Experience', 'Education', 'Skills', 'Projects'. Avoid creative names like 'My Journey' or 'What I've Done' — ATS won't recognize them.",
  },
  {
    icon: "🚫",
    title: "No Tables, Columns or Images",
    desc: "ATS cannot read text inside tables, multi-column layouts or images. Use a single-column, plain text format to ensure 100% readability by ATS systems.",
  },
  {
    icon: "📄",
    title: "Save as PDF but Check Job Post",
    desc: "Most companies accept PDF. But some older ATS systems prefer .docx. Always check the job description. When in doubt — submit PDF.",
  },
  {
    icon: "📏",
    title: "Keep it 1 Page (Freshers)",
    desc: "Freshers should stick to 1 page. Recruiters spend 6 seconds on a resume. More pages = more chances of important content being missed.",
  },
  {
    icon: "✍️",
    title: "Use Action Verbs",
    desc: "Start bullet points with action verbs: Developed, Built, Designed, Implemented, Improved, Analyzed, Deployed. Never start with 'Responsible for' or 'Worked on'.",
  },
];

const CHECKLIST = [
  { id: 1,  text: "Contact info is correct (email, phone, LinkedIn, GitHub)" },
  { id: 2,  text: "Resume is exactly 1 page (for freshers)" },
  { id: 3,  text: "No spelling or grammar mistakes" },
  { id: 4,  text: "Used action verbs for all bullet points" },
  { id: 5,  text: "Every project has tech stack + GitHub link" },
  { id: 6,  text: "Quantified at least 2-3 achievements with numbers" },
  { id: 7,  text: "Skills section has specific tools, not generic terms" },
  { id: 8,  text: "No tables, columns or images (ATS-friendly)" },
  { id: 9,  text: "Font is clean and readable (Inter, Calibri, Arial)" },
  { id: 10, text: "Saved as PDF" },
  { id: 11, text: "Tailored to the specific job description" },
  { id: 12, text: "Education section has CGPA if above 7.0" },
];

const RECRUITER_SECRETS = [
  { icon: "⏱️", title: "6 Second Rule",       desc: "Recruiters spend only 6 seconds on your resume. Put your strongest points — skills and projects — in the top half of the page." },
  { icon: "👁️", title: "They Scan, Not Read", desc: "Recruiters don't read line by line. They scan for keywords, numbers, and company/project names. Use bold for key terms." },
  { icon: "📊", title: "Numbers Stand Out",   desc: "Specific numbers jump out during scanning. '23% improvement' is remembered. 'Significant improvement' is forgotten immediately." },
  { icon: "🔗", title: "GitHub is Important", desc: "For tech roles, a GitHub profile with active projects is sometimes more valuable than your resume. Keep it updated." },
  { icon: "📋", title: "ATS Before Human",    desc: "In 90% of companies, your resume is first scanned by ATS software. If it fails ATS — no human ever sees it." },
  { icon: "🎯", title: "Tailoring Matters",   desc: "A tailored resume gets 3x more responses than a generic one. Spend 15 minutes customizing for each application." },
];

const ROLES = [
  "Data Scientist", "Machine Learning Engineer", "Software Engineer",
  "Data Analyst", "Backend Developer", "Full Stack Developer",
  "Frontend Developer", "Product Manager", "DevOps Engineer",
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

export default function ResumeTips() {
  const [activeTab, setActiveTab] = useState("tips");
  const [checkedItems, setCheckedItems] = useState({});
  const [atsText, setAtsText] = useState("");
  const [atsRole, setAtsRole] = useState("Software Engineer");
  const [atsResult, setAtsResult] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileRef = useRef(null);

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
    setAtsRole(val);
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
  const navigate = useNavigate();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setUploadStatus("parsing");
    try {
      const text = await extractPDFText(file);
      setAtsText(text);
      setUploadStatus("done");
      toast.success("PDF parsed successfully!");
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
      toast.error("Failed to parse PDF text. Please copy/paste manually.");
    }
  };

  const runATSCheck = async () => {
    if (!atsText.trim()) {
      toast.error("Please paste your resume text or upload a PDF first.");
      return;
    }

    setAtsLoading(true);
    setAtsResult(null);

    try {
      const response = await axios.post(
        ServerUrl + "/api/resume/ats-check",
        {
          resume_text: atsText,
          target_role: atsRole,
        },
        { withCredentials: true }
      );
      setAtsResult(response.data);
      toast.success("ATS Check Completed!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "ATS check failed.");
    } finally {
      setAtsLoading(false);
    }
  };

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = (checkedCount / CHECKLIST.length) * 100;

  const atsScoreColor =
    !atsResult
      ? "text-emerald-500"
      : atsResult.ats_score >= 75
      ? "text-green-600 bg-green-50 border-green-200"
      : atsResult.ats_score >= 50
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
      <Toaster />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex items-start gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="p-3 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition text-gray-600 dark:text-gray-300 cursor-pointer flex-shrink-0 mt-1"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-base" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Resume Tips & ATS Checker</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Everything you need to build a resume that gets past ATS and impresses recruiters.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-[#111827]/70 p-2 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm transition-colors duration-200">
          {[
            { id: "tips", label: "Resume Tips", icon: <BsLightbulb size={16} /> },
            { id: "compare", label: "Good vs Bad", icon: <BsSliders size={16} /> },
            { id: "ats", label: "ATS Checker", icon: <BsFileEarmarkPdf size={16} /> },
            { id: "checklist", label: "Checklist", icon: <BsJournalCheck size={16} /> },
            { id: "secrets", label: "Recruiter View", icon: <BsLock size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition flex-1 justify-center md:flex-initial cursor-pointer ${
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

        {/* Content Tabs */}
        {activeTab === "tips" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-900 to-green-950 text-white rounded-3xl p-8 flex items-center gap-6 shadow-md">
              <div className="text-5xl">📄</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Your Resume = Your First Impression</h3>
                <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                  A recruiter spends 6 seconds on your resume. In those 6 seconds, they decide if you move forward or not. Make every word count.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {ATS_TIPS.map((tip, i) => (
                <div key={i} className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition duration-300">
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{tip.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 md:p-8 shadow-sm mt-8 transition-colors duration-200">
              <h3 className="text-lg font-bold mb-4 dark:text-white">📏 1 Page vs 2 Page — The Rule</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-emerald-950/20 border border-green-200 dark:border-green-900/30 rounded-2xl p-5">
                  <h4 className="font-bold text-green-700 dark:text-green-400 mb-3">✅ 1 Page — Recommended for Freshers</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li>0–3 years of experience</li>
                    <li>Forces you to include only the highest impact details</li>
                    <li>Easier to scan in under 10 seconds</li>
                    <li>Standard target format for recruitment fairs</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/60 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-500 dark:text-gray-400 mb-3">📄 2 Pages — Senior Candidates Only</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li>5+ years of relevant experience</li>
                    <li>Multiple full-time positions with deep histories</li>
                    <li>Contains academic publications/patents</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "compare" && (
          <div className="space-y-6">
            {COMPARISONS.map((comp, i) => (
              <div key={i} className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 shadow-sm transition-colors duration-200">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-850 pb-3 mb-4 flex items-center gap-2">
                  📌 {comp.category}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50/50 dark:bg-emerald-950/20 border border-green-200 dark:border-green-900/30 rounded-2xl p-5">
                    <div className="font-bold text-green-700 dark:text-green-400 mb-2">✅ Impactful Version</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-mono leading-relaxed">{comp.good}</p>
                  </div>
                  <div className="bg-red-50/30 dark:bg-rose-950/10 border border-red-100 dark:border-rose-900/20 rounded-2xl p-5">
                    <div className="font-bold text-red-600 dark:text-red-400 mb-2">❌ Basic Version</div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm font-mono leading-relaxed">{comp.bad}</p>
                  </div>
                </div>
                <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 rounded-xl p-3 text-xs flex gap-2 items-center">
                  <span>💡</span>
                  <span><strong>Tip:</strong> {comp.tip}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ats" && (
          <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 transition-all duration-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">🤖 AI-Powered ATS Score Checker</h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Upload your PDF resume or paste its text. We'll run a simulated ATS analysis against your target role.
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition select-none ${
                uploadStatus === "parsing"
                  ? "border-amber-400 bg-amber-50/30 dark:bg-amber-950/20 text-amber-700"
                  : uploadStatus === "done"
                  ? "border-green-400 bg-green-50/20 dark:bg-emerald-950/20 text-green-700"
                  : "border-gray-300 dark:border-gray-700 hover:border-green-400 hover:bg-green-50/10 dark:hover:bg-green-950/10"
              }`}
            >
              {uploadStatus === "idle" && (
                <>
                  <div className="text-4xl text-gray-300 dark:text-gray-600 mb-3">📁</div>
                  <h4 className="font-bold text-gray-750 dark:text-gray-200 text-center">Click to upload your Resume PDF</h4>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">PDF format only, under 5MB</p>
                </>
              )}
              {uploadStatus === "parsing" && (
                <>
                  <div className="text-4xl text-amber-500 animate-spin mb-3">⌛</div>
                  <h4 className="font-bold text-amber-700 dark:text-amber-400">Extracting text from your PDF...</h4>
                </>
              )}
              {uploadStatus === "done" && (
                <>
                  <div className="text-4xl text-green-500 mb-3">✅</div>
                  <h4 className="font-bold text-green-700 dark:text-green-400 text-center">Text extracted successfully!</h4>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Click to upload a different PDF</p>
                </>
              )}
              {uploadStatus === "error" && (
                <>
                  <div className="text-4xl text-red-500 mb-3">❌</div>
                  <h4 className="font-bold text-red-700 dark:text-red-400">Parsing failed. Try again or paste manually below.</h4>
                </>
              )}

              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Manual Textbox */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Resume Content</label>
              <textarea
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent dark:text-gray-100"
                style={{ minHeight: "200px" }}
                placeholder="Paste your plain resume text here if you didn't upload a PDF..."
                value={atsText}
                onChange={(e) => setAtsText(e.target.value)}
              />
            </div>

            {/* Target Role Selector */}
            <div className="grid md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2 relative" ref={roleInputRef}>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Target Role</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search job role..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent dark:text-gray-100 font-semibold"
                    value={atsRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    onFocus={() => {
                      const val = atsRole || "";
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
                            setAtsRole(r);
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
                onClick={runATSCheck}
                disabled={atsLoading || !atsText.trim()}
                className="w-full bg-black dark:bg-emerald-600 text-white hover:opacity-95 font-semibold py-3 px-6 rounded-full text-sm transition disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed cursor-pointer"
              >
                {atsLoading ? "Checking with AI..." : "Check ATS Compatibility →"}
              </button>
            </div>

            {/* ATS Result Report */}
            {atsResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 mt-8 bg-gray-50/20 dark:bg-[#111827]/40 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-5xl font-extrabold text-green-600 dark:text-emerald-400 mb-1">{atsResult.ats_score}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">ATS Score</div>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-3 py-1 border rounded-full ${atsScoreColor}`}>
                        {atsResult.verdict}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div
                        style={{ width: `${atsResult.ats_score}%` }}
                        className="bg-green-500 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Matched Keywords */}
                  <div className="space-y-3 bg-green-50/20 dark:bg-emerald-950/10 border border-green-100 dark:border-emerald-900/30 p-4 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-emerald-400">
                      ✓ Matched Keywords ({atsResult.matched_keywords?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.matched_keywords?.map((kw, i) => (
                        <span key={i} className="bg-green-100 dark:bg-emerald-900/40 text-green-700 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-md font-semibold border border-green-200 dark:border-emerald-800/40">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="space-y-3 bg-red-50/20 dark:bg-rose-950/10 border border-red-100 dark:border-rose-900/20 p-4 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                      ✗ Missing Keywords ({atsResult.missing_keywords?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {atsResult.missing_keywords?.map((kw, i) => (
                        <span key={i} className="bg-red-100/50 dark:bg-rose-900/40 text-red-700 dark:text-red-400 text-xs px-2.5 py-1 rounded-md font-semibold border border-red-200 dark:border-rose-800/40">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions list */}
                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                    💡 Improvement Suggestions
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {atsResult.suggestions?.map((s, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">📋 Pre-Submission Checklist</h3>
                  <p className="text-gray-400 dark:text-gray-550 text-sm mt-1">Cross off checklist items before sending your resume.</p>
                </div>
                <span className="text-xl font-extrabold text-green-600 dark:text-emerald-400">
                  {checkedCount}/{CHECKLIST.length}
                </span>
              </div>

              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-8 overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="bg-green-500 h-full rounded-full transition-all duration-300"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {CHECKLIST.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex gap-3 items-center p-3 rounded-xl border cursor-pointer select-none transition ${
                      checkedItems[item.id]
                        ? "bg-green-50/50 dark:bg-emerald-950/10 border-green-200 dark:border-emerald-900/30 text-gray-400 dark:text-gray-550 line-through"
                        : "bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs flex-shrink-0 transition ${
                      checkedItems[item.id]
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 dark:border-gray-700"
                    }`}>
                      {checkedItems[item.id] && "✓"}
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "secrets" && (
          <div className="grid md:grid-cols-2 gap-6">
            {RECRUITER_SECRETS.map((secret, i) => (
              <div key={i} className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-2xl p-6 shadow-sm flex gap-4 items-start hover:-translate-y-1 hover:shadow-md transition duration-300 transition-colors">
                <div className="text-3xl p-3 bg-green-50 dark:bg-emerald-950/20 text-green-700 dark:text-emerald-400 rounded-xl flex-shrink-0">{secret.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-md mb-2">{secret.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{secret.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
