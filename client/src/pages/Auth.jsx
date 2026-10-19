import React from 'react';
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { ServerUrl } from '../utils/serverUrl';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import Logo from "../components/Logo";

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleGoogleAuth = async () => {
        console.log("handleGoogleAuth started");
        setLoading(true)
        try {
            const response = await signInWithPopup(auth,provider)
            console.log("Firebase signInWithPopup success:", response.user.email);
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            console.log("Backend auth success:", result.data);
            dispatch(setUserData(result.data))
            
            if(!isModel) {
                navigate("/")
            }
            
        } catch (error) {
            console.log("Auth error:", error)
            alert("Authentication failed: " + (error.response?.data?.message || error.message || "Unknown error"))
            dispatch(setUserData(null))
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex items-center justify-center px-6 py-20 transition-colors duration-200"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:0.25}}
        className={`
        w-full 
        ${isModel ? "max-w-md p-6 sm:p-8 rounded-3xl" : "max-w-lg p-6 sm:p-12 rounded-[32px]"}
        bg-white dark:bg-[#111827] shadow-2xl border border-gray-200 dark:border-gray-800 transition-colors duration-200
      `}>
            <div className='flex items-center justify-center mb-6'>
                <Logo />
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4 text-gray-900 dark:text-white'>
                Continue with
                <span className='bg-green-100 text-green-600 dark:bg-emerald-950/30 dark:text-emerald-400 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                    <IoSparkles size={16}/>
                    wewithyou AI
                </span>
            </h1>

            <p className='text-gray-500 dark:text-gray-400 text-center text-sm md:text-base leading-relaxed mb-8'>
                Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
            </p>

            <motion.button 
                onClick={handleGoogleAuth}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full flex items-center justify-center gap-3 py-3.5 bg-black text-white rounded-full shadow-lg transition-all font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'}`}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connecting...
                    </div>
                ) : (
                    <>
                        <FcGoogle size={22}/>
                        Continue with Google
                    </>
                )}
            </motion.button>
        </motion.div>

      
    </div>
  )
}

export default Auth
