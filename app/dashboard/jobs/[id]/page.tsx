'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import CandidateDetailModal from '../../../../components/applicant/CandidateDetailModal'

interface Applicant {
    id: number
    name: string
    email:  string
    phone: string
    skills: string[]
    score:  number
    summary: string
    aiAnalysis: string
    position?: string
}

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.id as string

    const [uploadedCVs, setUploadedCVs] = useState<File[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

    const [applicants] = useState<Applicant[]>([
        {
            id:  1,
            name: 'Muhammad Zaki Azhar',
            email: 'zakiazhar04@gmail.com',
            phone: '+62 812-3456-7890',
            skills: ['UI/UX', 'Figma', 'Prototyping'],
            score: 10,
            position: 'Sr. UX Designer',
            summary: 'Experienced UX designer with 5 years of expertise in mobile and web applications. Led the redesign of the booking process for Airbnb\'s mobile app, resulting in a 30% increase in conversion rates and improved user satisfaction.',
            aiAnalysis: 'Strong match for the role. Candidate demonstrates excellent design thinking skills and has proven track record of improving user experience metrics.  Communication skills are outstanding based on portfolio presentation.'
        },
        {
            id: 2,
            name: 'Muhammad Najmi Azhar',
            email: 'zakiazhar04@gmail.com',
            phone: '+62 812-3456-7890',
            skills: ['UI/UX', 'Figma', 'Prototyping'],
            score: 9.5,
            position: 'UX Designer',
            summary: 'Experienced UX designer with 5 years.. .',
            aiAnalysis: 'Strong match for the role.. .'
        },
        {
            id: 3,
            name: 'Muhammad Iqbal Hilmi',
            email: 'zakiazhar04@gmail.com',
            phone: '+62 812-3456-7890',
            skills: ['UI/UX', 'Figma', 'Prototyping'],
            score: 9.73,
            position: 'Product Designer',
            summary: 'Experienced UX designer with 5 years.. .',
            aiAnalysis: 'Strong match for the role...'
        },
        {
            id: 4,
            name: 'Muhammad Iqbal Hilmi',
            email: 'zakiazhar04@gmail.com',
            phone: '+62 812-3456-7890',
            skills: ['UI/UX', 'Figma', 'Prototyping'],
            score:  9.73,
            position: 'UI Designer',
            summary: 'Experienced UX designer with 5 years.. .',
            aiAnalysis: 'Strong match for the role...'
        },
    ])

    const job = {
        id: jobId,
        title: 'Growth Manager',
        location: 'Remote',
        requirement: 'Bachelor Degree',
        deadline: '2026-01-17',
        skills: 'Marketing, Analytics, Growth Hacking, SEO',
        applicants: applicants.length,
        status: true
    }

    const displayedApplicants = useMemo(() => {
        const sortedWithRanking = [... applicants]
            .sort((a, b) => b.score - a.score)
            .map((applicant, index) => ({
                ...applicant,
                originalRank: index + 1
            }))

        if (searchQuery. trim()) {
            return sortedWithRanking.filter(applicant => 
                applicant.name. toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        
        return sortedWithRanking
    }, [applicants, searchQuery])

    const handleFileUpload = (e: React. ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            setUploadedCVs(prev => [...prev, ...Array.from(files)])
        }
    }

    const removeCV = (index: number) => {
        setUploadedCVs(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        console.log('Submitting CVs:', uploadedCVs)
        setUploadedCVs([])
    }

    // ✅ NEW: Modal handlers
    const handleUpdateCV = (applicantId: number, file: File) => {
        console.log(`Updating CV for applicant ${applicantId}: `, file.name)
        // TODO: API call
    }

    const handleDeleteApplicant = (applicantId:  number) => {
        console. log(`Deleting applicant ${applicantId}`)
        // TODO: API call
        setSelectedApplicant(null)
    }

    return (
        <div className="min-h-screen bg-[#151515] px-4 lg:px-8 py-4 lg:py-8">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 bg-[#1e1e1e] rounded-2xl p-4">
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white">{job.title}</h1>

                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-white font-medium text-sm md:text-base lg:text-lg">Edit Job</span>
                </button>
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                
                {/* Upload Area */}
                <div className="relative bg-[#1e1e1e] rounded-2xl p-8 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute w-[25%] h-[25%] left-[23%] top-[40%] bg-[#29C5EE] rounded-full blur-[75px]" />
                        <div className="absolute w-[25%] h-[25%] right-[23%] top-[40%] bg-[#CF1A2C] rounded-full blur-[75px]" />
                    </div>                   

                    <label className="relative flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                        <input 
                            type="file" 
                            accept=".pdf"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                <Image 
                                    src="/icons/add.png"
                                    alt="add"
                                    height={45}
                                    width={45}
                                />
                            </div>
                            <p className="text-xl font-bold text-white mb-2">Add Applicant CV</p>
                            <p className="text-sm text-gray-400">Click to upload PDF files (multiple files supported)</p>
                        </div>
                    </label>
                </div>

                {/* Uploaded CVs */}
                <div className="relative bg-[#1e1e1e] rounded-2xl p-6 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute w-[25%] h-[25%] left-[23%] top-[40%] bg-[#EAB04D] rounded-full blur-[75px]" />
                        <div className="absolute w-[25%] h-[25%] right-[23%] top-[40%] bg-[#19C8A7] rounded-full blur-[75px]" />
                    </div>   

                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Applicant CV ({uploadedCVs.length})
                        </h3>
                        
                        <div className="max-h-[240px] overflow-y-auto mb-4 grid grid-cols-2 gap-2 no-scrollbar">
                            {uploadedCVs.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-[#151515] rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <Image 
                                            src="/icons/file.png"
                                            alt="file"
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-sm text-white truncate">{file.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => removeCV(index)}
                                        className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={uploadedCVs.length === 0}
                            className="w-full px-6 py-3 bg-[#151515] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#272727]">
                <h2 className="text-xl font-semibold text-white">Applicant</h2>
                <div className="relative bg-[#242424] hover:bg-[#1f1f1f] rounded-2xl">
                    <input 
                        type="text"
                        placeholder="Search for Applicant"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 lg:pl-12 pr-4 py-2 w-full lg:w-[275px] bg-transparent text-xs text-white placeholder: text-[#8A8A8A] focus:outline-none focus:border-white focus:rounded-2xl"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Applicants Table */}
            <div className="bg-[#1e1e1e] rounded-2xl px-6 py-4">
                <div className="overflow-x-auto">
                    {/* Header */}
                    <div className="bg-[#262626] rounded-2xl px-4 py-4 mb-1">
                        <div className="flex justify-between">
                            <div className="text-center text-sm font-medium text-gray-400 flex-1/10">Ranking</div>
                            <div className="text-center text-sm font-medium text-gray-400 flex-4/10">Name</div>
                            <div className="text-center text-sm font-medium text-gray-400 flex-4/10">Email</div>
                            <div className="text-center text-sm font-medium text-gray-400 flex-1/10">Score</div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="overflow-x-auto">
                        {displayedApplicants.map((applicant) => (
                            <div 
                                key={applicant. id}
                                onClick={() => setSelectedApplicant(applicant)}
                                className="flex justify-between py-4 px-4 hover:bg-[#151515] cursor-pointer transition-colors rounded-lg"
                            >
                                <div className="text-center text-white flex-1/10">{applicant.originalRank}</div>
                                <div className="text-center text-white flex-4/10">{applicant.name}</div>
                                <div className="text-center text-white flex-4/10">{applicant.email}</div>
                                <div className="text-center text-white flex-1/10 font-semibold">{applicant.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ✅ NEW: Modal */}
            <CandidateDetailModal 
                isOpen={selectedApplicant !== null}
                onClose={() => setSelectedApplicant(null)}
                applicant={selectedApplicant}
                onUpdateCV={handleUpdateCV}
                onDeleteApplicant={handleDeleteApplicant}
            />
        </div>
    )
}