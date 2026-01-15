'use client'

import { useState, useMemo } from 'react'
import JobCard from './JobCard'
import AddJobCard from './AddJobCard'
import AddJobModal from './AddJobModal'

interface Job {
    id: string  // UBAH: Jadi string untuk ID random
    title: string
    location: string
    requirement: string
    applicants: number
    deadline: string  // Format: "2026-01-17" (ISO date string)
    createdAt: string  // Format: "2026-01-11T00:00:00Z"
    status: boolean
}

interface JobGridProps {
    sortBy:  string
    searchQuery: string
}

export default function JobGrid({ sortBy, searchQuery }: JobGridProps) {
    
    // STATE:  Modal & Jobs Data
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [jobs, setJobs] = useState<Job[]>([
        {
            id: 'job-001',
            title: 'Sr. UX Designer',
            location: 'Bengaluru',
            requirement: 'Bachelor Degree',
            applicants: 45,
            deadline: '2026-01-17',
            createdAt: '2026-01-11T00:00:00Z',
            status:  true
        },
        {
            id: 'job-002',
            title: 'Growth Manager',
            location: 'Remote',
            requirement: 'Bachelor Degree',
            applicants:  38,
            deadline: '2026-01-06',
            createdAt: '2026-01-08T00:00:00Z',
            status: true
        },
        {
            id: 'job-003',
            title: 'Financial Analyst',
            location: 'Mumbai',
            requirement: 'Master Degree',
            applicants:  25,
            deadline: '2026-01-14',
            createdAt: '2026-01-03T00:00:00Z',
            status: false
        },
        {
            id: 'job-004',
            title: 'Security Analyst',
            location: 'New Delhi',
            requirement: 'Bachelor Degree',
            applicants: 105,
            deadline: '2026-01-19',
            createdAt: '2025-12-29T00:00:00Z',
            status:  true
        },
        {
            id: 'job-005',
            title: 'Product Manager',
            location: 'Bangalore',
            requirement: 'Bachelor Degree',
            applicants:  67,
            deadline: '2026-01-25',
            createdAt: '2025-12-24T00:00:00Z',
            status: true
        },
    ])

    // FUNCTION: Calculate posted days from createdAt
    const getPostedDays = (createdAt: string): number => {
        const now = new Date()
        const posted = new Date(createdAt)
        const diffTime = Math.abs(now.getTime() - posted.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays === 0 ? 1 : diffDays
    }

    // FUNCTION: Add new job
    const handleAddJob = (newJob: Omit<Job, 'id' | 'applicants' | 'createdAt' | 'status'>) => {
        const job: Job = {
            id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Random ID
            ...newJob,
            applicants: 0,  // Set awal 0
            createdAt: new Date().toISOString(),  // Tanggal sekarang
            status: true,  // Set awal true
        }
        
        setJobs(prev => [job, ...prev])  // Tambah di awal (latest)
        setIsModalOpen(false)
    }

    // SORTING & FILTERING Logic
    const displayedJobs = useMemo(() => {
        let filtered = jobs

        // Filter by search
        if (searchQuery.trim()) {
            filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Sort
        let sorted:  Job[]
        switch (sortBy) {
            case 'Latest': 
                sorted = [...filtered].sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                break
            
            case 'Oldest': 
                sorted = [...filtered].sort((a, b) => 
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                )
                break
            
            case 'Most Applicants':
                sorted = [...filtered].sort((a, b) => b.applicants - a.applicants)
                break
            
            case 'Closing Soon': 
                sorted = [...filtered].sort((a, b) => 
                    new Date(a. deadline).getTime() - new Date(b.deadline).getTime()
                )
                break
            
            default: 
                sorted = filtered
        }

        return sorted
    }, [jobs, sortBy, searchQuery])

    // Generate color based on position in LATEST sort
    const getColorByJob = (jobId: string): string => {
        // Sort by Latest untuk dapat urutan asli
        const latestSorted = [...jobs].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        // Cari index di urutan Latest
        const index = latestSorted.findIndex(job => job.id === jobId)
        
        // Color mapping berdasarkan index (1-based)
        const colors = ['red', 'yellow', 'green', 'blue']
        return colors[index % 4]
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Add Job Card */}
                <AddJobCard onClick={() => setIsModalOpen(true)}/>

                {/* Job Cards */}
                {displayedJobs.map((job) => (
                    <JobCard
                        key={job.id}
                        jobId={job.id}
                        title={job.title}
                        postedDays={getPostedDays(job.createdAt)}  // AUTO calculate
                        location={job.location}
                        requirement={job. requirement}
                        applicants={job.applicants}
                        deadline={job.deadline}
                        cardColor={getColorByJob(job.id)}  // AUTO color dari Latest sort
                        status={job.status}
                    />
                ))}
            </div>

            {/* Add Job Modal */}
            <AddJobModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddJob}
            />
        </>
    )
}