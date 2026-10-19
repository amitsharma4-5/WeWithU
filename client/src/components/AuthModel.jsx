import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from "motion/react"
import { FaTimes } from "react-icons/fa";
import Auth from '../pages/Auth';

function AuthModel({onClose}) {
    const {userData} = useSelector((state)=>state.user)

    useEffect(()=>{
        if(userData){
            onClose()
        }

    },[userData , onClose])

  return (
    <motion.div 
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.2}}
    className='fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4'>
        <div className='relative w-full max-w-md'>
            <button 
                onClick={() => {
                    console.log("AuthModel close button clicked");
                    onClose();
                }} 
                className='absolute top-8 right-5 text-gray-800 hover:text-black text-xl z-[1002]'
            >
             <FaTimes size={18}/>
            </button>
            <Auth isModel={true}/>


        </div>

      
    </motion.div>
  )
}

export default AuthModel
