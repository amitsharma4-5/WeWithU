import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../utils/serverUrl'
import { FaArrowLeft } from 'react-icons/fa'

function InterviewHistory() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const tabParam = queryParams.get('tab')

    const [activeTab, setActiveTab] = useState(tabParam === 'placements' ? 'placements' : 'interviews')
    const [interviews, setInterviews] = useState([])
    const [placements, setPlacements] = useState([])

    useEffect(() => {
        if (tabParam === 'placements' || tabParam === 'interviews') {
            setActiveTab(tabParam)
        }
    }, [tabParam])

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const intResult = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })
                setInterviews(intResult.data)
            } catch (error) {
                console.log("Error fetching standard interviews:", error)
            }

            try {
                const plcResult = await axios.get(ServerUrl + "/api/placement/my-tests", { withCredentials: true })
                setPlacements(plcResult.data)
            } catch (error) {
                console.log("Error fetching placement drives:", error)
            }
        }

        fetchHistory()
    }, [])


    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 dark:from-[#090d16] dark:to-[#0f2c20]/30 py-10 transition-colors duration-200' >
            <div className='w-full max-w-5xl px-4 md:px-6 mx-auto'>

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition border dark:border-gray-700 cursor-pointer'><FaArrowLeft className='text-gray-600 dark:text-gray-300' /></button>

                    <div>
                        <h1 className='text-3xl font-bold flex-nowrap text-gray-800 dark:text-white'>
                            Performance History
                        </h1>
                        <p className='text-gray-500 dark:text-gray-400 mt-2'>
                            Track your past mock interviews, placement drives, and report cards
                        </p>

                    </div>
                </div>

                {/* Tabs */}
                <div className='flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 mb-8 border-b border-gray-200 dark:border-gray-800 pb-px'>
                    <button
                        onClick={() => setActiveTab('interviews')}
                        className={`pb-3 text-base md:text-lg font-semibold border-b-2 transition-all px-2 cursor-pointer ${
                            activeTab === 'interviews'
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        Mock Interviews ({interviews.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('placements')}
                        className={`pb-3 text-base md:text-lg font-semibold border-b-2 transition-all px-2 cursor-pointer ${
                            activeTab === 'placements'
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        Placement Drives ({placements.length})
                    </button>
                </div>


                {activeTab === 'interviews' ? (
                    interviews.length === 0 ? (
                        <div className='bg-white dark:bg-[#111827]/70 p-10 rounded-2xl shadow dark:shadow-black/20 text-center border dark:border-gray-800/40'>
                            <p className='text-gray-500 dark:text-gray-400'>
                                No standard mock interviews found. Start your first interview.
                            </p>
                        </div>
                    ) : (
                        <div className='grid gap-6'>
                            {interviews.map((item, index) => (
                                <div key={index}
                                onClick={()=>navigate(`/report/${item._id}`)}
                                 className='bg-white dark:bg-[#111827]/70 p-6 rounded-2xl shadow-md dark:shadow-black/20 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800/40'>
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                {item.role}
                                            </h3>

                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                                {item.experience} • {item.mode}
                                            </p>

                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className='flex items-center gap-6'>
                                            {/* SCORE */}
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    {item.finalScore || 0}/10
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    Overall Score
                                                </p>
                                            </div>

                                            {/* STATUS BADGE */}
                                            <span
                                                className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "completed"
                                                        ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                                                        : "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    placements.length === 0 ? (
                        <div className='bg-white dark:bg-[#111827]/70 p-10 rounded-2xl shadow dark:shadow-black/20 text-center border dark:border-gray-800/40'>
                            <p className='text-gray-500 dark:text-gray-400'>
                                No placement exams found. Start your first 5-stage placement drive.
                            </p>
                        </div>
                    ) : (
                        <div className='grid gap-6'>
                            {placements.map((item, index) => (
                                <div key={index}
                                onClick={()=>navigate(`/placement-results/${item._id}`)}
                                 className='bg-white dark:bg-[#111827]/70 p-6 rounded-2xl shadow-md dark:shadow-black/20 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800/40'>
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                {item.targetRole}
                                                <span className="text-xs font-normal bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                                    {item.level} Level
                                                </span>
                                            </h3>

                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                                5-Stage Comprehensive AI Exam • Rating: {item.finalReport?.rating || "N/A"}
                                            </p>

                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className='flex items-center gap-6'>
                                            {/* SCORE */}
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    {item.finalReport?.overall_score || 0}/10
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    Overall Rating
                                                </p>
                                            </div>

                                            {/* STATUS BADGE */}
                                            <span
                                                className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "completed"
                                                        ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                                                        : "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

        </div>
    )
}

export default InterviewHistory
