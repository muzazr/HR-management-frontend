'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation' 

interface JobCardProps {
    jobId: string
    title: string
    location: string
    postedDays: number
    deadline: string
    min_education: string
    applicants: number
    cardColor: string
    status: boolean
}

export default function JobCard({
    jobId, 
    title,
    postedDays,
    location,
    min_education,
    applicants,
    deadline,
    cardColor
}: JobCardProps) {
    
    const router = useRouter()
    
    const gradientColors = {
        blue: '#29C5EE',
        red: '#CF1A2C',
        yellow: '#EAB04D',
        green: '#19C8A7',
    }

    const currentColor = gradientColors[cardColor as keyof typeof gradientColors]

    const formatDeadline = (dateString: string): string => {
        const date = new Date(dateString)
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
        return date.toLocaleDateString('en-GB', options)
    }

    const getDaysUntilDeadline = (dateString: string): number => {
        const now = new Date()
        const deadline = new Date(dateString)
        const diffTime = deadline.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysLeft = getDaysUntilDeadline(deadline)

    const handleCardClick = () => {
        router.push(`/dashboard/jobs/${jobId}`)
    }

    return (
        <div 
            onClick={handleCardClick}
            className="group relative bg-[#1e1e1e] rounded-2xl p-4 lg:p-5 overflow-hidden hover:bg-[#1a1a1a] transition-colors cursor-pointer"
        >
            
            {/* Gradient Blur */}
            <div className="absolute inset-0 pointer-events-none">
                <div 
                    className="absolute w-[20%] h-[20%] top-[10%] right-[10%] rounded-full blur-[60px] group-hover:top-[60%] group-hover:right-[70%] transition-all ease-in-out duration-700"
                    style={{ backgroundColor: currentColor }}
                />
                <div 
                    className="absolute w-[20%] h-full -left-[18%]"
                    style={{ backgroundColor: currentColor }}
                />
            </div>

            <div className="relative z-10">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                    <div className="flex items-center flex-1 min-w-0">
                        <div className="min-w-0">
                            <h3 className="text-[#ffffff] font-bold text-xl lg:text-2xl truncate">{title}</h3>
                            <p className="text-[#8A8A8A] text-xs lg:text-sm">Posted {postedDays} days ago</p>
                        </div>
                    </div>
                    <button 
                        // onClick={handleCardClick}
                        className="p-3 lg:p-4 rounded-full bg-[#ffffff]/10 hover:bg-[#2a2a2a] transition-colors flex-shrink-0 cursor-pointer"
                    >
                        <Image 
                            src="/icons/see-more.png"
                            alt='see more'
                            width={24}
                            height={24}
                            className="w-5 lg:w-6"
                        />
                    </button>
                </div>

                {/* Location + min_education */}
                <div className="flex flex-wrap items-center gap-2 mb-4 lg:mb-6">
                    <span className='bg-[#282828] py-1.5 lg:py-2 px-3 lg:px-4 flex items-center gap-1 text-[#898989] font-medium rounded-2xl text-xs'>
                        <Image 
                            src="/icons/location.png"
                            alt="location"
                            width={16}
                            height={16}
                            className="w-3. 5 lg:w-4 flex-shrink-0"
                        />
                        <span className="truncate">{location}</span>
                    </span>
                    <span className='bg-[#282828] py-1.5 lg:py-2 px-3 lg:px-4 flex items-center gap-1 text-[#898989] font-medium rounded-2xl text-xs'>
                        <Image 
                            src="/icons/education.png"
                            alt="education"
                            width={16}
                            height={16}
                            className="w-3.5 lg:w-4 flex-shrink-0"
                        />
                        <span className="truncate">{min_education}</span>
                    </span>
                </div>

                {/* Footer */}
                <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                        <div>
                            <span className="text-4xl lg:text-5xl font-bold text-white">{applicants}</span>
                            <span className="text-xs text-[#8A8A8A] ml-1">applicants</span>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-xs text-[#19C8A7] font-medium">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
                        </div>
                        <div className="text-xs text-[#8A8A8A] mt-1">
                            {formatDeadline(deadline)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}