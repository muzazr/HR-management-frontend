'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Applicant } from '../../types/applicant'
import ConfirmationModal from '../ConfirmationModal'
import { useConfirmation } from '../../hooks/useConfirmation' 

interface CandidateDetailProps {
    applicant: Applicant
    isModal?: boolean
    onClose?:  () => void
    onUpdateCV?:  (applicantId: string, file: File) => void
    onDeleteApplicant?: (applicantId: string) => void
}

export default function CandidateDetail({
    applicant,
    isModal = false,
    onClose,
    onUpdateCV,
    onDeleteApplicant
}:  CandidateDetailProps) {
    const [isUpdateCVMode, setIsUpdateCVMode] = useState(false)
    const [newCVFile, setNewCVFile] = useState<File | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const { confirmation, showConfirmation, close: closeConfirmation, handleConfirm } = useConfirmation() 

    const skillsArray = applicant.skills
        ? applicant.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : []

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Only PDF files are allowed!')
                return
            }
            setNewCVFile(file)
        }
    }

    const handleUpdateCV = async () => {
        if (newCVFile && onUpdateCV) {
            setIsUpdating(true)
            try {
                await onUpdateCV(applicant.id, newCVFile)
                setNewCVFile(null)
                setIsUpdateCVMode(false)
            } finally {
                setIsUpdating(false)
            }
        }
    }

    const handleDelete = () => {
        showConfirmation(
            'Delete Applicant',
            `Are you sure you want to delete ${applicant.name}? This action cannot be undone.`,
            () => {
                onDeleteApplicant?.(applicant.id)
            },
            {
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger'
            }
        )
    }

    return (
        <>
            <div className="bg-[#151515] h-full overflow-y-auto no-scrollbar">
                
                {/* Header */}
                <div className={`top-0 p-6 flex items-center justify-between z-10 ${isModal ? '' : 'border-b-2'}`}>
                    <h2 className="text-3xl font-bold text-white">Candidate Details</h2>
                    {isModal && onClose && (
                        <button 
                            onClick={onClose}
                            className="p-2 md:p-3 rounded-full bg-[#1e1e1e] hover: bg-white/10 transition-colors cursor-pointer"
                        >
                            <Image 
                                src="/icons/cancel.png"
                                alt="close"
                                width={24}
                                height={24}
                            />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 pb-6 space-y-6">
                    
                    {/* Profile Card */}
                    <div className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="relative w-[25%] h-[25%] -left-[5%] -top-[5%] bg-[#CF1A2C] rounded-full blur-[75px]" />
                        </div>

                        <div className="relative p-4 space-y-6">
                            <div className="text-center">
                                <h3 className="text-2xl font-semibold text-white mb-1">{applicant.name}</h3>
                                <p className="text-base text-gray-400">{applicant.position}</p>
                                <p className="text-base text-gray-400">
                                    Match Job Score: <span className="text-[#19C8A7]">{applicant.score}</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-4 bg-[#262626] rounded-full">
                                        <Image 
                                            src="/icons/mail-modal.png"
                                            alt="email"
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-400 uppercase">Email</p>
                                        <p className="text-base text-white truncate">{applicant.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-4 bg-[#262626] rounded-full">
                                        <Image 
                                            src="/icons/phone.png"
                                            alt="phone"
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-400 uppercase">Phone Number</p>
                                        <p className="text-base text-white">{applicant.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {onUpdateCV && onDeleteApplicant && (
                                <div className="flex justify-center gap-6">
                                    <button 
                                        onClick={() => setIsUpdateCVMode(!isUpdateCVMode)}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#262626] hover:bg-[#2f2f2f] cursor-pointer rounded-2xl transition-colors"
                                        disabled={isUpdating}
                                    >
                                        <Image 
                                            src="/icons/update.png"
                                            alt="update"
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-base font-medium text-[#FFD928]/75">Update CV</span>
                                    </button>

                                    <button 
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#262626] hover:bg-[#2f2f2f] cursor-pointer rounded-2xl transition-colors"
                                        disabled={isUpdating}
                                    >
                                        <Image 
                                            src="/icons/trash.png"
                                            alt="delete"
                                            width={16}
                                            height={16}
                                        />
                                        <span className="text-base font-medium text-[#CF1A2C]/60">Delete Applicant</span>
                                    </button>
                                </div>
                            )}

                            {isUpdateCVMode && (
                                <div className="bg-[#151515] rounded-lg p-4 border">
                                    <label className="relative flex flex-col items-center justify-center min-h-[100px] border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                                        <input 
                                            type="file" 
                                            accept=".pdf"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            disabled={isUpdating}
                                        />
                                        <div className="text-center">
                                            <div className="p-4 mb-2 rounded-full flex items-center justify-center">
                                                <Image 
                                                    src="/icons/add.png"
                                                    alt="add"
                                                    height={30}
                                                    width={30}
                                                />
                                            </div>
                                            <p className="text-base font-bold text-white mb-2">Add Applicant CV</p>
                                        </div>
                                    </label>
                                    {newCVFile && (
                                        <div className="flex items-center gap-2 mt-3 mb-3">
                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-gray-300">{newCVFile.name}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleUpdateCV}
                                        disabled={!newCVFile || isUpdating}
                                        className="w-full px-4 py-2 mt-2 bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                                    >
                                        {isUpdating ? 'Processing...' : 'Confirm Update'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Card - STYLE TETAP SAMA */}
                    <div className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute w-[25%] h-[25%] -right-[5%] -top-[15%] bg-[#29C5EE] rounded-full blur-[60px]" />
                        </div>

                        <div className="relative p-4 space-y-4">
                            <h4 className="text-2xl font-semibold text-white">Skill</h4>
                            <div className="flex flex-wrap gap-2">
                                {skillsArray.length > 0 ? (
                                    skillsArray.map((skill, index) => (
                                        <span
                                            key={index}
                                            className='py-2 px-4 bg-[#262626] text-gray-300 text-base rounded-full'
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className='text-gray-500'>No skills listed</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Summary Card - STYLE TETAP SAMA */}
                    <div className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute w-[25%] h-[25%] -left-[5%] -bottom-[15%] bg-[#EAB04D] rounded-full blur-[60px]" />
                        </div>

                        <div className="relative p-4 space-y-4">
                            <h4 className="text-2xl font-semibold text-white">Summarize</h4>
                            <p className="text-base text-gray-300 leading-relaxed">
                                {applicant.summary}
                            </p>
                        </div>
                    </div>

                    {/* AI Analysis Card - STYLE TETAP SAMA */}
                    <div className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute w-[25%] h-[25%] -right-[10%] -bottom-[15%] bg-[#19C8A7] rounded-full blur-[60px]" />
                        </div>

                        <div className="relative p-4 space-y-4">
                            <h4 className="text-2xl font-semibold text-white">AI Analysis</h4>
                            <p className="text-base text-gray-300 leading-relaxed">
                                {applicant.aiAnalysis}
                            </p>
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
                type={confirmation.type}
            />
        </>
    )
}