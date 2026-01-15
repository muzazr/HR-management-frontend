'use client'

import CandidateDetail from './CandidateDetail'

interface Applicant {
    id: number
    name: string
    email:  string
    phone:  string
    skills: string[]
    score: number
    summary: string
    aiAnalysis: string
    position?:  string
}

interface CandidateDetailModalProps {
    isOpen: boolean
    onClose: () => void
    applicant: Applicant | null
    onUpdateCV: (applicantId: number, file: File) => void
    onDeleteApplicant: (applicantId:  number) => void
}

export default function CandidateDetailModal({
    isOpen,
    onClose,
    applicant,
    onUpdateCV,
    onDeleteApplicant
}: CandidateDetailModalProps) {
    if (!isOpen || !applicant) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container - FIXED WIDTH */}
            <div 
                className="relative h-full animate-slide-in-right"
                style={{ width: '700px', maxWidth: '90vw' }}
            >
                <CandidateDetail 
                    applicant={applicant}
                    isModal={true}
                    onClose={onClose}
                    onUpdateCV={onUpdateCV}
                    onDeleteApplicant={onDeleteApplicant}
                />
            </div>
        </div>
    )
}