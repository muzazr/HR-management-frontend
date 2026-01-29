export default function DashboardLayout ({
    children,
}: {
    children:  React.ReactNode
    modal?: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#151515] px-4 lg:px-8 py-4 lg:py-8">
            {children}
        </div>
    )
}