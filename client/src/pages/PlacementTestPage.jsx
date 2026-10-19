import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import axios from "axios";
import { ServerUrl } from "../utils/serverUrl";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { toast, Toaster } from "react-hot-toast";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";
import { BsArrowRight, BsClockHistory, BsUpload, BsCheckCircle, BsExclamationTriangle } from "react-icons/bs";
import { jobRoles } from "../utils/jobRoles";

const TESTS = [
  { id: 1, key: "mcq_technical", name: "Technical MCQs",    icon: "💻", desc: "12 multiple choice questions",       time: 25 * 60 },
  { id: 2, key: "written",       name: "Written Answers",   icon: "✍️", desc: "4 detailed written questions",      time: 30 * 60 },
  { id: 3, key: "aptitude",      name: "Aptitude Test",     icon: "🧠", desc: "10 logical reasoning questions",    time: 20 * 60 },
  { id: 4, key: "soft_skills",   name: "Soft Skills",       icon: "🤝", desc: "5 scenario-based HR questions",     time: 20 * 60 },
  { id: 5, key: "project",       name: "Project Deep Dive", icon: "🚀", desc: "4 questions about your projects",   time: 15 * 60 },
];

const ROLES = [
  "Data Scientist", "Machine Learning Engineer", "Software Engineer",
  "Data Analyst", "Backend Developer", "Full Stack Developer",
  "Frontend Developer", "Product Manager", "DevOps Engineer",
];

const LEVELS = [
  { value: "fresher", label: "Fresher (0–1 yr)" },
  { value: "junior",  label: "Junior (1–3 yrs)" },
  { value: "mid",     label: "Mid-level (3–5 yrs)" },
];

const MODES = [
  { value: "easy",   label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard",   label: "Hard" },
  { value: "expert", label: "Expert / Advanced" },
];

// Helper to normalize options from AI response
function normalizeOptions(options) {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((opt, idx) => {
      if (typeof opt === "string") {
        const match = opt.match(/^([A-D])\s*[\).\s-]\s*(.*)$/i);
        if (match) {
          return { label: match[1].toUpperCase(), text: match[2] };
        }
        const label = String.fromCharCode(65 + idx);
        return { label, text: opt };
      }
      if (opt && typeof opt === "object") {
        return {
          label: opt.label || opt.key || String.fromCharCode(65 + idx),
          text: opt.text || opt.value || opt.option || ""
        };
      }
      return { label: String.fromCharCode(65 + idx), text: String(opt) };
    });
  }
  if (typeof options === "object") {
    return Object.entries(options).map(([key, val]) => ({
      label: key.toUpperCase(),
      text: String(val)
    }));
  }
  return [];
}

// Helper to check if chosen option is correct
function isCorrectAnswer(opt, question) {
  if (!question || !opt) return false;
  const correct = question.correct_answer || question.correctOption || "";
  const correctUpper = String(correct).toUpperCase().trim();
  const labelUpper = String(opt.label).toUpperCase().trim();
  
  if (labelUpper === correctUpper) return true;
  
  if (opt.text && String(opt.text).trim().toLowerCase() === String(correct).trim().toLowerCase()) {
    return true;
  }
  
  return false;
}

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

export default function PlacementTestPage() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Autocomplete Target Roles State
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const roleInputRef = useRef(null);

  // Custom Dropdowns State & Refs
  const expDropdownRef = useRef(null);
  const diffDropdownRef = useRef(null);
  const [showExpDropdown, setShowExpDropdown] = useState(false);
  const [showDiffDropdown, setShowDiffDropdown] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (roleInputRef.current && !roleInputRef.current.contains(event.target)) {
        setShowRoleSuggestions(false);
      }
      if (expDropdownRef.current && !expDropdownRef.current.contains(event.target)) {
        setShowExpDropdown(false);
      }
      if (diffDropdownRef.current && !diffDropdownRef.current.contains(event.target)) {
        setShowDiffDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleRoleChange = (val) => {
    setForm((prev) => ({ ...prev, role: val }));
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

  // ── Local UI state ─────────────────────────────────
  const [step, setStep] = useState("upload"); // upload → summary → test
  const [form, setForm] = useState({
    name: userData?.name || "",
    role: "Software Engineer",
    level: "fresher",
    mode: "medium",
  });

  const [resumeText, setResumeText] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle | parsing | done | error

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const [questionCounts, setQuestionCounts] = useState({
    1: 12,
    2: 4,
    3: 10,
    4: 5,
    5: 4,
  });
  const [testDuration, setTestDuration] = useState(1200);

  const [currentTest, setCurrentTest] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [testAnswers, setTestAnswers] = useState([]);
  const [mcqDetails, setMcqDetails] = useState([]);
  const [testScores, setTestScores] = useState([]);
  const [allStrengths, setAllStrengths] = useState([]);
  const [allWeaknesses, setAllWeaknesses] = useState([]);

  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingPath, setPendingPath] = useState("");
  const [activeTestId, setActiveTestId] = useState(null);

  useEffect(() => {
    if (step === "test") {
      window.isTestInProgress = true;
      
      // Push dummy state to handle browser back button
      window.history.pushState(null, null, window.location.pathname);

      const handlePopState = () => {
        // Prevent browser navigation and show custom modal
        window.history.pushState(null, null, window.location.pathname);
        setPendingPath("/");
        setShowLeaveModal(true);
      };

      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave the placement test? Your progress will be lost.";
        return e.returnValue;
      };

      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.isTestInProgress = false;
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    } else {
      window.isTestInProgress = false;
    }
  }, [step]);

  const handleBackClick = (path) => {
    if (step === "test") {
      setPendingPath(path);
      setShowLeaveModal(true);
    } else {
      navigate(path);
    }
  };

  const handleConfirmLeave = () => {
    window.isTestInProgress = false;
    setShowLeaveModal(false);
    navigate(pendingPath || "/", { replace: true });
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setPendingPath("");
  };

  // Set default name if userData loaded
  useEffect(() => {
    if (userData && !form.name) {
      setForm((prev) => ({ ...prev, name: userData.name }));
    }
  }, [userData]);

  // ── Timer logic ────────────────────────────────────
  useEffect(() => {
    if (step !== "test" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [step, currentTest, timeLeft]);

  function handleTimeUp() {
    toast.error("Time ran out for this test!");
    handleTestComplete();
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const activeTestMeta = TESTS.find((t) => t.id === currentTest);
  const timePercent = questions.length > 0
    ? (timeLeft / testDuration) * 100
    : 100;

  const timerColor =
    timeLeft < 120 ? "text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30" :
    timeLeft < 300 ? "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30" :
    "text-green-600 bg-green-55 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30";

  // ── Handle PDF Upload ──────────────────────────────
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
      setResumeText(text);
      setUploadStatus("done");
      toast.success("PDF parsed successfully!");
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
      toast.error("Failed to read PDF. Try copy/pasting text manually.");
    }
  };

  // ── Start Interview ────────────────────────────────
  const handleStart = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!userData) {
      toast.error("Please log in to start the placement exam.");
      return;
    }

    if (userData.credits < 50) {
      toast.error("Insufficient credits. You need at least 50 credits to take a placement exam drive.");
      return;
    }

    setLoading(true);
    setLoadingMsg("Analyzing your resume details with AI...");

    try {
      let rData;
      if (resumeText) {
        const parseRes = await axios.post(
          ServerUrl + "/api/resume/parse",
          {
            resume_text: resumeText,
            target_role: form.role,
          },
          { withCredentials: true }
        );
        rData = parseRes.data;
      } else {
        rData = {
          name: form.name,
          skills: ["JavaScript", "React", "Node.js", "SQL", "Communication"],
          projects: [],
          experience_level: form.level,
          education: "B.Tech CSE",
          summary: `${form.name} is a ${form.level} candidate preparing for ${form.role} placement.`,
        };
      }

      setResumeData(rData);
      setStep("summary");
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse resume content. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Load questions for a test ──────────────────────
  const loadTest = async (testNum) => {
    const test = TESTS.find((t) => t.id === testNum);
    setLoading(true);
    setLoadingMsg(`Generating AI ${test.name} questions...`);
    setCurrentQ(0);
    setSelectedOption(null);
    setWrittenAnswer("");
    setShowExplanation(false);
    setAnswerFeedback(null);
    setTestAnswers([]);
    if (testNum === 1) {
      setMcqDetails([]);
      try {
        const startRes = await axios.post(
          ServerUrl + "/api/placement/start",
          {
            candidateName: form.name,
            targetRole: form.role,
            level: form.level,
            difficultyMode: form.mode
          },
          { withCredentials: true }
        );
        setActiveTestId(startRes.data.testId);
        if (startRes.data.creditsLeft !== undefined) {
          dispatch(setUserData({ ...userData, credits: startRes.data.creditsLeft }));
        }
      } catch (err) {
        console.error("Failed to start placement test:", err);
        setLoading(false);
        toast.error(err.response?.data?.message || "Failed to start placement test. Make sure you have at least 50 credits.");
        return;
      }
    }
    clearInterval(timerRef.current);
    setTimeLeft(test.time);

    try {
      const response = await axios.post(
        ServerUrl + "/api/questions/generate",
        {
          resume_data: resumeData,
          target_role: form.role,
          test_type: test.key,
          difficulty_mode: form.mode,
          question_count: questionCounts[testNum],
        },
        { withCredentials: true }
      );

      const qs = response.data.questions || [];

      // Auto-skip Test 5 if no projects found
      if (testNum === 5 && qs.length === 0) {
        toast.error("Skipped Project Deep Dive (no projects parsed from resume)");
        await finishAllTests([...testScores]);
        return;
      }

      setQuestions(qs);
      setCurrentTest(testNum);
      if (response.data.time_limit_seconds) {
        setTimeLeft(response.data.time_limit_seconds);
        setTestDuration(response.data.time_limit_seconds);
      }
      setStep("test");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to load Test ${testNum}. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  // ── MCQ Selection / Confirm ─────────────────────────
  const handleMCQSelect = (label) => {
    if (showExplanation) return;
    setSelectedOption(label);
  };

  const handleMCQConfirm = () => {
    if (!selectedOption) return;
    const q = questions[currentQ];
    const normalizedOpts = normalizeOptions(q.options);
    const chosenOpt = normalizedOpts.find(o => o.label === selectedOption);
    const isCorrect = chosenOpt ? isCorrectAnswer(chosenOpt, q) : false;
    
    const correctOpt = normalizedOpts.find(o => isCorrectAnswer(o, q));
    const correctLabel = correctOpt ? correctOpt.label : (q.correct_answer || "A");

    setShowExplanation(true);
    setTestAnswers((prev) => [...prev, isCorrect]);
    setMcqDetails((prev) => [
      ...prev,
      {
        testNum: currentTest,
        question: q.question,
        options: normalizedOpts,
        selectedOption: selectedOption,
        correctOption: correctLabel,
        explanation: q.explanation,
        isCorrect: isCorrect
      }
    ]);
  };

  // ── Written submit ───────────────────────────────
  const handleWrittenSubmit = async () => {
    if (!writtenAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);
    const q = questions[currentQ];

    try {
      let feedback;
      if (currentTest === 2) {
        const res = await axios.post(
          ServerUrl + "/api/evaluate/written",
          {
            question: q.question,
            answer: writtenAnswer,
            key_points: q.key_points || [],
            role: form.role,
            level: form.level,
          },
          { withCredentials: true }
        );
        feedback = res.data;
      } else if (currentTest === 4) {
        const res = await axios.post(
          ServerUrl + "/api/evaluate/softskill",
          {
            scenario: q.scenario,
            question: q.question,
            answer: writtenAnswer,
            role: form.role,
          },
          { withCredentials: true }
        );
        feedback = res.data;
      } else if (currentTest === 5) {
        const res = await axios.post(
          ServerUrl + "/api/evaluate/project",
          {
            question: q.question,
            answer: writtenAnswer,
            role: form.role,
          },
          { withCredentials: true }
        );
        feedback = res.data;
      }

      setAnswerFeedback(feedback);
      setTestAnswers((prev) => [...prev, feedback.score]);

      if (feedback.strengths) {
        setAllStrengths((s) => {
          if (Array.isArray(feedback.strengths)) {
            return [...s, ...feedback.strengths];
          } else if (typeof feedback.strengths === 'string') {
            return [...s, feedback.strengths];
          }
          return s;
        });
      }
      if (feedback.weaknesses) {
        setAllWeaknesses((w) => {
          if (Array.isArray(feedback.weaknesses)) {
            return [...w, ...feedback.weaknesses];
          } else if (typeof feedback.weaknesses === 'string') {
            return [...w, feedback.weaknesses];
          }
          return w;
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("AI Evaluation failed. Please skip or try submitting again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      handleTestComplete();
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedOption(null);
      setWrittenAnswer("");
      setShowExplanation(false);
      setAnswerFeedback(null);
    }
  };

  // ── Handle End of Single Test ──────────────────────
  const handleTestComplete = async () => {
    clearInterval(timerRef.current);
    const test = TESTS.find((t) => t.id === currentTest);
    const isMCQ = currentTest === 1 || currentTest === 3;
    const answers = [...testAnswers];

    let scoreVal = 0;
    if (isMCQ) {
      const correct = answers.filter(Boolean).length;
      scoreVal = questions.length > 0 ? (correct / questions.length) * 10 : 0;
    } else {
      scoreVal = answers.length > 0
        ? answers.reduce((a, b) => a + b, 0) / answers.length
        : 0;
    }

    const newScore = {
      test_name: test.name,
      test_type: test.key,
      score: parseFloat(scoreVal.toFixed(1)),
      total: 10,
      percentage: parseFloat((scoreVal * 10).toFixed(1)),
      score_out_of_10: parseFloat(scoreVal.toFixed(1)),
    };

    const updatedScores = [...testScores, newScore];
    setTestScores(updatedScores);

    const nextTest = currentTest + 1;
    if (nextTest <= 5) {
      await loadTest(nextTest);
    } else {
      await finishAllTests(updatedScores);
    }
  };

  // ── Final Evaluation Report Save ────────────────────
  const finishAllTests = async (scores) => {
    setLoading(true);
    setLoadingMsg("Generating your comprehensive placement report...");

    try {
      const repRes = await axios.post(
        ServerUrl + "/api/evaluate/final-report",
        {
          candidate_name: form.name,
          target_role: form.role,
          level: form.level,
          test_scores: scores,
          all_weaknesses: [...new Set(allWeaknesses)],
          all_strengths: [...new Set(allStrengths)],
        },
        { withCredentials: true }
      );
      const report = repRes.data;

      // Save complete drive to database and update document
      const saveRes = await axios.post(
        ServerUrl + "/api/placement/save",
        {
          testId: activeTestId,
          candidateName: form.name,
          targetRole: form.role,
          level: form.level,
          difficultyMode: form.mode,
          resumeText,
          resumeData,
          testScores: scores,
          allStrengths: [...new Set(allStrengths)],
          allWeaknesses: [...new Set(allWeaknesses)],
          finalReport: report,
        },
        { withCredentials: true }
      );

      toast.success("Placement exam report generated successfully!");
      
      // Update local coins state
      if (saveRes.data && saveRes.data.creditsLeft !== undefined) {
        dispatch(setUserData({ ...userData, credits: saveRes.data.creditsLeft }));
      }

      localStorage.setItem(`placement_mcq_details_${saveRes.data.testId}`, JSON.stringify(mcqDetails));

      navigate(`/placement-results/${saveRes.data.testId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save and generate placement report.");
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER: LOADING ────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-md">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-2">{loadingMsg}</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs">This takes about 10-20 seconds. Do not reload.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── RENDER: UPLOAD STEP ────────────────────────────
  if (step === "upload") {
    return (
      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
        <Toaster />
        <Navbar />

        <main className="flex-1 max-w-[95%] xl:max-w-7xl w-full mx-auto px-6 py-12">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Comprehensive Placement Exam</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Simulate a real-world placement assessment drive containing 5 separate tests.
              </p>
            </div>
          </div>

          {/* Grid Layout: Split Form and Structure Customize Horizontally */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form & Upload (takes 7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 rounded-xl p-3.5 text-xs font-semibold">
                <span>🎟️ Drives cost: 50 Credits</span>
                <span>Available credits: {userData?.credits || 0}</span>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:text-white"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative" ref={roleInputRef}>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Target Role</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search job role..."
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:text-white font-medium"
                        value={form.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        onFocus={() => {
                          const val = form.role || "";
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
                                setForm((prev) => ({ ...prev, role: r }));
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
                  <div className="space-y-2 relative" ref={expDropdownRef}>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Experience Level</label>
                    <div 
                      onClick={() => setShowExpDropdown(!showExpDropdown)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:text-white cursor-pointer flex justify-between items-center font-medium"
                    >
                      <span>
                        {LEVELS.find((l) => l.value === form.level)?.label || "Select Experience"}
                      </span>
                      <motion.div
                        animate={{ rotate: showExpDropdown ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronDown className="text-gray-400 dark:text-gray-500 text-xs" />
                      </motion.div>
                    </div>
                    {showExpDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute w-full mt-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto"
                      >
                        {LEVELS.map((l) => (
                          <div
                            key={l.value}
                            onClick={() => {
                              setForm({ ...form, level: l.value });
                              setShowExpDropdown(false);
                            }}
                            className="px-4 py-2.5 hover:bg-green-50 dark:hover:bg-emerald-900/30 hover:text-green-700 dark:hover:text-emerald-300 cursor-pointer transition text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-750/30 last:border-none"
                          >
                            {l.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 relative" ref={diffDropdownRef}>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Difficulty Mode</label>
                  <div 
                    onClick={() => setShowDiffDropdown(!showDiffDropdown)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:text-white cursor-pointer flex justify-between items-center font-semibold"
                  >
                    <span>
                      {MODES.find((m) => m.value === form.mode)?.label || "Select Difficulty"}
                    </span>
                    <motion.div
                      animate={{ rotate: showDiffDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown className="text-gray-400 dark:text-gray-500 text-xs" />
                    </motion.div>
                  </div>
                  {showDiffDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute w-full mt-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto"
                    >
                      {MODES.map((m) => (
                        <div
                          key={m.value}
                          onClick={() => {
                            setForm({ ...form, mode: m.value });
                            setShowDiffDropdown(false);
                          }}
                          className="px-4 py-2.5 hover:bg-green-50 dark:hover:bg-emerald-900/30 hover:text-green-700 dark:hover:text-emerald-300 cursor-pointer transition text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-750/30 last:border-none"
                        >
                          {m.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Resume File upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Resume PDF (Highly Recommended)</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition select-none ${
                      uploadStatus === "parsing" ? "border-amber-400 bg-amber-50/20" :
                      uploadStatus === "done" ? "border-green-400 bg-green-50/20" :
                      "border-gray-300 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-450 hover:bg-green-50/10 dark:hover:bg-green-950/10"
                    }`}
                  >
                    {uploadStatus === "idle" && (
                      <>
                        <div className="text-3xl text-gray-300 dark:text-gray-600 mb-2"><BsUpload /></div>
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs">Upload resume PDF</h4>
                        <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5">We'll parse and ask project viva questions based on it</p>
                      </>
                    )}
                    {uploadStatus === "parsing" && (
                      <>
                        <div className="text-3xl text-amber-500 animate-spin mb-2">⌛</div>
                        <h4 className="font-bold text-amber-700 dark:text-amber-400 text-xs">Parsing PDF...</h4>
                      </>
                    )}
                    {uploadStatus === "done" && (
                      <>
                        <div className="text-3xl text-green-500 mb-2">✓</div>
                        <h4 className="font-bold text-green-700 dark:text-green-400 text-xs">Resume Uploaded Successfully!</h4>
                        <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5">Click to choose a different file</p>
                      </>
                    )}
                    {uploadStatus === "error" && (
                      <>
                        <div className="text-3xl text-red-500 mb-2">❌</div>
                        <h4 className="font-bold text-red-700 dark:text-red-400 text-xs">Upload failed. Try again.</h4>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Customize structure & button (takes 5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 flex flex-col justify-between self-stretch">
              
              {/* Details panel */}
              <div className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center justify-between">
                  <span>Customize Exam Structure</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">Adjust question counts</span>
                </h4>
                <div className="space-y-3">
                  {TESTS.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800/60 p-3 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">{t.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Test {t.id}: {t.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{t.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="1" 
                          max="20"
                          className="w-16 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-lg p-2 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-colors"
                          value={questionCounts[t.id]} 
                          onChange={(e) => setQuestionCounts({...questionCounts, [t.id]: Number(e.target.value) || 1})} 
                        />
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">Qs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {userData?.credits >= 50 ? (
                  <button
                    onClick={handleStart}
                    className="w-full bg-black dark:bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-90 font-semibold py-3.5 px-6 rounded-full text-sm transition flex items-center justify-center gap-2 shadow-md dark:shadow-emerald-950/20 cursor-pointer"
                  >
                    Start Drive Exam <BsArrowRight />
                  </button>
                ) : (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-2xl text-xs flex gap-3 items-center">
                    <BsExclamationTriangle size={24} className="flex-shrink-0" />
                    <div>
                      <p className="font-bold">Insufficient Credits</p>
                      <p className="mt-0.5">You need 50 credits to take a placement exam. Buy more credits to unlock.</p>
                      <button onClick={() => navigate("/pricing")} className="mt-2 font-bold underline cursor-pointer">Buy Credits Now</button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── RENDER: SUMMARY STEP ───────────────────────────
  if (step === "summary") {
    return (
      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Resume Parsing Insights</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Review how wewithyou's AI interprets your profile skills and projects.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="bg-gray-900 dark:bg-slate-800 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <div>
                <h3 className="text-xl font-bold">👋 Hello, {resumeData?.name || form.name}</h3>
                <p className="text-gray-400 dark:text-gray-300 text-xs mt-1">Targeting: {form.role}</p>
              </div>
              <span className="bg-green-500 text-black text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {form.level}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Summary */}
              <div className="md:col-span-2 space-y-4">
                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-2.5">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-md">🤖 Profile AI Summary</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{resumeData?.summary}</p>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-2">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-md">🎓 Education</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{resumeData?.education || "Not specified"}</p>
                </div>
              </div>

              {/* Skills and Projects */}
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-md">⚡ Skills Found</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData?.skills?.map((sk) => (
                      <span key={sk} className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs px-2.5 py-1 rounded-md font-semibold border border-green-100 dark:border-green-900/30">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-md">🚀 Projects Extractions</h4>
                  {resumeData?.projects?.length > 0 ? (
                    <div className="space-y-2">
                      {resumeData.projects.map((p, i) => (
                        <div key={i} className="text-xs">
                          <div className="font-bold text-gray-700 dark:text-gray-300">{p.name}</div>
                          <div className="text-gray-400 dark:text-gray-500 mt-0.5 truncate">{p.description}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500">No projects found. Test 5 (Project Deep Dive) will be skipped.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setStep("upload")}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold px-6 py-3 rounded-full text-sm flex-1 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => loadTest(1)}
                className="bg-black dark:bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-90 font-bold px-8 py-3 rounded-full text-sm flex-1 transition"
              >
                Begin Exam Drive →
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── RENDER: EXAM TEST FLOW ──────────────────────────
  if (step === "test") {
    const q = questions[currentQ];
    const isMCQ = currentTest === 1 || currentTest === 3;
    const normalizedOpts = q ? normalizeOptions(q.options) : [];
    const correctOpt = q ? normalizedOpts.find(o => isCorrectAnswer(o, q)) : null;
    const correctLabel = correctOpt ? correctOpt.label : (q?.correct_answer || "A");

    return (
      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
        <header className='bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 px-5 md:px-8 py-3 flex items-center gap-4 shadow-sm transition-colors duration-200'>
            <button
                onClick={() => handleBackClick("/")}
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300 flex items-center justify-center cursor-pointer'
                aria-label="Go back"
            >
                <FaArrowLeft className="text-base md:text-lg" />
            </button>
            <div 
                onClick={() => handleBackClick("/")}
                className='flex items-center cursor-pointer hover:opacity-80 transition'
            >
                <Logo />
            </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 space-y-6">
          {/* Progress Drive Stepper */}
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            {TESTS.map((t) => {
              const done = t.id < currentTest;
              const active = t.id === currentTest;
              return (
                <div key={t.id} className="flex flex-col items-center gap-1.5 flex-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition ${
                    done ? "bg-green-500 text-black font-extrabold" :
                    active ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-2 border-green-500" :
                    "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500"
                  }`}>
                    {done ? "✓" : t.id}
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:block ${active ? "text-green-700 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
                    {t.name.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Test Timer Bar */}
          <div className={`border rounded-2xl p-4 flex items-center justify-between shadow-sm transition duration-300 ${timerColor}`}>
            <span className="text-sm font-bold flex items-center gap-1.5">
              <span>{activeTestMeta.icon}</span>
              <span>{activeTestMeta.name}</span>
            </span>
            <span className="font-mono font-extrabold text-lg tracking-wider flex items-center gap-1.5">
              <BsClockHistory /> {formatTime(timeLeft)}
            </span>
          </div>

          {/* Question View Card */}
          {q ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-xs font-bold bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {activeTestMeta.name}
                </span>
              </div>

              {/* Scenario */}
              {q.scenario && (
                <div className="bg-gray-50 dark:bg-slate-800/40 border-l-4 border-green-500 rounded-r-xl p-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  <strong>Scenario context:</strong> {q.scenario}
                </div>
              )}

              {/* Question Text */}
              <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-relaxed font-sans">{q.question}</h3>

              {isMCQ ? (
                <div className="space-y-3">
                  {normalizeOptions(q.options).map((opt) => {
                    let btnCls = "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800";
                    const isCorrect = isCorrectAnswer(opt, q);
                    if (showExplanation) {
                      if (isCorrect) {
                        btnCls = "bg-green-100 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 font-bold";
                      } else if (opt.label === selectedOption) {
                        btnCls = "bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 font-bold";
                      }
                    } else if (opt.label === selectedOption) {
                      btnCls = "bg-green-50 dark:bg-green-950/20 border-green-400 text-green-700 dark:text-green-400 ring-2 ring-green-100 dark:ring-green-950/10";
                    }

                    return (
                      <button
                        key={opt.label}
                        disabled={showExplanation}
                        onClick={() => handleMCQSelect(opt.label)}
                        className={`w-full text-left p-4 border rounded-xl text-sm transition flex gap-3 items-center cursor-pointer ${btnCls}`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                          selectedOption === opt.label ? "bg-green-500 text-black" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                        }`}>{opt.label}</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}

                  {showExplanation && (
                    <div className="space-y-3 mt-4">
                      {isCorrectAnswer(normalizeOptions(q.options).find(o => o.label === selectedOption) || {}, q) === false ? (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-3.5 rounded-xl text-xs flex gap-2 items-start font-semibold">
                          <span className="text-sm">⚠️</span>
                          <div>
                            <span>You chose Option {selectedOption}</span>. The correct answer is <span className="font-extrabold text-green-700 dark:text-green-400 underline">Option {correctLabel}</span>.
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 p-3.5 rounded-xl text-xs flex gap-2 items-start font-semibold">
                          <span className="text-sm">✓</span>
                          <div>
                            <span>Correct answer! Option {selectedOption} is right.</span>
                          </div>
                        </div>
                      )}

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-xl text-xs leading-relaxed"
                      >
                        <strong>💡 Explanatory note:</strong> {q.explanation || `Option ${correctLabel} is the correct choice.`}
                      </motion.div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                    style={{ minHeight: "150px" }}
                    placeholder="Type your response here. Aim to be detailed and reference technical/STAR points..."
                    value={writtenAnswer}
                    disabled={isEvaluating}
                    onChange={(e) => setWrittenAnswer(e.target.value)}
                  />

                  <button
                    onClick={handleWrittenSubmit}
                    disabled={isEvaluating || !writtenAnswer.trim()}
                    className="w-full bg-black dark:bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-90 font-semibold py-3 px-6 rounded-full text-sm transition flex items-center justify-center disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isEvaluating ? "Evaluating with AI..." : "Submit Answer for Evaluation →"}
                  </button>

                  {answerFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                        <span className="font-bold text-gray-800 dark:text-white">AI Evaluation Feedback</span>
                        <span className="text-sm font-extrabold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 px-3 py-1 rounded-full">
                          Score: {answerFeedback.score}/10
                        </span>
                      </div>

                      <p className="text-sm font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-2.5 rounded-lg border border-green-100 dark:border-green-900/30">
                        Verdict: {answerFeedback.verdict}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 text-xs leading-relaxed">
                        <div className="bg-green-50/10 dark:bg-green-950/5 border border-green-100 dark:border-green-900/20 p-3 rounded-lg">
                          <strong className="text-green-700 dark:text-green-400">✅ Strengths:</strong>
                          <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-500 dark:text-gray-400">
                            {Array.isArray(answerFeedback.strengths) ? (
                              answerFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)
                            ) : typeof answerFeedback.strengths === 'string' && answerFeedback.strengths ? (
                              <li>{answerFeedback.strengths}</li>
                            ) : (
                              <li className="list-none text-gray-400 italic">No specific strengths noted.</li>
                            )}
                          </ul>
                        </div>
                        <div className="bg-red-50/10 dark:bg-red-950/5 border border-red-100 dark:border-red-900/20 p-3 rounded-lg">
                          <strong className="text-red-600 dark:text-red-400">❌ Weaknesses:</strong>
                          <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-500 dark:text-gray-400">
                            {Array.isArray(answerFeedback.weaknesses) ? (
                              answerFeedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                            ) : typeof answerFeedback.weaknesses === 'string' && answerFeedback.weaknesses ? (
                              <li>{answerFeedback.weaknesses}</li>
                            ) : (
                              <li className="list-none text-gray-400 italic">No specific weaknesses noted.</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 bg-gray-50 p-3 border border-gray-200 rounded-lg">
                        <strong>💡 Actionable advice:</strong> {answerFeedback.suggestion}
                      </p>

                      {answerFeedback.ideal_answer_hint && (
                        <p className="text-xs text-gray-400 italic">
                          <strong>Hint:</strong> {answerFeedback.ideal_answer_hint}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Navigation Action */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800 gap-4">
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < currentQ ? "bg-green-500" :
                        i === currentQ ? "bg-green-300 ring-2 ring-green-100 dark:ring-green-950/20 animate-pulse" :
                        "bg-gray-200 dark:bg-slate-800"
                      }`}
                    />
                  ))}
                </div>

                {/* Show Next button or MCQ Confirm button */}
                {isMCQ && !showExplanation ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleMCQConfirm}
                    className="bg-black dark:bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-90 font-bold px-6 py-2.5 rounded-full text-xs transition disabled:bg-gray-300 dark:disabled:bg-gray-850 disabled:cursor-not-allowed cursor-pointer shadow-md"
                  >
                    Confirm Answer →
                  </button>
                ) : (
                  ((isMCQ && showExplanation) || (!isMCQ && answerFeedback)) && (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-black dark:bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-90 font-bold px-6 py-2.5 rounded-full text-xs transition cursor-pointer shadow-md"
                    >
                      {currentQ + 1 >= questions.length ? "Finish Test →" : "Next Question →"}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm text-center">
              <p className="text-gray-400 dark:text-gray-500">Loading questions from server...</p>
            </div>
          )}
        </main>
        <Footer />

        {/* Beautiful Leave Confirmation Modal */}
        {showLeaveModal && (
            <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 pt-12 md:pt-16">
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-6 text-center animate-fade-in"
                >
                    <div className="mx-auto w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center text-2xl">
                        ⚠️
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leave Placement Test?</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            Are you sure you want to leave the placement test? Your progress will be lost.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleCancelLeave}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmLeave}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                        >
                            Yes, Leave
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </div>
    );
  }
}
