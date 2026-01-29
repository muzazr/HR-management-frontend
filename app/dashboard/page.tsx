"use client"

import ProtectedRoute from "../../components/auth/ProtectedRoute"
import GreetingSection from "../../components/dashboard/GreetingSection"
import JobSection from "../../components/dashboard/JobSection"
import { useState } from "react"

function DashboardContent () {

    const [refreshTrigger, setRefreshTrigger] = useState(0)
    
    const handleDataUpdate = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <>
            <GreetingSection refreshTrigger={refreshTrigger} />
            <JobSection onJobUpdate={handleDataUpdate} />
        </>
    )
}

export default function Dashboard () {


    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
}
