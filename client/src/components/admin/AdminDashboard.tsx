"use client"

import ReusableDashboard from "../../components/dashboard/turf-dashboard"
import { useGetAdminDashboardData } from "../../hooks/admin/useGetAdminDashboardData"
import { DashboardLoadingSkeleton } from "../ui/loading/loading-skeletons"
import { Card, CardContent } from "../ui/card"

export default function AdminDashboardComponent() {
    const { data: adminDashBoardData, isLoading, error } = useGetAdminDashboardData()

    // Error state
    if (error) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="p-8 text-center">
            <CardContent>
                <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
                <p className="text-gray-600 mb-4">There was an error loading your dashboard data.</p>
                <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                Try Again
                </button>
            </CardContent>
            </Card>
        </div>
        )
    }

    // Loading state with professional skeleton
    if (isLoading || !adminDashBoardData) {
        return (
        <div className="container mx-auto px-4 py-6">
            <DashboardLoadingSkeleton />
        </div>
        )
    }
    const dashboardData = {
        stats: {
        totalBookings: adminDashBoardData.totalPlatformBookings || 0,
        totalEarnings: adminDashBoardData.walletBalance || 0,
        normalBooking: adminDashBoardData.sharedBooking || 0,
        sharedBooking: adminDashBoardData.normalBooking || 0,
        },
        topTurfs:
        adminDashBoardData.topTurfs?.map((turf:{name:string, bookings:number}) => ({
            name: turf.name,
            value: turf.bookings,
        })) || [],
        revenueStats: adminDashBoardData.revenueStats,
        recentBookings: adminDashBoardData.recentBookings || [],
    }

    return (
        <ReusableDashboard
        title="Admin Dashboard"
        subtitle="Platform overview and management insights."
        dashboardType="admin"
        data={dashboardData}
        />
    )
}
