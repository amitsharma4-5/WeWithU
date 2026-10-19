import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { ServerUrl } from "../utils/serverUrl";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast, Toaster } from "react-hot-toast";
import { BsMap, BsArrowLeft, BsFillAwardFill, BsHeartPulse, BsCheckCircleFill, BsXCircleFill, BsJournalText } from "react-icons/bs";

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

function getPerformanceEmoji(score) {
  if (score >= 9)  return "🏆 Outstanding";
  if (score >= 7.5) return "⭐ Excellent";
  if (score >= 6)  return "✅ Good";
  if (score >= 4)  return "⚠️ Average";
  return "📚 Needs Work";
}

function getRatingColor(rating) {
  switch (rating) {
    case "Elite":       return "text-green-600 border-green-200 bg-green-50";
    case "Strong":      return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "Developing":  return "text-amber-600 border-amber-200 bg-amber-50";
    case "Needs Work":  return "text-red-600 border-red-200 bg-red-50";
    default:            return "text-green-600 border-green-200 bg-green-50";
  }
}

function getScoreColor(score) {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score) {
  if (score >= 8) return "bg-green-50 border-green-100";
  if (score >= 6) return "bg-amber-50 border-amber-100";
  return "bg-red-50 border-red-100";
}

function getPriorityColor(priority) {
  switch (priority) {
    case "high":   return { bg: "bg-red-50 text-red-700 border-red-100", label: "High" };
    case "medium": return { bg: "bg-amber-50 text-amber-700 border-amber-100", label: "Medium" };
    default:       return { bg: "bg-blue-50 text-blue-700 border-blue-100", label: "Low" };
  }
}

export default function PlacementResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mcqDetails, setMcqDetails] = useState([]);

  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(`placement_mcq_details_${id}`);
      if (stored) {
        setMcqDetails(JSON.parse(stored));
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/api/placement/report/${id}`,
          { withCredentials: true }
        );
        setTestData(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load placement report details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-md">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Retrieving Report...</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">Loading placement results from database.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-md space-y-4">
            <div className="text-5xl">📭</div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">No Results Found</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm">We couldn't locate this placement exam drive record.</p>
            <button
              onClick={() => navigate("/placement-test")}
              className="bg-black dark:bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-90 font-semibold py-2 px-6 rounded-full text-xs transition cursor-pointer shadow-md"
            >
              Start Placement Exam
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const report = testData.finalReport || {};
  const overallScore = report.overall_score || 0;
  const rating = report.rating || "Developing";
  const ratingColor = getRatingColor(rating);
  const readiness = report.readiness_score || Math.round(overallScore * 10);

  const tabs = [
    { id: "overview",  label: "Overview",     icon: "📊" },
    { id: "breakdown", label: "Test Details",  icon: "📋" },
    { id: "strengths", label: "Strengths",     icon: "💪" },
    { id: "studyplan", label: "Study Plan",    icon: "📚" },
  ];

  if (mcqDetails && mcqDetails.length > 0) {
    tabs.push({ id: "review", label: "Questions Review", icon: "🧐" });
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
      <Toaster />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black dark:hover:text-white transition cursor-pointer"
        >
          <BsArrowLeft /> Back to Drive History
        </button>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 to-green-950 text-white rounded-3xl p-8 md:p-10 shadow-lg overflow-hidden text-center">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">
            🏆
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Circular score display */}
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-6xl font-black text-green-400">{overallScore.toFixed(1)}</span>
              <span className="text-xl text-gray-400 font-semibold">/10</span>
            </div>

            {/* Badges container */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <div className="bg-white/10 border border-white/20 px-5 py-2 rounded-full font-bold text-sm tracking-wide">
                {getPerformanceEmoji(overallScore)}
              </div>
              <div className="bg-emerald-500/20 border border-emerald-400/25 text-emerald-300 px-5 py-2 rounded-full font-bold text-sm tracking-wide capitalize">
                ⚙️ {testData.difficultyMode || "Medium"} Mode
              </div>
            </div>

            {/* Title / Info */}
            <h3 className="font-bold text-lg mb-2">
              {testData.candidateName} — {testData.targetRole}
            </h3>
            <p className="text-gray-300 text-sm max-w-xl leading-relaxed mb-6">
              {report.summary}
            </p>

            <span className="bg-green-500 text-black text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Ready in: {report.estimated_ready_in || "Keep Practicing"}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Overall Score", value: `${overallScore.toFixed(1)}/10`, textCls: getScoreColor(overallScore) },
            { label: "Tests Taken", value: `${testData.testScores?.length || 0}/5`, textCls: "text-green-600" },
            { label: "Readiness Rating", value: `${readiness}%`, textCls: "text-green-600" },
            { label: "Final Band", value: rating, textCls: "text-green-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center shadow-sm">
              <div className={`text-2xl font-black mb-1.5 ${stat.textCls}`}>{stat.value}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs switcher */}
        <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto gap-2 select-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Performance Bar chart */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-white text-md flex items-center gap-1.5"><BsJournalText /> Score by Test Section</h3>
              <div className="space-y-4 pt-2">
                {(testData.testScores || []).map((ts, idx) => {
                  const pct = Math.round((ts.score_out_of_10 / 10) * 100);
                  const color = getScoreColor(ts.score_out_of_10);
 
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-gray-700 dark:text-gray-300">{ts.test_name}</span>
                        <span className={`font-bold ${color}`}>{ts.score_out_of_10.toFixed(1)}/10</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%`, backgroundColor: ts.score_out_of_10 >= 8 ? "#10b981" : ts.score_out_of_10 >= 6 ? "#f59e0b" : "#ef4444" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Placement Readiness circular meter */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-gray-800 dark:text-white text-md w-full text-left mb-4 flex items-center gap-1.5"><BsHeartPulse /> Placement Readiness</h3>

              <div className="relative w-40 h-24 mb-4 flex justify-center overflow-hidden">
                <svg width="160" height="100" viewBox="0 0 160 100" className="absolute top-0">
                  <path
                    d="M20 90 A70 70 0 0 1 140 90"
                    fill="none"
                    stroke="#f3f4f6"
                    className="stroke-gray-100 dark:stroke-slate-800"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 90 A70 70 0 0 1 140 90"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${readiness * 2.2} 1000`}
                  />
                </svg>
                <div className="absolute bottom-1 font-black text-2xl text-green-600 dark:text-green-400">{readiness}%</div>
              </div>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-250 mb-2">
                {readiness >= 80 ? "🎉 You are Job-Ready!" : readiness >= 60 ? "💪 Good Progress. Keep building!" : "📚 Focus on study materials!"}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">Estimated prep time: {report.estimated_ready_in}</span>
            </div>

            {/* Strengths Card */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-white text-md flex items-center gap-1.5"><BsCheckCircleFill className="text-green-500" /> Major Strengths</h3>
              <ul className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                {report.positive_areas?.slice(0, 5).map((str, idx) => (
                  <li key={idx} className="flex gap-2 items-start leading-relaxed bg-green-50/50 dark:bg-green-950/20 p-2.5 rounded-lg border border-green-100 dark:border-green-900/30">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
 
            {/* Weaknesses Card */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-white text-md flex items-center gap-1.5"><BsXCircleFill className="text-red-500" /> Focus Areas</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {report.negative_areas?.slice(0, 8).map((wk, idx) => (
                  <span key={idx} className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30">
                    {wk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: BREAKDOWN DETAILS */}
        {activeTab === "breakdown" && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 dark:text-white text-md">📋 Test Section Breakdown</h3>
            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-5 bg-gray-50 dark:bg-slate-800/40 p-4 border-b border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-550 font-bold uppercase tracking-wider">
                <span className="col-span-2">Test Name</span>
                <span>Type</span>
                <span className="text-center">Score</span>
                <span className="text-right">Band</span>
              </div>
              {(testData.testScores || []).map((ts, idx) => {
                const isExcellent = ts.score_out_of_10 >= 8;
                const isGood = ts.score_out_of_10 >= 6;
                const scoreColor = getScoreColor(ts.score_out_of_10);
                const scoreBg = getScoreBg(ts.score_out_of_10);
 
                return (
                  <div key={idx} className="grid grid-cols-5 p-4 border-b border-gray-100 dark:border-gray-800 items-center hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
                    <span className="col-span-2 font-bold text-gray-700 dark:text-gray-250">{ts.test_name}</span>
                    <span>
                      <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                        {ts.test_type?.replace("_", " ")}
                      </span>
                    </span>
                    <span className={`text-center font-black ${scoreColor}`}>{ts.score_out_of_10.toFixed(1)}/10</span>
                    <span className="text-right">
                      <span className={`font-bold px-2 py-0.5 rounded border ${scoreBg} ${scoreColor}`}>
                        {isExcellent ? "Elite" : isGood ? "Strong" : "Developing"}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: STRENGTHS */}
        {activeTab === "strengths" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-green-700 dark:text-green-450 text-md">✓ Strengths Detailed</h3>
              <ul className="space-y-3.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {(testData.allStrengths || []).concat(report.positive_areas || [])
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map((str, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-red-650 dark:text-red-400 text-md">✗ Weaknesses Detailed</h3>
              <ul className="space-y-3.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {(testData.allWeaknesses || []).concat(report.negative_areas || [])
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map((wk, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB: STUDY PLAN */}
        {activeTab === "studyplan" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-900/30 rounded-2xl p-5 flex items-center gap-4">
              <span className="text-3xl">📚</span>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white">Your Actionable Study Curriculum</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs">AI recommendations compiled to target your specific skills gaps.</p>
              </div>
            </div>

            {/* Study Items Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {report.study_plan?.map((item, idx) => {
                const priorityMeta = getPriorityColor(item.priority);
                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 border rounded-full inline-block mb-3.5 ${priorityMeta.bg}`}>
                        {priorityMeta.label} Priority
                      </span>
                      <h4 className="font-black text-gray-800 dark:text-white text-md mb-2">{item.topic}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.strategy}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <span>Course/Book:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-bold">{item.resource}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommended Schedule */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 dark:text-white text-md">📅 Recommended Weekly Prep Schedule</h3>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 text-center text-xs">
                {[
                  { d: "Mon", task: "Tech Core", icon: "💻" },
                  { d: "Tue", task: "DSA Alg", icon: "🧮" },
                  { d: "Wed", task: "Mock Exam", icon: "🎯" },
                  { d: "Thu", task: "Soft Skills", icon: "🤝" },
                  { d: "Fri", task: "Company Qs", icon: "🏢" },
                  { d: "Sat", task: "Projects", icon: "🚀" },
                  { d: "Sun", task: "Revise", icon: "📖" },
                ].map((schedule, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 flex flex-col items-center">
                    <span className="text-xl mb-1.5">{schedule.icon}</span>
                    <span className="font-bold text-green-700 dark:text-green-400 mb-0.5 uppercase tracking-wider text-[10px]">{schedule.d}</span>
                    <span className="text-gray-400 dark:text-gray-400 text-[10px] leading-tight">{schedule.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: QUESTIONS REVIEW */}
        {activeTab === "review" && mcqDetails.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 dark:text-white text-md flex items-center gap-2">
              <span>🧐</span> Detailed MCQ Questions Review
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed">
              Review correct and incorrect answers from the MCQ test drives (Technical Knowledge & Aptitude Reasoning).
            </p>

            <div className="space-y-8 pt-4">
              {[1, 3].map((testId) => {
                const sectionName = testId === 1 ? "Technical Knowledge MCQs" : "Aptitude & Reasoning MCQs";
                const sectionQuestions = Array.isArray(mcqDetails) 
                    ? mcqDetails.filter(q => q && q.testNum === testId) 
                    : [];

                if (sectionQuestions.length === 0) return null;

                return (
                  <div key={testId} className="space-y-4">
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm border-b border-gray-100 dark:border-gray-800 pb-2 flex justify-between items-center">
                      <span>{sectionName}</span>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                        {sectionQuestions.filter(q => q.isCorrect).length} / {sectionQuestions.length} Correct
                      </span>
                    </h4>

                    <div className="space-y-6">
                      {sectionQuestions.map((q, idx) => (
                        <div key={idx} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 md:p-6 space-y-4 bg-gray-50/30 dark:bg-slate-800/10">
                          <div className="flex justify-between items-start gap-4">
                            <span className="text-xs font-bold text-gray-400">Q{idx + 1}.</span>
                            <span className={`text-[10px] font-black px-2.5 py-1 border rounded-full ${
                              q.isCorrect 
                                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400" 
                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
                            }`}>
                              {q.isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
                            </span>
                          </div>

                          <h5 className="font-bold text-gray-800 dark:text-white text-sm leading-relaxed">{q.question}</h5>

                          <div className="grid md:grid-cols-2 gap-3.5">
                            {(() => {
                               const normalizedOpts = normalizeOptions(q.options);
                               return normalizedOpts.map((opt) => {
                                 let optionCls = "border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300";
                                 const isCorrect = isCorrectAnswer(opt, { correctOption: q.correctOption });
                                 const isSelected = opt.label === q.selectedOption;
                                 
                                 if (isCorrect) {
                                   optionCls = "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 font-semibold";
                                 } else if (isSelected && !q.isCorrect) {
                                   optionCls = "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 font-semibold";
                                 }

                                 return (
                                   <div key={opt.label} className={`p-3.5 border rounded-xl text-xs flex items-center gap-3 ${optionCls}`}>
                                     <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                                       isCorrect 
                                         ? "bg-green-500 text-white" 
                                         : isSelected 
                                         ? "bg-red-500 text-white" 
                                         : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                                     }`}>{opt.label}</span>
                                     <span>{opt.text}</span>
                                   </div>
                                 );
                               });
                             })()}
                          </div>

                          {!q.isCorrect && (
                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 p-3 rounded-xl text-xs flex gap-2 items-start">
                              <span className="text-sm">⚠️</span>
                              <div>
                                <span className="font-black">Your choice: Option {q.selectedOption}</span>. The correct answer was <span className="font-black">Option {q.correctOption}</span>.
                              </div>
                            </div>
                          )}

                          <div className="bg-green-50/40 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-xl p-3.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
                            <strong>💡 Explanation:</strong> {(() => {
                              const normalizedOpts = normalizeOptions(q.options);
                              const correctOpt = normalizedOpts.find(o => isCorrectAnswer(o, { correctOption: q.correctOption }));
                              const correctText = correctOpt ? correctOpt.text : "";
                              return q.explanation || `Option ${q.correctOption || "A"} is the correct choice: "${correctText}".`;
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            onClick={() => navigate("/roadmap")}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-full text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 duration-200"
          >
            <BsMap /> View Career Roadmap
          </button>
          <button
            onClick={() => navigate("/placement-test")}
            className="bg-black dark:bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-90 font-semibold py-3 px-6 rounded-full text-xs transition cursor-pointer shadow-md hover:-translate-y-0.5 duration-200"
          >
            Start New Exam
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-full text-xs transition cursor-pointer shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
