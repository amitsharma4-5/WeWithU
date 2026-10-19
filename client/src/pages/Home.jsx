import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsCpu,
  BsShieldCheck,
  BsLightningCharge,
  BsAward,
  BsArrowRight,
  BsCoin,
  BsCheck2Circle
} from "react-icons/bs";
import { HiSparkles, HiChevronRight } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/interview");
  };

  const handleStartPlacement = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/placement-test");
  };

  return (
    <div className='min-h-screen bg-[#f8fafc] dark:bg-[#090d16] flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200 bg-grid-pattern'>
      
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-teal-500/5 dark:bg-teal-500/8 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '-4s' }} />
      <div className="absolute bottom-[20%] left-[-150px] w-[600px] h-[600px] bg-green-500/5 dark:bg-green-500/5 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '-2s' }} />

      <Navbar />

      <div className='flex-1 px-4 sm:px-6 py-12 md:py-16 lg:py-24 z-10 relative'>
        <div className='max-w-6xl mx-auto'>

          {/* Hero Welcome Section */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32'>
            
            {/* Left Hero Column */}
            <div className='lg:col-span-7 text-left space-y-6'>
              <div className='inline-flex'>
                <div className='bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-xs sm:text-sm px-4.5 py-2 rounded-full border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2 font-bold transition-all shadow-sm'>
                  <HiSparkles size={16} className="text-emerald-500 animate-pulse" />
                  {userData ? `Welcome back, ${userData.name.split(" ")[0]}!` : "⚡ Next-Gen AI Career Coach"}
                </div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white tracking-tight'
              >
                Ace Technical Placements With <br />
                <span className='bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400 font-black relative'>
                  AI-Powered Real-Time Grills
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className='text-gray-500 dark:text-gray-400 max-w-xl text-base md:text-lg leading-relaxed font-medium'
              >
                wewithyou is a professional conversational coach that conducts smart technical & HR mock interviews, scores answers with adaptive difficulty, and scan-matches resumes for corporate placements.
              </motion.p>

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-4 pt-2'>
                <button 
                  onClick={handleStartInterview}
                  className='bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-4 rounded-full transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 duration-200 cursor-pointer text-sm flex items-center gap-2 group'
                >
                  Start Mock Interview <BsArrowRight className='group-hover:translate-x-1.5 transition-transform font-black' />
                </button>
                <button 
                  onClick={handleStartPlacement}
                  className='bg-black dark:bg-[#111827] hover:bg-gray-900 dark:hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-full border border-gray-200 dark:border-gray-800 transition cursor-pointer text-sm shadow-sm'
                >
                  Placement Drive Exam
                </button>
              </div>

              {/* Live Metric Stats */}
              <div className='pt-6 border-t border-gray-150 dark:border-gray-800/80 grid grid-cols-3 gap-4 max-w-lg'>
                <div>
                  <h4 className='text-xl sm:text-2xl font-black text-gray-800 dark:text-white'>15K+</h4>
                  <p className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5'>Interviews Conducted</p>
                </div>
                <div>
                  <h4 className='text-xl sm:text-2xl font-black text-gray-800 dark:text-white'>94%</h4>
                  <p className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5'>Placement Rate</p>
                </div>
                <div>
                  <h4 className='text-xl sm:text-2xl font-black text-gray-800 dark:text-white'>14+</h4>
                  <p className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5'>Technical Sectors</p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Premium 3D Mockup */}
            <div className='lg:col-span-5 flex justify-center perspective-1000'>
              <motion.div
                initial={{ opacity: 0, rotateY: -10, rotateX: 5, y: 20 }}
                animate={{ opacity: 1, rotateY: 10, rotateX: 5, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ rotateY: 2, rotateX: 2, scale: 1.02 }}
                className='relative w-full max-w-[400px] aspect-[4/5] bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 border border-gray-200/80 dark:border-gray-800/80 rounded-[36px] shadow-2xl p-6 transform-3d flex flex-col justify-between overflow-visible group select-none'
              >
                {/* Visual Glass Header */}
                <div className='flex justify-between items-center border-b border-gray-200/50 dark:border-gray-800/50 pb-4'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-3 h-3 rounded-full bg-red-400 animate-pulse' />
                    <div className='w-3 h-3 rounded-full bg-yellow-400' />
                    <div className='w-3 h-3 rounded-full bg-green-400' />
                  </div>
                  <span className='font-mono font-bold text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200/35 dark:border-gray-700/30'>
                    Live Coach
                  </span>
                </div>

                {/* Avatar / Dynamic Audio Waves */}
                <div className='my-auto flex flex-col items-center gap-6 py-6'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-125 animate-pulse' />
                    <div className='w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl relative z-10'>
                      <BsRobot size={44} className='animate-float' />
                    </div>
                  </div>

                  <div className='text-center space-y-1 z-10'>
                    <h5 className='font-bold text-gray-800 dark:text-white text-md'>AI Recruiter Coach</h5>
                    <p className='text-gray-400 dark:text-gray-500 text-xs font-semibold'>Question 3: Explain React Fiber architecture...</p>
                  </div>

                  {/* Pulsing Audio wave simulation */}
                  <div className='flex items-center gap-1.5 h-10'>
                    {[16, 24, 38, 18, 30, 20, 36, 24, 14, 28, 18].map((h, i) => (
                      <span
                        key={i}
                        className='w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-300'
                        style={{
                          height: `${h}px`,
                          animation: `float 1.2s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Feedback Float Widgets (gives 3D depth) */}
                <div className='absolute -left-6 top-1/3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-float pointer-events-none' style={{ animationDelay: '-1.5s' }}>
                  <span className='bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 p-2 rounded-lg text-xs font-bold'>✓</span>
                  <div>
                    <p className='text-[10px] text-gray-400 font-bold uppercase'>Confidence</p>
                    <p className='text-xs font-black text-gray-800 dark:text-white'>Strong Tone</p>
                  </div>
                </div>

                <div className='absolute -right-6 bottom-1/4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-float pointer-events-none' style={{ animationDelay: '-3.2s' }}>
                  <span className='bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-2 rounded-lg text-xs font-bold'>⚡</span>
                  <div>
                    <p className='text-[10px] text-gray-400 font-bold uppercase'>Accuracy</p>
                    <p className='text-xs font-black text-gray-800 dark:text-white'>Score: 8.5/10</p>
                  </div>
                </div>

                {/* Simulated Response Box */}
                <div className='bg-gray-100 dark:bg-slate-800/40 border border-gray-200/40 dark:border-gray-800/40 rounded-2xl p-4 text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic relative z-10'>
                  "React Fiber is a rewrite of the reconciliation algorithm to allow incremental rendering, enabling split updates..."
                </div>
              </motion.div>
            </div>

          </div>

          {/* Three-step indicators grid */}
          <div className='flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-10 mb-36'>
            {
              [
                {
                  icon: <BsRobot size={24} />,
                  step: "STEP 1",
                  title: "Role & Experience Setup",
                  desc: "Configure target job roles and experience levels. AI models automatically adapt the questions' complexities."
                },
                {
                  icon: <BsMic size={24} />,
                  step: "STEP 2",
                  title: "Smart Speech-to-Text Setup",
                  desc: "Take interviews with dynamic verbal prompts. AI listens and generates natural follow-ups based on responses."
                },
                {
                  icon: <BsClock size={24} />,
                  step: "STEP 3",
                  title: "Real-Time Dashboard & Evaluation",
                  desc: "Feel real test pressure with timing restrictions. Get scoring cards and granular performance breakdowns."
                }
              ].map((item, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={handleStartInterview}
                  className={`
                    relative bg-white dark:bg-[#111827]/50 rounded-3xl border border-gray-200/60 dark:border-gray-850/80
                    hover:border-emerald-400 dark:hover:border-emerald-500 p-8 w-80 max-w-[90%] 
                    shadow-[0_12px_24px_-10px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.01)]
                    hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)]
                    transition-all duration-300 hover:-translate-y-1.5 cursor-pointer
                    ${index === 0 ? "rotate-[-0.5deg]" : ""}
                    ${index === 1 ? "rotate-[0.5deg] md:-mt-6 shadow-md shadow-emerald-600/5 border-emerald-500/10" : ""}
                    ${index === 2 ? "rotate-[-0.5deg]" : ""}
                  `}
                >
                  <div className='absolute -top-7 left-1/2 -translate-x-1/2 bg-gradient-to-br from-emerald-500 to-green-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-white dark:border-slate-900'>
                    {item.icon}
                  </div>
                  <div className='pt-8 text-center'>
                    <div className='text-[10px] text-green-600 dark:text-green-400 font-extrabold mb-1 tracking-wider'>{item.step}</div>
                    <h3 className='font-bold mb-2.5 text-md text-gray-800 dark:text-gray-200 tracking-tight'>{item.title}</h3>
                    <p className='text-xs text-gray-400 dark:text-gray-400 leading-relaxed font-medium'>{item.desc}</p>
                  </div>
                </motion.div>
              ))
            }
          </div>

          {/* AI Placement Drive Portal */}
          <div className='mb-36'>
            <div className='bg-gradient-to-br from-[#0c151b] via-[#091116] to-[#041a12] text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-[0_35px_70px_-20px_rgba(0,0,0,0.5),0_0_60px_0_rgba(16,185,129,0.08)] border border-white/5'>
              
              {/* Radial gradient background mesh inside drive card */}
              <div className='absolute right-0 top-0 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-glow' />
              <div className='absolute left-1/3 bottom-0 w-80 h-80 bg-green-500/5 rounded-full blur-[90px] pointer-events-none animate-pulse-glow' style={{ animationDelay: '-3s' }} />
              
              <div className='relative z-10 max-w-3xl space-y-4'>
                <span className='bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20 tracking-widest uppercase'>
                  🎟️ placement assessment
                </span>
                <h2 className='text-3xl md:text-5xl font-black mt-2 mb-4 tracking-tight leading-tight'>
                  Comprehensive <span className='text-[#00e676] bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>5-Stage AI Placement Drive</span>
                </h2>
                <p className='text-gray-400 text-sm md:text-base mb-8 leading-relaxed font-medium'>
                  Simulate complete campus selection assessments. Our comprehensive engine tests your core technical logic, coding capabilities, numerical aptitude, behavioral soft skills, and complete a project walkthrough. Earn a unified performance card!
                </p>
                
                {/* Info Callout */}
                <div className="flex items-center gap-3 bg-[#11241f]/40 border border-[#163a2d]/30 rounded-2xl p-4 max-w-lg mb-4 text-xs font-bold text-[#00e676]">
                  <BsCoin size={18} className="text-yellow-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Drives cost 50 credits. Starting the exam deducts credits immediately (non-refundable if left incomplete).</span>
                </div>

                <div className='flex flex-wrap gap-4 pt-2'>
                  <button 
                    onClick={handleStartPlacement}
                    className='bg-[#00e676] hover:bg-[#00c853] text-[#050b0e] font-black px-8 py-4 rounded-full transition shadow-lg shadow-[#00e676]/15 hover:shadow-[#00e676]/30 hover:-translate-y-0.5 duration-200 cursor-pointer text-xs tracking-wider uppercase'
                  >
                    Start Placement Drive
                  </button>
                  <button 
                    onClick={() => navigate("/guidance")}
                    className='bg-transparent border border-white/10 hover:border-white/30 text-white font-bold px-8 py-4 rounded-full transition cursor-pointer hover:bg-white/5 text-xs tracking-wider uppercase'
                  >
                    Placement Guide
                  </button>
                </div>
              </div>
              
              {/* Stages Grid Indicator */}
              <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-16 pt-10 border-t border-white/5 text-center relative z-10'>
                {[
                  { stage: "Stage 1", name: "Technical MCQs", desc: "12 Technical questions", icon: "💻" },
                  { stage: "Stage 2", name: "Written Answers", desc: "4 Core coding logic Qs", icon: "✍️" },
                  { stage: "Stage 3", name: "Aptitude Exam", desc: "10 Logical Reasoning Qs", icon: "🧠" },
                  { stage: "Stage 4", name: "Soft Skills", desc: "5 Behavioral HR scenarios", icon: "🤝" },
                  { stage: "Stage 5", name: "Project Walkthrough", desc: "AI project viva questions", icon: "🚀" }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={handleStartPlacement}
                    className='bg-[#111c24]/40 border border-white/5 hover:border-[#00e676]/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-200 cursor-pointer hover:scale-[1.03] group text-left flex flex-col justify-between min-h-[140px]'
                  >
                    <div>
                      <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center mb-3">{item.icon}</span>
                      <div className='text-[#00e676] text-[10px] font-extrabold mb-1.5 tracking-wider uppercase'>{item.stage}</div>
                      <div className='text-xs sm:text-sm text-gray-200 font-bold leading-tight group-hover:text-white transition-colors'>{item.name}</div>
                    </div>
                    <div className='text-[10px] text-gray-500 font-medium mt-2'>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Preparation Tools */}
          <div className='mb-36'>
            <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
              <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                Placement Preparation <span className="text-[#00c853]">Toolkit</span>
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Everything you need to master off-campus and on-campus placements.</p>
            </div>

            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[
                {
                  title: "Learning Roadmaps",
                  desc: "Structured visual guides across 14+ technical domains, backend systems, database normalization, and frontend stacks.",
                  link: "/roadmap",
                  action: "Explore Roadmaps",
                  icon: <BsLightningCharge size={18} />
                },
                {
                  title: "Company Interview Prep",
                  desc: "Curated grids, official exam pattern specifications, and expert tips for FAANG and Service-based giants.",
                  link: "/company-prep",
                  action: "Prepare Company-wise",
                  icon: <BsCpu size={18} />
                },
                {
                  title: "Resume & ATS Scanner",
                  desc: "Upload your resume PDF, extract details, and perform scan compatibility scores matching custom job specs.",
                  link: "/resume-tips",
                  action: "Scan Resume Score",
                  icon: <BsFileEarmarkText size={18} />
                },
                {
                  title: "Placement Guide Sheet",
                  desc: "Comprehensive guides, checklists for campus interviews, and answers structure formatting guidelines.",
                  link: "/guidance",
                  action: "View Guide Sheet",
                  icon: <BsShieldCheck size={18} />
                }
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    navigate(tool.link);
                  }}
                  className="bg-white dark:bg-[#111827]/50 border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-6 sm:p-7 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_24px_48px_-15px_rgba(16,185,129,0.12)] hover:border-emerald-300/60 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[260px] group"
                >
                  <div className='text-left space-y-3.5'>
                    <div className='bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100/10 group-hover:scale-105 transition-transform'>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 dark:text-white text-md tracking-tight">{tool.title}</h3>
                      <p className="text-gray-400 dark:text-gray-400 text-xs mt-1.5 leading-relaxed font-medium">{tool.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!userData) {
                        setShowAuth(true);
                        return;
                      }
                      navigate(tool.link);
                    }}
                    className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{tool.action}</span>
                    <HiChevronRight size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Granular & Advanced Features Breakdown */}
          <div className='mb-36'>
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                Under The Hood: <span className="text-[#00c853]">AI Core Engine</span>
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Granular feature mappings that deliver accurate placement assessment feedback.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {[
                {
                  title: "STAR Structured Answer Scoring",
                  desc: "Our AI scanner evaluates your technical and scenario responses to check if they are aligned with the STAR structure (Situation, Task, Action, Result). Gives specific scoring feedback.",
                  points: ["Checks behavioral structuring", "Scans for concrete deliverables", "Suggests STAR phrasing enhancements"]
                },
                {
                  title: "Adaptive Difficulty Questioning",
                  desc: "Our conversational logic dynamically tracks the candidate's proficiency. Answering questions brilliantly prompts the AI model to adapt and generate progressively challenging conceptual questions.",
                  points: ["4 difficulty tiers (Easy → Expert)", "Dynamic context parsing", "Reduces repetitive questions"]
                },
                {
                  title: "Tone & Acoustic Confidence Scan",
                  desc: "Simulates the metrics of voice-based HR screens. Scans user responses for confidence values, filler word percentages, and communication speed indices.",
                  points: ["Filler word density tracking", "Tone and coherence scores", "Actionable advice for speech pace"]
                },
                {
                  title: "Granular PDF Strengths Reports",
                  desc: "Generates download-ready performance reports capturing technical grades, strengths lists, areas of weaknesses, and custom study plans with resources.",
                  points: ["Comprehensive topic charts", "Insiders advice list", "Direct resource links for study"]
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white dark:bg-[#111827]/40 border border-gray-200/80 dark:border-gray-800/80 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between hover:shadow-md hover:border-emerald-500/20 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center border dark:border-emerald-900/30">
                        {i + 1}
                      </span>
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-md sm:text-lg tracking-tight">{feature.title}</h4>
                    </div>
                    <p className="text-gray-400 dark:text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800/80 space-y-2">
                    {feature.points.map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <BsCheck2Circle size={14} className="text-emerald-500 flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Advanced AI Capabilities */}
          <div className='mb-36'>
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                Advanced AI <span className="text-[#00c853]">Capabilities</span>
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Explore the key technologies powering wewithyou's mock dashboards.</p>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Provides granular scores on communications, technical concepts and confidence, with a highlight on ideal responses.",
                    link: "/interview"
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Resume Based Interview",
                    desc: "Simulates direct project viva grills. Extracts PDF text and generates customized questions based on parsed projects.",
                    link: "/interview"
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Downloadable PDF Report",
                    desc: "Export your results. Generates detailed reports outlining scores out of 10, positive areas, and estimated study readiness timelines.",
                    link: "/history"
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20} />,
                    title: "History & Analytics",
                    desc: "Visualize your preparation metrics. Track scores over time, retrieve past sheets, and view difficulty distributions.",
                    link: "/history"
                  }
                ].map((item, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      if (!userData) {
                        setShowAuth(true);
                        return;
                      }
                      navigate(item.link);
                    }}
                    className='bg-white dark:bg-[#111827]/50 border border-gray-150 dark:border-gray-800/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] hover:border-emerald-300/40 dark:hover:border-emerald-500/40 transition-all duration-300 cursor-pointer'
                  >
                    <div className='flex flex-col sm:flex-row items-center gap-6'>
                      <div className='w-full sm:w-2/5 flex justify-center'>
                        <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-48' />
                      </div>
 
                      <div className='w-full sm:w-3/5 text-left'>
                        <div className='bg-[#e8f5e9] text-[#2e7d32] dark:bg-emerald-950/20 dark:text-emerald-400 w-11 h-11 rounded-xl flex items-center justify-center mb-5 shadow-sm border border-emerald-100/10'>
                          {item.icon}
                        </div>
                        <h3 className='font-bold mb-2 text-lg text-gray-900 dark:text-white tracking-tight'>{item.title}</h3>
                        <p className='text-gray-400 dark:text-gray-450 text-xs sm:text-sm leading-relaxed font-medium'>{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* Multiple Interview Modes */}
          <div className='mb-24'>
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                Flexible Interview <span className="text-[#00c853]">Modes</span>
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Select your targeted mock formats and manage your session wallet credentials.</p>
            </div>

            <div className='grid md:grid-cols-2 gap-6 sm:gap-8'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Behavioral Mode",
                    desc: "Scans for leadership behaviors, culture alignment, situational conflict resolutions, and salary discussions.",
                    link: "/interview"
                  },
                  {
                    img: techImg,
                    title: "Core Technical Mode",
                    desc: "Evaluates algorithms, data structures, complexity analyses, databases, and language-specific fundamentals.",
                    link: "/interview"
                  },
                  {
                    img: confidenceImg,
                    title: "Confidence Metrics Scanner",
                    desc: "Analyzes response pauses, speech clarity, and structured STAR delivery models to assign a mock confidence grade.",
                    link: "/interview"
                  },
                  {
                    img: creditImg,
                    title: "Credit Session Wallet",
                    desc: "wewithyou operates on coins. Lock-in premium mock sessions. Refill credits easily inside the pricing grids.",
                    link: "/pricing"
                  }
                ].map((mode, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      if (!userData) {
                        setShowAuth(true);
                        return;
                      }
                      navigate(mode.link);
                    }}
                    className="bg-white dark:bg-[#111827]/50 border border-gray-150 dark:border-gray-800/80 rounded-[32px] p-6 sm:p-8 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] hover:border-emerald-300/40 dark:hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
                  >
                    <div className='flex items-center justify-between gap-6 text-left'>
                      <div className="w-3/5 space-y-2">
                        <h3 className="font-extrabold text-md sm:text-lg text-gray-900 dark:text-white tracking-tight">
                          {mode.title}
                        </h3>
                        <p className="text-gray-400 dark:text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
                          {mode.desc}
                        </p>
                      </div>

                      <div className="w-2/5 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
}

export default Home;
