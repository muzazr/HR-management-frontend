"use client"

import ProtectedRoute from "../../components/auth/ProtectedRoute"
import GreetingSection from "../../components/dashboard/GreetingSection"
import JobSection from "../../components/dashboard/JobSection"

function DashboardContent () {
    return (
        <>
            <GreetingSection />
            <JobSection />
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
