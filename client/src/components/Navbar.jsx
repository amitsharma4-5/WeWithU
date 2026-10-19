import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsCoin, BsSun, BsMoonStars } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut, FaBars, FaTimes } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../utils/serverUrl';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
import Logo from './Logo';

function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [pendingPath, setPendingPath] = useState("");
    
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    };

    const handleNav = (path) => {
        if (window.isTestInProgress) {
            setPendingPath(path);
            setShowLeaveModal(true);
        } else {
            if (path === "logout") {
                handleLogout();
            } else {
                navigate(path);
            }
        }
    };

    const handleConfirmLeave = () => {
        window.isTestInProgress = false;
        setShowLeaveModal(false);
        if (pendingPath === "logout") {
            handleLogout();
        } else {
            navigate(pendingPath);
        }
    };

    const handleCancelLeave = () => {
        setShowLeaveModal(false);
        setPendingPath("");
    };

  return (
    <div className='bg-[#f3f3f3] dark:bg-[#090d16] flex justify-center px-4 pt-6 w-full relative z-50 transition-colors duration-200'>
        <motion.div 
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration: 0.3}}
        className='w-full max-w-[95%] bg-white/70 dark:bg-[#111827]/70 backdrop-blur-md rounded-[24px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_-15px_rgba(0,0,0,0.5)] border border-white/40 dark:border-gray-800/40 px-8 py-4 flex justify-between items-center relative transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.18)] hover:border-emerald-300/40 dark:hover:border-emerald-500/30'>
            <div onClick={()=>handleNav("/")} className='flex items-center cursor-pointer transition-transform duration-300 hover:scale-105'>
                <Logo />
            </div>

            {/* Desktop Navigation Links */}
            <div className='hidden lg:flex items-center gap-14 xl:gap-18 text-sm xl:text-base font-extrabold text-gray-600 dark:text-gray-300'>
                <button onClick={()=>{ if(!userData){ setShowAuth(true); return; } handleNav("/placement-test"); }} className='hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 hover:after:w-full after:transition-all after:duration-300'>Placement Exam</button>
                <button onClick={()=>{ if(!userData){ setShowAuth(true); return; } handleNav("/roadmap"); }} className='hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 hover:after:w-full after:transition-all after:duration-300'>Roadmaps</button>
                <button onClick={()=>{ if(!userData){ setShowAuth(true); return; } handleNav("/company-prep"); }} className='hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 hover:after:w-full after:transition-all after:duration-300'>Company Preparation</button>
                <button onClick={()=>{ if(!userData){ setShowAuth(true); return; } handleNav("/resume-tips"); }} className='hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 hover:after:w-full after:transition-all after:duration-300'>ATS Checker</button>
                <button onClick={()=>{ if(!userData){ setShowAuth(true); return; } handleNav("/guidance"); }} className='hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 hover:after:w-full after:transition-all after:duration-300'>Guidance</button>
            </div>

            <div className='flex items-center gap-2 sm:gap-3 md:gap-4 relative flex-shrink-0'>
                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={() => {
                        setShowMobileMenu(!showMobileMenu);
                        setShowCreditPopup(false);
                        setShowUserPopup(false);
                    }}
                    className='lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer flex items-center justify-center'
                    title="Toggle Menu"
                >
                    {showMobileMenu ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>

                <button
                    onClick={() => {
                        if (!userData) {
                            setShowAuth(true);
                            return;
                        }
                        handleNav("/interview");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-full text-xs md:text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer hidden sm:block"
                >
                    Start Interview
                </button>

                {/* Dark/Light mode switcher */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer flex items-center justify-center hidden sm:flex"
                    title="Toggle Theme"
                >
                    {theme === "dark" ? <BsSun size={18} /> : <BsMoonStars size={18} />}
                </button>

                <div className='relative hidden sm:block'>
                    <button onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }} className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-md hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer'>
                        <BsCoin size={20} className="text-yellow-500"/>
                        {userData?.credits || 0}
                    </button>

                    {showCreditPopup && (
                        <div className='absolute right-[-50px] mt-3 w-64 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 rounded-xl p-5 z-[100] text-gray-800 dark:text-gray-200'>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>Need more credits to continue interviews?</p>
                            <button onClick={()=>{ handleNav("/pricing"); setShowCreditPopup(false); }} className='w-full bg-black dark:bg-emerald-600 text-white py-2 rounded-lg text-sm cursor-pointer hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors'>Buy more credits</button>
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                        onClick={()=>{
                            if(!userData){
                                setShowAuth(true)
                                return;
                            }
                            setShowUserPopup(!showUserPopup);
                            setShowCreditPopup(false)
                        }} 
                        className='w-9 h-9 bg-black dark:bg-gray-800 text-white rounded-full flex items-center justify-center font-semibold cursor-pointer hover:bg-emerald-600 dark:hover:bg-emerald-600 transition-colors'
                    >
                        {userData ? (userData?.name ? userData.name.slice(0,1).toUpperCase() : 'U') : <FaUserAstronaut size={16}/>}
                    </button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-52 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 rounded-xl p-4 z-[100] text-gray-800 dark:text-gray-200'>
                            <p className='text-md text-emerald-600 dark:text-emerald-400 font-semibold mb-2 border-b dark:border-gray-800 pb-1 truncate'>{userData?.name}</p>
                            <button onClick={()=>{ handleNav("/history?tab=interviews"); setShowUserPopup(false); }} className='w-full text-left text-sm py-2 hover:text-black dark:hover:text-white text-gray-600 dark:text-gray-400 cursor-pointer transition-colors hover:font-semibold'>Interview History</button>
                            <button onClick={()=>{ handleNav("/history?tab=placements"); setShowUserPopup(false); }} className='w-full text-left text-sm py-2 hover:text-black dark:hover:text-white text-gray-600 dark:text-gray-400 cursor-pointer transition-colors hover:font-semibold'>Placement History</button>
                            <button onClick={() => handleNav("logout")} 
                            className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-500 border-t dark:border-gray-800 mt-1 pt-2 cursor-pointer transition-colors hover:font-semibold'>
                                <HiOutlineLogout size={16}/>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {showMobileMenu && (
                <motion.div 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className='absolute top-[calc(100%+12px)] left-4 right-4 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800/80 p-5 flex flex-col gap-4 z-[99] lg:hidden text-left'
                >
                    {/* User profile & credits card */}
                    {userData && (
                        <div className='flex items-center justify-between p-3 bg-gray-55/35 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800/60 mb-2'>
                            <div className='flex items-center gap-2.5'>
                                <div className='w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm'>
                                    {userData.name ? userData.name.slice(0,1).toUpperCase() : 'U'}
                                </div>
                                <div className='truncate max-w-[130px]'>
                                    <p className='text-xs font-bold text-gray-800 dark:text-gray-200'>{userData.name}</p>
                                    <p className='text-[10px] text-gray-400 dark:text-gray-500'>Logged In</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-1 bg-yellow-500/10 dark:bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/25 text-[10px] font-extrabold'>
                                <BsCoin size={13} />
                                {userData.credits || 0} Credits
                            </div>
                        </div>
                    )}

                    {/* Start Interview CTA button inside Mobile Menu */}
                    <button 
                        onClick={() => { 
                            setShowMobileMenu(false); 
                            if (!userData) { setShowAuth(true); return; } 
                            handleNav("/interview"); 
                        }} 
                        className='sm:hidden w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition cursor-pointer text-sm mb-2'
                    >
                        Start Interview 🚀
                    </button>

                    {/* Navigation Links */}
                    <div className='flex flex-col gap-1 border-b dark:border-gray-800 pb-3'>
                        <button onClick={()=>{ setShowMobileMenu(false); if(!userData){ setShowAuth(true); return; } handleNav("/placement-test"); }} className='w-full text-left font-bold py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer text-sm'>Placement Exam</button>
                        <button onClick={()=>{ setShowMobileMenu(false); if(!userData){ setShowAuth(true); return; } handleNav("/roadmap"); }} className='w-full text-left font-bold py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer text-sm'>Roadmaps</button>
                        <button onClick={()=>{ setShowMobileMenu(false); if(!userData){ setShowAuth(true); return; } handleNav("/company-prep"); }} className='w-full text-left font-bold py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer text-sm'>Company Preparation</button>
                        <button onClick={()=>{ setShowMobileMenu(false); if(!userData){ setShowAuth(true); return; } handleNav("/resume-tips"); }} className='w-full text-left font-bold py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer text-sm'>ATS Checker</button>
                        <button onClick={()=>{ setShowMobileMenu(false); if(!userData){ setShowAuth(true); return; } handleNav("/guidance"); }} className='w-full text-left font-bold py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer text-sm'>Guidance</button>
                    </div>

                    {/* Dark/Light mode selector row in Mobile Menu */}
                    <div className='flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 sm:hidden'>
                        <span>Toggle Theme</span>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer flex items-center justify-center"
                            title="Toggle Theme"
                        >
                            {theme === "dark" ? <BsSun size={18} /> : <BsMoonStars size={18} />}
                        </button>
                    </div>

                    {/* Log out option inside Mobile Drawer for logged in user */}
                    {userData && (
                        <button 
                            onClick={() => { setShowMobileMenu(false); handleNav("logout"); }}
                            className='sm:hidden w-full text-left font-bold py-2.5 px-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all cursor-pointer text-sm flex items-center gap-2'
                        >
                            <HiOutlineLogout size={16}/>
                            Logout
                        </button>
                    )}
                </motion.div>
            )}
        </motion.div>

        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
        
        {/* Custom Leave Test Confirmation Modal */}
        {showLeaveModal && (
            <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 pt-12 md:pt-16">
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-6 text-center"
                >
                    <div className="mx-auto w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center text-2xl">
                        ⚠️
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {window.location.pathname.includes("placement") ? "Leave Placement Test?" : "Leave Interview?"}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            {window.location.pathname.includes("placement") 
                                ? "Are you sure you want to leave the placement test? Your progress will be lost."
                                : "Are you sure you want to leave the interview? Your progress will be lost."}
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

export default Navbar
