import React from 'react';
import { motion } from "motion/react";
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaCloudUploadAlt,
    FaCheckCircle,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from '../utils/serverUrl';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { setInterviewData } from '../redux/interviewSlice';
import { jobRoles } from '../utils/jobRoles.js';

console.log("Initial ServerUrl check:", ServerUrl);

export default function Step1SetUp({ onStart }) {
    const {userData} = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("technical");
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState("medium");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [uploadError, setUploadError] = useState("");
    const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
    const roleRef = useRef(null);
    const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [showQuestionsDropdown, setShowQuestionsDropdown] = useState(false);
    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
    const questionsDropdownRef = useRef(null);
    const difficultyDropdownRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const experienceLevels = [
        "Fresher / 0 Years Experience",
        "0 \u2013 1 Years Experience (Entry Level)",
        "1 \u2013 3 Years Experience (Junior Level)",
        "3 \u2013 5 Years Experience (Mid Level)",
        "5 \u2013 10 Years Experience (Senior Level)",
        "10+ Years Experience (Expert / Leadership Level)"
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (roleRef.current && !roleRef.current.contains(event.target)) {
                setShowRoleSuggestions(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowExperienceDropdown(false);
            }
            if (questionsDropdownRef.current && !questionsDropdownRef.current.contains(event.target)) {
                setShowQuestionsDropdown(false);
            }
            if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(event.target)) {
                setShowDifficultyDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRoleChange = (value) => {
        console.log("Setting role to:", value);
        setRole(value);
        if (value.length > 0) {
            const filtered = jobRoles.filter(r => 
                r.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 8); // Show top 8 suggestions
            setFilteredRoles(filtered);
            setShowRoleSuggestions(true);
        } else {
            setFilteredRoles([]);
            setShowRoleSuggestions(false);
        }
    };


    const handleUploadResume = async (fileToUpload) => {
        const file = fileToUpload || resumeFile;
        if (!file || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", file)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })
            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);
            setAnalyzing(false);
        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setUploadError("");
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.type === "application/pdf") {
                setResumeFile(file);
                handleUploadResume(file);
            } else {
                setUploadError("Only PDF resumes are allowed.");
            }
        }
    };
    const [error, setError] = useState(null);

    const handleStart = async () => {
        if (!role || !experience || !mode) {
            setError("Please select role, experience level, and interview type.");
            return;
        }

        if (userData && userData.credits < 50) {
            setError("Insufficient credits. You need at least 50 credits to start an interview.");
            return;
        }
        
        setError(null);
        setLoading(true);
        console.log("DEBUG: Attempting to start interview with ServerUrl:", ServerUrl);
        console.log("DEBUG: Request Data:", { role, experience, mode, resumeText, projects, skills });
        
        try {
            const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , {role, experience, mode , resumeText, projects, skills, numQuestions, difficulty } , {withCredentials:true}) 
           
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           
           // Store interview data in Redux
           dispatch(setInterviewData(result.data));
           
           setLoading(false);
           // Navigate to interview session route
           navigate("/interview-session");
           
           if (onStart) onStart(result.data);

        } catch (error) {
            console.error("Error starting interview FULL:", error);
            console.error("Error response data:", error.response?.data);
            alert("DEBUG ERROR: " + (error.response?.data?.message || error.message));
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
            setLoading(false);
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='flex-1 flex items-center justify-center bg-[#f3f3f3] dark:bg-[#090d16] px-4 py-10 transition-colors duration-200'>

            <div className='w-full max-w-6xl bg-white dark:bg-[#111827]/80 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/40 grid md:grid-cols-2 overflow-hidden transition-colors duration-200'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-gradient-to-br from-green-50 to-green-100 dark:from-[#0a2318] dark:to-[#0c3123] p-6 sm:p-10 md:p-12 flex flex-col justify-center transition-colors duration-200'>

                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                        Start Your AI Interview
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-10">
                        Practice real interview scenarios powered by AI.
                        Improve communication, technical skills, and confidence.
                    </p>

                    <div className='space-y-5'>

                        {
                            [
                                {
                                    icon: <FaUserTie className="text-green-600 dark:text-emerald-400 text-xl" />,
                                    text: "Choose Role & Experience",
                                },
                                {
                                    icon: <FaMicrophoneAlt className="text-green-600 dark:text-emerald-400 text-xl" />,
                                    text: "Smart Voice Interview",
                                },
                                {
                                    icon: <FaChartLine className="text-green-600 dark:text-emerald-400 text-xl" />,
                                    text: "Performance Analytics",
                                },
                            ].map((item, index) => (
                                <motion.div key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.15 }}
                                    whileHover={{ scale: 1.03 }}
                                    className='flex items-center space-x-4 bg-white dark:bg-[#1f2937]/50 border border-gray-100 dark:border-gray-800/50 p-4 rounded-xl shadow-sm cursor-pointer transition-colors duration-200'>
                                    {item.icon}
                                    <span className='text-gray-700 dark:text-gray-300 font-medium'>{item.text}</span>

                                </motion.div>
                            ))
                        }
                    </div>

                </motion.div>



                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-6 sm:p-10 md:p-12 bg-white dark:bg-[#111827]/90 transition-colors duration-200">

                    <h2 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>
                        Interview SetUp
                    </h2>

                    <div className="flex justify-between items-center bg-green-50 dark:bg-emerald-950/30 text-green-700 dark:text-emerald-300 border border-green-100 dark:border-emerald-900/40 rounded-xl p-3.5 mb-6 text-xs font-semibold transition-colors duration-200">
                        <span>🎟️ Interview cost: 50 Credits</span>
                        <span>Available credits: {userData?.credits || 0}</span>
                    </div>


                    <div className='space-y-6'>

                        <div className='relative' ref={roleRef}>
                            <FaUserTie className='absolute top-4 left-4 text-gray-400 dark:text-gray-500 z-10' />

                            <input type='text' placeholder='Search your job role...'
                                className='w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1f2937]/50 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none transition'
                                onChange={(e) => handleRoleChange(e.target.value)} value={role} 
                                onFocus={() => role.length > 0 && setShowRoleSuggestions(true)}
                            />

                            {showRoleSuggestions && filteredRoles.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='absolute w-full mt-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden'
                                >
                                    {filteredRoles.map((r, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setRole(r);
                                                setShowRoleSuggestions(false);
                                            }}
                                            className='px-6 py-3 hover:bg-green-50 dark:hover:bg-emerald-900/30 hover:text-green-700 dark:hover:text-emerald-300 cursor-pointer transition text-sm text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-800 last:border-none flex items-center gap-3'
                                        >
                                            <FaUserTie className="text-gray-300 dark:text-gray-600 text-xs" />
                                            {r}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>


                        <div className='relative' ref={dropdownRef}>
                            <FaBriefcase className='absolute top-4 left-4 text-gray-400 dark:text-gray-500 z-10' />
                            
                            <div 
                                onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                                className='w-full pl-12 pr-10 py-3 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition cursor-pointer flex justify-between items-center bg-white dark:bg-[#1f2937]/50 text-gray-800 dark:text-gray-100'
                            >
                                <span className={experience ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}>
                                    {experience || 'Select Your Experience Level'}
                                </span>
                                <motion.div
                                    animate={{ rotate: showExperienceDropdown ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaChevronDown className='text-gray-400 dark:text-gray-500' />
                                </motion.div>
                            </div>

                            {showExperienceDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className='absolute w-full mt-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden'
                                >
                                    {experienceLevels.map((level, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setExperience(level);
                                                setShowExperienceDropdown(false);
                                            }}
                                            className='px-6 py-3 hover:bg-green-50 dark:hover:bg-emerald-900/30 hover:text-green-700 dark:hover:text-emerald-300 cursor-pointer transition text-sm text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-800 last:border-none'
                                        >
                                            {level}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <button
                                onClick={() => {
                                    console.log("Mode selected: technical");
                                    setMode("technical");
                                }}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium z-20 ${
                                    mode === "technical" 
                                    ? "border-green-500 bg-green-50 dark:bg-emerald-950/20 text-green-700 dark:text-emerald-400 shadow-sm" 
                                    : "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f2937]/30 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-700"
                                }`}
                            >
                                Technical Interview
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Mode selected: hr");
                                    setMode("hr");
                                }}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium z-20 ${
                                    mode === "hr" 
                                    ? "border-green-500 bg-green-50 dark:bg-emerald-950/20 text-green-700 dark:text-emerald-400 shadow-sm" 
                                    : "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f2937]/30 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-700"
                                }`}
                            >
                                HR Interview
                            </button>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-1.5 relative' ref={questionsDropdownRef}>
                                <label className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Questions Count</label>
                                <div 
                                    onClick={() => setShowQuestionsDropdown(!showQuestionsDropdown)}
                                    className='w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1f2937]/50 text-sm font-semibold text-gray-700 dark:text-gray-300 transition cursor-pointer flex justify-between items-center'
                                >
                                    <span>{numQuestions} Questions</span>
                                    <motion.div
                                        animate={{ rotate: showQuestionsDropdown ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaChevronDown className='text-gray-400 dark:text-gray-500 text-xs' />
                                    </motion.div>
                                </div>
                                {showQuestionsDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className='absolute w-full mt-1.5 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden top-[68px]'
                                    >
                                        {[5, 8, 10].map((val) => (
                                            <div
                                                key={val}
                                                onClick={() => {
                                                    setNumQuestions(val);
                                                    setShowQuestionsDropdown(false);
                                                }}
                                                className='px-4 py-2.5 hover:bg-green-50 dark:hover:bg-emerald-900/30 hover:text-green-700 dark:hover:text-emerald-300 cursor-pointer transition text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-800 last:border-none'
                                            >
                                                {val} Questions
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            <div className='flex flex-col gap-1.5 relative' ref={difficultyDropdownRef}>
                                <label className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Difficulty Mode</label>
                                <div 
                                    onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                                    className='w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1f2937]/50 text-sm font-semibold text-gray-700 dark:text-gray-305 transition cursor-pointer flex justify-between items-center'
                                >
                                    <span>
                                        {difficulty === "easy" ? "Easy" :
                                         difficulty === "medium" ? "Medium" :
                                         difficulty === "hard" ? "Hard" : "Expert / Advanced"}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: showDifficultyDropdown ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaChevronDown className='text-gray-400 dark:text-gray-500 text-xs' />
                                    </motion.div>
                                </div>
                                {showDifficultyDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className='absolute w-full mt-1.5 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden top-[68px]'
                                    >
                                        {[
                                            { value: "easy", label: "Easy" },
                                            { value: "medium", label: "Medium" },
                                            { value: "hard", label: "Hard" },
                                            { value: "expert", label: "Expert / Advanced" }
                                        ].map((opt) => (
                                            <div
                                                key={opt.value}
                                                onClick={() => {
                                                    setDifficulty(opt.value);
                                                    setShowDifficultyDropdown(false);
                                                }}
                                                className='px-4 py-2.5 hover:bg-green-50 dark:hover:bg-emerald-900/30 hover:text-green-700 dark:hover:text-emerald-300 cursor-pointer transition text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-800 last:border-none'
                                            >
                                                {opt.label}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {!analysisDone ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-5 transition-all duration-300 group ${
                                    isDragging 
                                    ? "border-green-500 bg-green-50 dark:bg-emerald-950/20 scale-[1.01]" 
                                    : "border-gray-200 dark:border-gray-800 hover:border-green-400 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-[#1f2937]/20"
                                } overflow-hidden min-h-[140px] flex items-center justify-center`}
                            >
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    className="hidden" 
                                    id="resumeUpload"
                                    onChange={(e) => {
                                        setUploadError("");
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.type === "application/pdf") {
                                                setResumeFile(file);
                                                handleUploadResume(file);
                                            } else {
                                                setUploadError("Only PDF resumes are allowed.");
                                            }
                                        }
                                    }}
                                />

                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <motion.div
                                        animate={isDragging ? { y: -5 } : { y: 0 }}
                                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                                        className="bg-green-100 dark:bg-emerald-950 p-2.5 rounded-full group-hover:bg-green-200 dark:group-hover:bg-emerald-900 transition-colors"
                                    >
                                        <FaCloudUploadAlt className="text-3xl text-green-600 dark:text-emerald-400" />
                                    </motion.div>

                                    <div className="text-center">
                                        <h3 className="text-base font-semibold text-gray-800 dark:text-white">Upload Resume</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Drag & drop your PDF here</p>
                                        <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-1 italic">PDF only (Max 5MB)</p>
                                    </div>

                                    {uploadError && (
                                        <p className="text-red-500 text-[10px] font-bold animate-pulse">{uploadError}</p>
                                    )}

                                    {analyzing ? (
                                        <div className="flex items-center gap-2 bg-gray-900 dark:bg-gray-800 text-white px-6 py-2 rounded-lg shadow-lg">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span className="font-medium text-xs">Analyzing...</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => document.getElementById("resumeUpload").click()}
                                            className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-850 hover:border-gray-300 dark:hover:border-gray-600 transition shadow-sm font-medium text-xs flex items-center gap-2 group-hover:scale-105"
                                        >
                                            <FaFileUpload size={14} />
                                            Upload PDF
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 dark:bg-emerald-950/20 border border-green-200 dark:border-emerald-900/40 rounded-2xl p-6 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-600 p-3 rounded-full text-white shadow-lg shadow-green-200 dark:shadow-none">
                                        <FaCheckCircle className="text-2xl" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-green-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                                            Resume Uploaded Successfully
                                        </h3>
                                        <p className="text-green-600 dark:text-emerald-400 text-sm truncate mt-1">
                                            File: <span className="font-medium underline">{resumeFile?.name || "Uploaded Resume"}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setAnalysisDone(false);
                                            setResumeFile(null);
                                        }}
                                        className="text-xs bg-white dark:bg-[#1f2937] border border-green-200 dark:border-gray-800 text-green-700 dark:text-emerald-400 px-3 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-emerald-900/30 transition font-bold border-solid"
                                    >
                                        Change Resume
                                    </button>
                                </div>

                                <div className="mt-6 space-y-4">
                                    {projects.length > 0 && (
                                        <div className="bg-white/50 dark:bg-[#111827]/40 rounded-xl p-4 border dark:border-gray-800/40">
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-emerald-400"></div>
                                                Extracted Projects
                                            </p>
                                            <ul className="grid grid-cols-1 gap-1">
                                                {projects.slice(0, 3).map((p, i) => (
                                                    <li key={i} className="text-xs text-gray-600 dark:text-gray-350 truncate bg-white dark:bg-[#1f2937]/50 border border-gray-100 dark:border-gray-800/40 px-3 py-2 rounded-lg">• {p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {skills.length > 0 && (
                                        <div className="bg-white/50 dark:bg-[#111827]/40 rounded-xl p-4 border dark:border-gray-800/40">
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-emerald-400"></div>
                                                Top Skills Identified
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.slice(0, 6).map((s, i) => (
                                                    <span key={i} className="bg-white dark:bg-[#1f2937]/80 border border-green-100 dark:border-gray-800/60 text-green-700 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}


                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 dark:text-red-400 text-center mb-4 font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {userData && userData.credits < 50 ? (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-750 dark:text-red-300 p-4 rounded-2xl text-xs flex flex-col items-center text-center">
                                <p className="font-bold text-red-800 dark:text-red-400">Insufficient Credits</p>
                                <p className="mt-0.5 text-red-600 dark:text-red-350">You need 50 credits to start an interview. Buy more credits to unlock.</p>
                                <button onClick={() => navigate("/pricing")} className="mt-2 font-bold underline cursor-pointer hover:text-red-800 dark:hover:text-red-400">Buy Credits Now</button>
                            </div>
                        ) : (
                            <motion.button
                                onClick={handleStart}
                                disabled={loading}
                                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                                className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 relative z-50 
                                    ${loading 
                                        ? 'bg-gray-400 dark:bg-gray-800 cursor-not-allowed opacity-50 text-gray-200' 
                                        : 'bg-gray-700 text-white hover:bg-green-600 hover:shadow-xl dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Starting...</span>
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </motion.button>
                        )}
                    </div>

                </motion.div>
            </div>

        </motion.div>
    )
}
