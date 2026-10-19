import React from 'react'
import { BsLinkedin, BsGithub, BsInstagram, BsGlobe } from 'react-icons/bs'
import { motion } from "motion/react";
import Logo from "./Logo";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-[#f3f3f3] dark:bg-[#090d16] px-4 pb-12 pt-6 transition-colors duration-200'>
      <div className='w-full max-w-6xl mx-auto bg-white dark:bg-[#111827]/70 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800/40 overflow-hidden transition-colors duration-200'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 p-8 md:p-12'>
          
          {/* Column 1: Brand Info */}
          <div className='flex flex-col space-y-6'>
            <div className='flex items-center'>
              <Logo />
            </div>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
              AI-powered interview preparation platform designed to improve 
              communication skills, technical depth, and professional confidence.
            </p>
            <div className='flex items-center gap-3'>
              {[
                { icon: <BsInstagram size={18}/>, href: "#", label: "Instagram", hoverClass: "hover:text-[#E1306C] hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30" },
                { icon: <BsLinkedin size={18}/>, href: "#", label: "LinkedIn", hoverClass: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30" },
                { icon: <BsGithub size={18}/>, href: "#", label: "GitHub", hoverClass: "hover:text-[#181717] hover:bg-[#181717]/10 hover:border-[#181717]/30" },
                { icon: <BsGlobe size={18}/>, href: "#", label: "Portfolio", hoverClass: "hover:text-[#10B981] hover:bg-[#10B981]/10 hover:border-[#10B981]/30" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  className={`text-gray-400 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${social.hoverClass}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className='font-bold text-gray-900 dark:text-white mb-6'>Quick Links</h3>
            <ul className='space-y-4'>
              {[
                { label: "Home", href: "/" },
                { label: "Practice Interview", href: "/interview" },
                { label: "Interview History", href: "/history" },
                { label: "About Us", href: "#" }
              ].map((link, i) => (
                <li key={i}>
                  <a href={link.href} className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-all hover:translate-x-1 inline-block'>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className='font-bold text-gray-900 dark:text-white mb-6'>Resources</h3>
            <ul className='space-y-4'>
              {[
                "How It Works",
                "AI Interview Guide",
                "Resume Tips",
                "Career Advice"
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-all hover:translate-x-1 inline-block'>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className='font-bold text-gray-900 dark:text-white mb-6'>Contact</h3>
            <ul className='space-y-4'>
              <li>
                <a href="mailto:support@wewithyou.com" className='text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 text-sm font-medium transition-colors'>
                  support@wewithyou.com
                </a>
              </li>
              <li>
                <a href="#" className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-all hover:translate-x-1 inline-block'>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-all hover:translate-x-1 inline-block'>
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 px-8 py-6 md:px-12'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 dark:text-gray-500 text-xs font-medium'>
              © {currentYear} wewithyou. All rights reserved.
            </p>
            <div className='flex items-center gap-8'>
              <a href="#" className='text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white text-xs font-medium transition-colors'>Privacy Policy</a>
              <a href="#" className='text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white text-xs font-medium transition-colors'>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
