import React, { useEffect } from 'react'
import { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/Step3Report'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaArrowLeft } from 'react-icons/fa';
import Logo from "../components/Logo";

function InterviewPage({ stepProp = 1 }) {
    const [step,setStep] = useState(stepProp)
    const { interviewData: reduxInterviewData } = useSelector(state => state.interview)
    const [localInterviewData, setLocalInterviewData] = useState(null)
    const interviewData = reduxInterviewData || localInterviewData
    const navigate = useNavigate()
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [pendingPath, setPendingPath] = useState("");

    useEffect(() => {
        if (step === 2) {
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
                e.returnValue = "Are you sure you want to leave the interview? Your progress will be lost.";
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
        if (step === 2) {
            setPendingPath(path);
            setShowLeaveModal(true);
        } else if (step === 3) {
            navigate("/history");
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

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-[#090d16] flex flex-col transition-colors duration-200'>
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

        <div className='flex-1'>
        {step===1 && (
            <Step1SetUp onStart={(data)=>{
                setLocalInterviewData(data);
            setStep(2)}}/>
        )}

         {(step===2 && interviewData) ? (
            <Step2Interview interviewData={interviewData}
            onFinish={(report)=>{setLocalInterviewData(report);
                setStep(3)
            }}
            />
        ) : step === 2 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-gray-500 mb-4">No interview session found. Please set up your interview first.</p>
                <button 
                    onClick={() => { setStep(1); navigate("/interview"); }}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl"
                >
                    Go to Setup
                </button>
            </div>
        ) : null}

          {step===3 && (
            <Step3Report report={interviewData}/>
        )}
        </div>

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
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leave Interview?</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            Are you sure you want to leave the interview? Your progress will be lost.
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
  )
}

export default InterviewPage
