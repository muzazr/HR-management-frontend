'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import CandidateDetailModal from '../../../../components/applicant/CandidateDetailModal'
import EditJobModal from '../../../../components/jobs/EditJobModal'
import NotificationModal from '../../../../components/NotificationModal'  
import { useNotification } from '../../../../hooks/useNotification'
import { JobService, ApplicantService } from '../../../../lib/api'
import { Job } from '../../../../types/job'
import { Applicant } from '../../../../types/applicant'

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.id as string
    const { notification, showSuccess, showError, close } = useNotification()

    const [job, setJob] = useState<Job | null>(null)
    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [uploadedCVs, setUploadedCVs] = useState<File[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedApplicant, setSelectedApplicant] = useState<(Applicant & {originalRank? : number})| null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')

    const refreshData = useCallback(async () => {
        if(!jobId) {
            setError('invalid job id')
            return
        }
        
        try {
            setError('')
            const [jobRes, appRes] = await Promise.all([
                JobService.getById(jobId),
                ApplicantService.getByJobId(jobId)
            ])

            if(jobRes.success && jobRes.data) {
                setJob(jobRes.data)
            }

            if(appRes.success && appRes.data) {
                setApplicants(appRes.data)
            }
        } catch (err) {
            console.error('Failed to refresh data', err)
            setError(err.message || 'failed to load data')
        }
    }, [jobId])

    useEffect (() => {
        let isMounted = true
        
        const initData = async () => {
            setIsLoading(true)
            await refreshData()
            if(isMounted) setIsLoading(false)
        }

        initData()
        return () => { isMounted = false }
    }, [refreshData])

    const displayedApplicants = useMemo(() => {
        const sortedWithRanking = [... applicants]
            .sort((a, b) => b.score - a.score)
            .map((applicant, index) => ({
                ...applicant,
                originalRank: index + 1
            }))

        if (searchQuery.trim()) {
            return sortedWithRanking.filter(applicant => 
                applicant.name. toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        
        return sortedWithRanking
    }, [applicants, searchQuery])

    const handleFileUpload = (e: React. ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf')
            if(pdfFiles.length !== files.length){
                showError('Invalid File Type', 'Only PDF files are allowed!') 
            }

            setUploadedCVs(prev => [...prev, ...pdfFiles])
        }
    }

    const removeCV = (index: number) => {
        setUploadedCVs(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (uploadedCVs.length === 0) return

        setIsUploading(true)
        try {
            const response = await ApplicantService.uploadCVs(jobId, uploadedCVs)
            
            if(response.success) {
                // console.log('Upload success, refreshing data...')
                setUploadedCVs([])
    
                const applicantsResponse = await ApplicantService.getByJobId(jobId)
                if(applicantsResponse.success && applicantsResponse.data) {
                    // console.log(`Refreshed: ${applicantsResponse.data.length} applicants`)
                    setApplicants(applicantsResponse.data)
                }
    
                const jobResponse = await JobService.getById(jobId)
                if(jobResponse.success && jobResponse.data) {
                    // console.log('refreshed job data')
                    setJob(jobResponse.data)
                }
    
                showSuccess('CVs Processed Successfully!', response.message || `${uploadedCVs.length} CV(s) uploaded`)
            } else {
                showError('Processing Failed', response.error || 'Failed to process CVs')
            }

        } catch (err: any) {
            showError('Upload Error', err.message || 'Failed to upload CVs')
        } finally {
            setIsUploading(false)
        }
    }

    const handleUpdateCV = async (applicantId: string, file: File) => {
    try {
        setIsUploading(true) 
        // console.log(' Updating CV for', applicantId)

        const response = await ApplicantService.updateCV(applicantId, file)
        // console.log('updateCV response:', response)

        if (response.success) {
        // REFRESH full applicant list (reliable)
        const applicantsResponse = await ApplicantService.getByJobId(jobId)
        if (applicantsResponse.success && applicantsResponse.data) {
            setApplicants(applicantsResponse.data)
            // set selected applicant to the updated one from fresh list
            const updated = applicantsResponse.data.find(a => String(a.id) === String(applicantId))
            setSelectedApplicant(updated ?? null)
        }
        
        // refresh job counts if needed
        const jobResponse = await JobService.getById(jobId)
        if (jobResponse.success && jobResponse.data) {
            setJob(jobResponse.data)
        }

        showSuccess('CV Updated', 'Data analysis has been refreshed!')
        return response.data
        } else {
        showError('Update Failed', response.error || 'Failed to update CV')
        return null
        }
    } catch (err: any) {
        // console.error('handleUpdateCV error:', err)
        showError('Error', err.message || 'Failed to update CV')
        throw err
    } finally {
        setIsUploading(false)
    }
    }

    const handleDeleteApplicant = async (applicantId:  string) => {
        try {
            const response = await ApplicantService.delete(applicantId.toString())
            
            if (response.success) {
                // Remove from list
                setApplicants(prev => prev.filter(app => app.id !== applicantId.toString()))
                setSelectedApplicant(null)
                showSuccess('Applicant Deleted', 'The applicant has been successfully removed.')
                
                // Refresh job to update applicant count
                const jobResponse = await JobService.getById(jobId)
                if (jobResponse.success && jobResponse. data) {
                    setJob(jobResponse.data)
                }
            } else {
                showError('Delete Failed', response.error || 'Failed to delete applicant')
            }
        } catch (err:  any) {
            showError('Delete Error', err.message || 'Failed to delete applicant')
        }
    }

    const handleEditJob = async (updates: {
        title: string
        location: string
        min_education: string
        skills: string
        deadline: string
    }) => {
        try {
            const response = await JobService.update(jobId, updates)
            if (response.success && response.data) {
                setJob(response.data)
                setIsEditModalOpen(false)
                showSuccess('Job Updated!', 'The job details have been successfully updated.')
            } else {
                showError('Update Failed', response.error || 'Failed to update job')
            }
        } catch (err: any) {
            showError('Update Error', err.message || 'Failed to update job')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#151515] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading job details...</p>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-[#151515] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
                    <p className="text-gray-400 mb-6">{error || 'The job you are looking for does not exist.'}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#151515] px-4">
            
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

                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
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
                            disabled={isUploading}
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
                                        disabled={isUploading}
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
                            disabled={uploadedCVs.length === 0 || isUploading}
                            className="w-full px-6 py-3 bg-[#151515] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                        >
                            {isUploading ? 'Processing CVs...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#272727]">
                <h2 className="text-xl font-semibold text-white">Applicant ({applicants.length})</h2>
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
            
            {/* Applicants */}
            <div className="bg-[#1e1e1e] rounded-2xl px-6 py-4">
            <div className="overflow-x-auto">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 bg-[#262626] rounded-2xl px-4 py-4 mb-1">
                <div className="col-span-1 text-center text-sm font-medium text-gray-400">Ranking</div>
                <div className="col-span-4 text-center text-sm font-medium text-gray-400">Name</div>
                <div className="col-span-5 text-center text-sm font-medium text-gray-400">Email</div>
                <div className="col-span-2 text-center text-sm font-medium text-gray-400">Score</div>
                </div>

                {/* Body for desktop or tablet */}
                <div className="hidden md:block">
                {displayedApplicants.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No applicants yet. Upload CVs to get started.</div>
                ) : (
                    displayedApplicants.map((applicant) => (
                    <div
                        key={applicant.id}
                        onClick={() => setSelectedApplicant(applicant)}
                        className="grid grid-cols-12 gap-4 py-4 px-4 hover:bg-[#151515] cursor-pointer transition-colors rounded-lg items-center"
                    >
                        <div className="col-span-1 text-center text-white">{applicant.originalRank}</div>
                        <div className="col-span-4 text-white truncate">{applicant.name}</div>
                        <div className="col-span-5 text-white truncate break-all">{applicant.email}</div>
                        <div className="col-span-2 text-center text-white font-semibold">
                        {applicant.score}
                        <span className="text-yellow-500">/100</span>
                        </div>
                    </div>
                    ))
                )}
                </div>

                {/* Body for mobile */}
                <div className="md:hidden">
                {displayedApplicants.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">No applicants yet. Upload CVs to get started.</div>
                ) : (
                    displayedApplicants.map((applicant) => (
                    <div
                        key={applicant.id}
                        onClick={() => setSelectedApplicant(applicant)}
                        className="mb-3 p-3 bg-[#151515] rounded-lg cursor-pointer hover:bg-[#171717] transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="text-sm text-gray-400">#{applicant.originalRank}</div>
                            <div className="text-lg font-semibold text-white">{applicant.name}</div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-gray-400">Score</div>
                            <div className="text-lg font-semibold text-white">
                            {applicant.score}
                            <span className="text-yellow-500">/100</span>
                            </div>
                        </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-300 break-all">
                        {applicant.email}
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>
            </div>

            <CandidateDetailModal 
                key={selectedApplicant?.id || 'modal'} 
                isOpen={selectedApplicant !== null}
                onClose={() => setSelectedApplicant(null)}
                applicant={selectedApplicant} 
                onUpdateCV={handleUpdateCV}
                onDeleteApplicant={handleDeleteApplicant}
            />

            <EditJobModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                job={job}
                onSubmit={handleEditJob}
            />

            <NotificationModal 
                isOpen={notification.isOpen}
                onClose={close}
                type={notification.type}
                title={notification.title}
                message={notification.message}
            />
        </div>
    )
}
