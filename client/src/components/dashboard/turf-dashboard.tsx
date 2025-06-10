"use client"

import { CalendarDays, Clock, TrendingUp, Users, Wallet, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import {BarChart as RechartsBarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,LineChart,Line,PieChart,Pie,Cell,
} from "recharts"
import { useState } from "react"
import { ReusableDashboardProps } from "../../types/DashboardTypes"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function ReusableDashboard({
    title,
    subtitle,
    dashboardType,
    data,
    sidebarComponent,
    onExportReport,
    onViewAnalytics,
}: ReusableDashboardProps) {
    const [activeBookingTab, setActiveBookingTab] = useState("weekly")
    const [activeRevenueTab, setActiveRevenueTab] = useState("weekly")

    const getBookingChartData = () => {
        return activeBookingTab === "weekly" ? data?.weeklyBookings?.weekly || [] : data?.monthlyBookings?.monthly || []
    }

    const getRevenueChartData = () => {
        return activeRevenueTab === "weekly" ? data?.revenueStats?.weekly || [] : data?.revenueStats?.monthly || []
    }

    const renderFirstChart = () => {
        if (dashboardType === "admin") {
        return (
            <Card>
            <CardHeader>
                <div>
                <CardTitle className="text-xl">Top 5 Turfs by Bookings</CardTitle>
                <CardDescription>Most popular turfs based on booking volume</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data?.topTurfs || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {(data?.topTurfs || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [value, "Bookings"]}
                    />
                    </PieChart>
                </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2">
                {(data?.topTurfs || []).map((turf, index) => (
                    <div key={turf.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm font-medium">{turf.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{turf.value} bookings</span>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        )
        } else {
        return (
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-xl">Booking Trends</CardTitle>
                    <CardDescription>Track your booking patterns over time</CardDescription>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                    onClick={() => setActiveBookingTab("weekly")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        activeBookingTab === "weekly"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    >
                    Weekly
                    </button>
                    <button
                    onClick={() => setActiveBookingTab("monthly")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        activeBookingTab === "monthly"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    >
                    Monthly
                    </button>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={getBookingChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                    <Bar
                        dataKey="bookings"
                        fill={activeBookingTab === "weekly" ? "#3b82f6" : "#10b981"}
                        radius={[6, 6, 0, 0]}
                    />
                    </RechartsBarChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
            </Card>
        )
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        {sidebarComponent && (
            <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10">{sidebarComponent}</div>
        )}

        <div className={`flex-1 ${sidebarComponent ? "ml-64" : ""}`}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-600 mt-1">{subtitle}</p>
                </div>
                {(onExportReport || onViewAnalytics) && (
                    <div className="flex items-center space-x-3">
                    {onExportReport && (
                        <Button variant="outline" size="sm" onClick={onExportReport}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Export Report
                        </Button>
                    )}
                    {onViewAnalytics && (
                        <Button size="sm" onClick={onViewAnalytics}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analytics
                        </Button>
                    )}
                    </div>
                )}
                </div>
            </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-bl-full opacity-10"></div>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        {dashboardType === "admin" ? "Total Platform Bookings" : "Total Bookings"}
                    </CardTitle>
                    <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{data?.stats?.totalBookings || 0}</div>
                    <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% from last month
                    </p>
                </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 rounded-bl-full opacity-10"></div>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        {dashboardType === "admin" ? "Total Platform Revenue" : "Total Earnings"}
                    </CardTitle>
                    <Wallet className="h-5 w-5 text-green-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                    ₹{Math.ceil(data?.stats?.totalEarnings || 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8% from last month
                    </p>
                </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 rounded-bl-full opacity-10"></div>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        {dashboardType === "admin" ? "Total Customers" : "Normal Bookings"}
                    </CardTitle>
                    <Users className="h-5 w-5 text-purple-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{data?.stats?.normalBooking || 0}</div>
                    <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +6% from last month
                    </p>
                </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500 rounded-bl-full opacity-10"></div>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        {dashboardType === "admin" ? "Total Turfs" : "Shared Bookings"}
                    </CardTitle>
                    <Users className="h-5 w-5 text-orange-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{data?.stats?.sharedBooking || 0}</div>
                    <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +24% from last month
                    </p>
                </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* First Chart - Booking Trends (Turf) or Top Turfs Pie Chart (Admin) */}
                {renderFirstChart()}

                {/* Revenue Trends Chart */}
                <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Revenue Trends</CardTitle>
                        <CardDescription>Monitor revenue performance</CardDescription>
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                        onClick={() => setActiveRevenueTab("weekly")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            activeRevenueTab === "weekly"
                            ? "bg-white text-green-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        >
                        Weekly
                        </button>
                        <button
                        onClick={() => setActiveRevenueTab("monthly")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            activeRevenueTab === "monthly"
                            ? "bg-white text-green-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        >
                        Monthly
                        </button>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getRevenueChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <Tooltip
                            contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke={activeRevenueTab === "weekly" ? "#22c55e" : "#f59e0b"}
                            strokeWidth={3}
                            dot={{ fill: activeRevenueTab === "weekly" ? "#22c55e" : "#f59e0b", strokeWidth: 2, r: 6 }}
                            activeDot={{
                            r: 8,
                            stroke: activeRevenueTab === "weekly" ? "#22c55e" : "#f59e0b",
                            strokeWidth: 2,
                            }}
                        />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
                </Card>
            </div>

            {/* Recent Bookings */}
            <div className="grid grid-cols-1 gap-8 mb-8">
                <Card>
                <CardHeader>
                    <CardTitle className="text-xl">
                    {dashboardType === "admin" ? "Recent Platform Bookings" : "Recent Bookings"}
                    </CardTitle>
                    <CardDescription>
                    {dashboardType === "admin" ? "Latest reservations across all turfs" : "Latest turf reservations"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data?.recentBookings &&
                        data?.recentBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="flex flex-col space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                            <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-xs">
                            
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{booking.name}</p>
                                <span
                                className={`inline-block text-xs px-2 py-1 rounded-full font-medium mt-1 ${
                                    booking.status === "Confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                                >
                                {booking.status}
                                </span>
                            </div>
                            </div>
                            <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-600">
                                <Clock className="mr-2 h-3 w-3" />
                                {booking.time}
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                                <CalendarDays className="mr-2 h-3 w-3" />
                                {booking.date}
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6">
                    View All Bookings
                    </Button>
                </CardContent>
                </Card>
            </div>
            </div>
        </div>
        </div>
    )
}
