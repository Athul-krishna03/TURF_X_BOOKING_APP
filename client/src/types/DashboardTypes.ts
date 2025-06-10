
export interface DashboardStats {
    totalBookings: number
    totalEarnings: number
    normalBooking: number
    sharedBooking: number
}

export interface ChartData {
    name: string
    bookings?: number
    revenue?: number
    value?: number
}

export interface RecentBooking {
    id: string
    name: string
    status: string
    time: string
    date: string
}

export interface DashboardData {
    stats: DashboardStats
    weeklyBookings?: { weekly: ChartData[] }
    monthlyBookings?: { monthly: ChartData[] }
    revenueStats?: {
        weekly: ChartData[]
        monthly: ChartData[]
    }
    topTurfs?: ChartData[]
    recentBookings: RecentBooking[]
}

export interface ReusableDashboardProps {
    title: string
    subtitle: string
    dashboardType: "turf" | "admin"
    data: DashboardData
    sidebarComponent?: React.ReactNode
    onExportReport?: () => void
    onViewAnalytics?: () => void
}

type BookingTrends = {
    weekly?: { name: string; bookings: number }[];
    monthly?: { name: string; bookings: number }[];
};

export type TurfDashBoardData = {
    normalBooking?: number;
    sharedBooking?: number;
    walletBalance?: number;
    turfDashBoardData?: any[];
    weeklyBookings?: BookingTrends;
    monthlyBookings?: BookingTrends;
    revenueStats?: BookingTrends;
    recentBookings?: {
        id: string | number;
        name: string;
        status: string;
        time: string;
        date: string;
    }[];
};