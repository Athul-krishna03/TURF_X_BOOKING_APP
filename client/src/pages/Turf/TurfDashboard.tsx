"use client"

import { useEffect, useState } from "react"
import ReusableDashboard from "../../components/dashboard/turf-dashboard"
import { getTurfDashBoardData } from "../../services/turf/turfServices"
import type { TurfDashBoardData } from "../../types/DashboardTypes"
import TurfSideBar from "../../components/turf/turfSideBar"
import { DashboardLoadingSkeleton } from "../../components/ui/loading/loading-skeletons"

export default function TurfDashboard() {
  const [turfDashBoardData, setTurfDashBoardData] = useState<TurfDashBoardData>()
  console.log("turf dashboard data", turfDashBoardData)

  useEffect(() => {
    const fetchDashBoardData = async () => {
      try {
        const response = await getTurfDashBoardData()
        setTurfDashBoardData(response)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }
    fetchDashBoardData()
  },[])

    if ( !turfDashBoardData) {
        return (
        <div className="container mx-auto px-4 py-6">
            <DashboardLoadingSkeleton />
        </div>
        )
    }

  const dashboardData = {
    stats: {
      totalBookings: (turfDashBoardData.normalBooking || 0) + (turfDashBoardData.sharedBooking || 0),
      totalEarnings: turfDashBoardData.walletBalance || 0,
      normalBooking: turfDashBoardData.normalBooking || 0,
      sharedBooking: turfDashBoardData.sharedBooking || 0,
    },
    weeklyBookings: turfDashBoardData.weeklyBookings
      ? { weekly: turfDashBoardData.weeklyBookings.weekly || [] }
      : undefined,
    monthlyBookings: turfDashBoardData.monthlyBookings
      ? { monthly: turfDashBoardData.monthlyBookings.monthly || [] }
      : undefined,
    revenueStats: {
      weekly: turfDashBoardData.revenueStats?.weekly || [],
      monthly: turfDashBoardData.revenueStats?.monthly || [],
    },
    recentBookings: (turfDashBoardData.recentBookings || []).map(booking => ({
      ...booking,
      id: String(booking.id),
    })),
  }

  return (
    <ReusableDashboard
      title="Dashboard Overview"
      subtitle="Welcome back! Here's what's happening with your turf today."
      dashboardType="turf"
      data={dashboardData}
      sidebarComponent={<TurfSideBar />}
    />
  )
}
