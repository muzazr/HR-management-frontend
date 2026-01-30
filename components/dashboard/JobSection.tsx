'use client'

import { useState } from "react"
import JobGrid from "./JobGrid"

interface JobSectionProps {
    onJobUpdate: () => void
}

/**
 * JobSection
 * - Kontainer UI untuk bagian "Jobs" di dashboard.
 * - Menyediakan kontrol sorting, pencarian, dan memanggil JobGrid untuk render card.
 * Catatan:
 * - Tidak melakukan fetch sendiri, meneruskan ke JobGrid.
 * - Komponen fokus pada state UI (sort, search, dropdown).
 */
export default function JobSection({ onJobUpdate } : JobSectionProps) {
    // State: opsi sorting yang dipilih
    const [sortBy, setSortBy] = useState('Latest')
    // State: query untuk filter client-side
    const [searchQuery, setSearchQuery] = useState('')
    // State: kontrol visibility dropdown sorting
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // Opsi sorting yang tersedia (sesuaikan label dengan implementasi di JobGrid)
    const sortOptions = ['Latest', 'Oldest', 'Most Applicants', 'Closing Soon']

    return (
        <section className="mt-8">
            {/* Header:  Title + Filter + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-6 pb-4 border-b border-gray-800/50">
                
                {/* Left:  Title */}
                <h2 className="text-xl text-white">Jobs</h2>

                {/* Right: Filter + Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                    
                    {/* Sort Filter Dropdown */}
                    <div className="relative bg-[#1e1e1e] rounded-2xl">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-transparent text-[#8A8A8A] text-xs hover:text-white transition-colors lg:max-w-[140px]"
                        >
                            <span className="truncate">Sort By: {sortBy}</span>
                            <svg 
                                className={`w-4 h-4 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-48 bg-[#1e1e1e] border border-gray-800/50 rounded-lg shadow-lg overflow-hidden z-50">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSortBy(option)
                                            setIsDropdownOpen(false)
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                            sortBy === option 
                                                ? 'bg-gray-800/50 text-white' 
                                                : 'text-[#8A8A8A] hover:bg-gray-800/30 hover:text-white'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="relative bg-[#1e1e1e] rounded-2xl">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg 
                                className="w-4 lg:w-5 h-4 lg:h-5 text-[#8A8A8A]" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for jobs, candidates and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 lg:pl-12 pr-4 py-2 w-full lg:w-[275px] bg-transparent text-xs text-white placeholder:text-[#8A8A8A] focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Job Cards Grid
                - Meneruskan state sortBy dan searchQuery ke JobGrid.
                - onJobUpdate digunakan untuk memberi tahu parent saat ada penambahan/ubah job.
            */}
            <JobGrid sortBy={sortBy} searchQuery={searchQuery} onJobUpdate={onJobUpdate} />
        </section>
    )
}