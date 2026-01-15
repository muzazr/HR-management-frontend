'use client'

import { useState, FormEvent } from 'react'

interface AddJobModalProps {
    isOpen: boolean
    onClose:  () => void
    onSubmit: (job: {
        title: string
        location: string
        requirement: string
        skills: string  // TAMBAHAN
        deadline: string
    }) => void
}

export default function AddJobModal({ isOpen, onClose, onSubmit }:  AddJobModalProps) {
    const [formData, setFormData] = useState({
        title:  '',
        location: '',
        requirement: '',
        skills: '',  // TAMBAHAN
        deadline:  '',
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        
        // Validation
        if (!formData.title || !formData.location || !formData.requirement || !formData.skills || !formData.deadline) {
            alert('Please fill all fields!')
            return
        }

        onSubmit(formData)
        
        // Reset form
        setFormData({
            title: '',
            location: '',
            requirement:  '',
            skills: '',  // TAMBAHAN
            deadline:  '',
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <div className="relative bg-[#1e1e1e] rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar border border-gray-800/50 shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add New Job</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full bg-[#ffffff]/10 hover:bg-[#ffffff]/20 transition-colors"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Senior UX Designer"
                            className="w-full px-4 py-3 bg-[#151515] border border-gray-800/50 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-colors"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData. location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e. target.value }))}
                            placeholder="e.g.  Bengaluru, Remote, Mumbai"
                            className="w-full px-4 py-3 bg-[#151515] border border-gray-800/50 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-colors"
                            required
                        />
                    </div>

                    {/* Requirement (Education) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Minimum Education <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={formData.requirement}
                                onChange={(e) => setFormData(prev => ({ ... prev, requirement: e.target. value }))}
                                className="w-full px-4 py-3 pr-12 bg-[#151515] border border-gray-800/50 rounded-lg text-white focus:outline-none focus:border-gray-700 transition-colors appearance-none cursor-pointer"
                                required
                            >
                                <option value="" disabled className="text-gray-600">Select education level</option>
                                <option value="High School">High School</option>
                                <option value="Associate Degree">Associate Degree</option>
                                <option value="Bachelor Degree">Bachelor Degree</option>
                                <option value="Master Degree">Master Degree</option>
                                <option value="Doctoral Degree">Doctoral Degree</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Required Skills - TAMBAHAN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Required Skills <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData. skills}
                            onChange={(e) => setFormData(prev => ({ ...prev, skills: e. target.value }))}
                            placeholder="e.g. Marketing, Analytics, Growth Hacking, SEO, Data Analysis"
                            rows={3}
                            className="w-full px-4 py-3 bg-[#151515] border border-gray-800/50 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-colors resize-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate skills with commas. AI will use this to score applicants.
                        </p>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Application Deadline <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 pr-12 bg-[#151515] border border-gray-800/50 rounded-lg text-white focus:outline-none focus: border-gray-700 transition-colors
                                [&::-webkit-calendar-picker-indicator]:opacity-0
                                [&::-webkit-calendar-picker-indicator]:absolute
                                [&::-webkit-calendar-picker-indicator]:right-0
                                [&::-webkit-calendar-picker-indicator]:w-full
                                [&::-webkit-calendar-picker-indicator]:h-full
                                [&: :-webkit-calendar-picker-indicator]:cursor-pointer"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-[#151515] hover:bg-[#000000] text-white font-semibold rounded-lg transition-all"
                        >
                            Create Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}