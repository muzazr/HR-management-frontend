'use client'

import { useState, useMemo, useEffect } from 'react'
import JobCard from './JobCard'
import AddJobCard from './AddJobCard'
import AddJobModal from './AddJobModal'
import { Job } from '../../types/job'
import { JobService } from '../../lib/api'

interface JobGridProps {
    sortBy:  string
    searchQuery: string
    onJobUpdate?: () => void
}

export default function JobGrid({ sortBy, searchQuery, onJobUpdate }: JobGridProps) {
    
    // Modal & Jobs Data
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        setIsLoading(true)
        setError('')
        try {
            const response = await JobService.getAll()
            if(response.success && response.data) {
                setJobs(response.data)
            } else {
                setError(response.error || 'Failed to load jobs')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load jobs')
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate posted days from postedDate
    const getPostedDays = (postedDate: string): number => {
        const now = new Date()
        const posted = new Date(postedDate)
        const diffTime = Math.abs(now.getTime() - posted.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays === 0 ? 1 : diffDays
    }

    // Add new job
    const handleAddJob = async (newJobData: {title: string; location: string; min_education: string; skills: string; deadline: string}) => {
        try {
            const response = await JobService.create(newJobData)
            if(response.success && response.data) {
                setJobs(prev => [response.data!, ...prev])
                setIsModalOpen(false)

                if(onJobUpdate) {
                    onJobUpdate()
                }
            } else {
                alert(response.error || 'Failed to create job')
            }
        } catch (err: any) {
            alert(err.message || 'Failed to create job')
        }
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
                    new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
                )
                break
            
            case 'Oldest': 
                sorted = [...filtered].sort((a, b) => 
                    new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
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
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        )
        
        // Cari index di urutan Latest
        const index = latestSorted.findIndex(job => job.id === jobId)
        
        // Color mapping berdasarkan index (1-based)
        const colors = ['red', 'yellow', 'green', 'blue']
        return colors[index % 4]
    }

    if(isLoading) {
        return (
            <div className='text-center py-12'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading jobs...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
                <button 
                    onClick={fetchJobs}
                    className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                    Retry
                </button>
            </div>
        )
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
                        postedDays={getPostedDays(job.postedDate)}  // AUTO calculate
                        location={job.location}
                        min_education={job.min_education}
                        applicants={job.applicants}
                        deadline={job.deadline}
                        cardColor={getColorByJob(job.id)}  // AUTO color dari Latest sort
                        status={job.is_open || false}
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