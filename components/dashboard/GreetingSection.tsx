import Image from "next/image"
import { useAuth } from "../../hooks/useAuth"
import { useEffect, useState, useRef } from "react"
import { JobService, AuthService } from "../../lib/api" // Pastikan AuthService diimport
import { useRouter } from "next/navigation"
import ConfirmationModal from "../ConfirmationModal"

interface GreetingSectionProps {
    refreshTrigger?: number
}

export default function GreetingSection ({ refreshTrigger = 0 }: GreetingSectionProps) {

    const { user, isAuthenticated, logout: contextLogout } = useAuth()
    const router = useRouter()
    
    // State Stats
    const [stats, setStats] = useState({
        openJobs: 0,
        closedJobs: 0,
        totalApplicants: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        confirmText: 'Logout',
        cancelText: 'Cancel',
        type: 'danger' as 'danger' | 'warning' | 'info'
    })
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')

    const openLogoutConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: true }))
    }

    const closeConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: false }))
    }

    const handleConfirm = async () => {
        setError('')
        setIsProcessing(true)

        try {
        // Client-side logout: clear storage
        const res = await AuthService.logout()
        if (!res.success) {
            setError(res.message || 'Logout failed')
            setIsProcessing(false)
            return
        }

        // Close modal and redirect
        closeConfirmation()
        router.push('/login')
        } catch (err: any) {
        console.error('Logout error:', err)
        setError(err?.message || 'Logout failed')
        } finally {
        setIsProcessing(false)
        }
    }

    useEffect(() => {
        if(!isAuthenticated) {
            setIsLoading(false)
            return
        }

        let isMounted = true

        const fetchStats = async () => {
            try {
                const response = await JobService.getStats()

                if(isMounted && response.success && response.data) {
                    setStats({
                        openJobs: response.data.openJobs,
                        closedJobs: response.data.closedJobs,
                        totalApplicants: response.data.totalApplicants
                    })
                }
            } catch (error) {
                console.error('Failed to fetch stats: ', error)
            } finally {
                if(isMounted){
                    setIsLoading(false)
                }
            }
        }

        fetchStats()

        return () => {
            isMounted = false
        } 
    }, [isAuthenticated, refreshTrigger])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if(hour >= 6 && hour < 12) return 'Morning'
        if(hour >= 12 && hour < 18) return 'Afternoon'
        return 'Evening'
    }

    if (isLoading) {
        return (
            <div className="relative w-full bg-[#1e1e1e] rounded-2xl pt-4 pb-12 px-4 lg:px-8">
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="relative w-full bg-[#1e1e1e] rounded-2xl pt-4 pb-12 px-4 lg:px-8 overflow-visible group/card"> 
                {/* Note: overflow-visible penting biar dropdown gak kepotong, tapi ati2 sama gradient */}
                
                {/* Gradient (dikasih overflow-hidden di wrapper parentnya gradient aja biar ga beleber) */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className='absolute w-[15%] h-[15%] left-[12%] top-[50%] bg-[#29C5EE] rounded-full blur-[50px] group-hover/card:left-[78%] group-hover/card:top-[40%] transition-all ease-in-out duration-700 opacity-50'/>
                    <div className='absolute w-[15%] h-[15%] left-[22%] top-[50%] bg-[#CF1A2C] rounded-full blur-[50px] group-hover/card:left-[68%] group-hover/card:top-[40%] transition-all ease-in-out duration-700 opacity-50'/>
                    <div className='absolute w-[15%] h-[15%] right-[12%] bottom-[40%] bg-[#EAB04D] rounded-full blur-[50px] group-hover/card:right-[70%] group-hover/card:bottom-[40%] transition-all ease-in-out duration-700 opacity-50'/>
                    <div className='absolute w-[15%] h-[15%] right-[22%] bottom-[40%] bg-[#19C8A7] rounded-full blur-[50px] group-hover/card:right-[58%] group-hover/card:bottom-[40%] transition-all ease-in-out duration-700 opacity-50'/>
                </div>

                {/* Card Content */}
                <div className="relative z-10">

                    {/* Navbar */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center">
                            <Image src="/images/logo.png" alt="logo" width={140} height={24} className="w-[100px] lg:w-[140px]" />
                        </div>

                        <div className="flex items-center justify-end gap-2 lg:gap-3">
                            <button className="p-1.5 lg:p-2 rounded-full bg-[#0a0a0a] hover:bg-[#151515] transition-colors cursor-pointer text-white">
                                <Image src="/icons/setting-button.png" alt="setting" width={20} height={20} className="w-4 lg:w-5" />
                            </button>

                            {/* Profile */}
                            <div className="relative group"> 
                                <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden cursor-pointer border-2 border-transparent group-hover:border-cyan-400 transition-all"> 
                                    <Image 
                                        src={user?.photo || "/icons/default-avatar.png"}
                                        alt="profile"
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                </button>

                                {/* Dropdown Content */}
                                <div className="absolute right-0 top-full w-64 bg-[#151515] border border-gray-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="px-4 py-2 border-b border-gray-800 mb-1">
                                        <p className="text-white text-md font-semibold truncate">{user?.name || 'User'}</p>
                                        <p className="text-gray-500 text-sm truncate">@{user?.username || 'username'}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={openLogoutConfirmation}
                                        className="w-full text-left px-4 py-2 text-md text-red-400 hover:bg-[#2a2a2a] hover:text-red-300 transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Stats & Title Content*/}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-0">
                        <div className="space-y-4 lg:space-y-6 lg:flex-1/3">
                            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-[#FFFFFF]">Good {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}</h2>
                            <p className="text-[#ffffff] text-base md:text-lg lg:text-xl">Track And Manage Your Recruitment Here! </p>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:items-center lg:justify-end gap-3 lg:gap-4 lg:flex-2/3 lg:pl-12">
                            {/* Job Open */}
                            <div className="bg-[#151515] backdrop-blur-sm rounded-2xl p-4 lg:max-w-[230px] lg:flex-1/3 flex items-center justify-between gap-6 lg:gap-12 ">
                                <div className="flex flex-col items-center gap-2 lg:gap-3">
                                    <div className="p-3 lg:p-4 rounded-full bg-[#1f1f1f]">
                                        <Image src="/icons/job-close.png" alt="job open" width={20} height={20} className="w-4 lg:w-5" />
                                    </div>
                                    <div className="text-[#8A8A8A] text-xs whitespace-nowrap">Job Open</div>
                                </div>
                                <div className="flex flex-col items-end gap-2 lg:gap-3">
                                    <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] leading-none">{stats.openJobs}</div>
                                    <div className="text-[#8a8a8a] mt-1 text-xs">Position</div>
                                </div>
                            </div>

                            {/* Job Close */}
                            <div className="bg-[#151515] backdrop-blur-sm rounded-2xl p-4 lg:max-w-[230px] lg:flex-1/3 flex items-center justify-between gap-6 lg:gap-12">
                                <div className="flex flex-col items-center gap-2 lg:gap-3">
                                    <div className="p-3 lg:p-4 rounded-full bg-[#1f1f1f]">
                                        <Image src="/icons/job-close.png" alt="job close" width={20} height={20} className="w-4 lg:w-5" />
                                    </div>
                                    <div className="text-[#8A8A8A] text-xs whitespace-nowrap">Job Close</div>
                                </div>
                                <div className="flex flex-col items-end gap-2 lg:gap-3">
                                    <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] leading-none">{stats.closedJobs}</div>
                                    <div className="text-[#8a8a8a] mt-1 text-xs">Position</div>
                                </div>
                            </div>

                            {/* Applicant */}
                            <div className="bg-[#151515] backdrop-blur-sm rounded-2xl p-4 lg:max-w-[230px] lg:flex-1/3 flex items-center justify-between gap-6 lg:gap-12">
                                <div className="flex flex-col items-center gap-2 lg:gap-3">
                                    <div className="p-3 lg:p-4 rounded-full bg-[#1f1f1f]">
                                        <Image src="/icons/applicant.png" alt="applicant" width={20} height={20} className="w-4 lg:w-5" />
                                    </div>
                                    <div className="text-[#8A8A8A] text-xs whitespace-nowrap">Applicant</div>
                                </div>
                                <div className="flex flex-col items-end gap-2 lg: gap-3">
                                    <div className="text-4xl lg:text-5xl font-bold text-[#ffffff] leading-none">{stats.totalApplicants}</div>
                                    <div className="text-[#8a8a8a] mt-1 text-xs">Candidate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <ConfirmationModal 
                isOpen={confirmation.isOpen}
                onClose={closeConfirmation}
                onConfirm={handleConfirm}
                title={confirmation.title}
                message={confirmation.message}
                confirmText={confirmation.confirmText}
                cancelText={confirmation.cancelText}
                type={confirmation.type as any}
            />
        </>
    )
}