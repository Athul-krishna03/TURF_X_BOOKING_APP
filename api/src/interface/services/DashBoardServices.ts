import { injectable } from "tsyringe";
import { IDashBoardServices } from "../../entities/services/IDashBoardServices";

@injectable()
export class DashBoardServices implements IDashBoardServices {
    async generateDailyStats(bookings: any[]): Promise<{ weekly: { name: string; bookings: number; }[]; }> {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);

        const weeklyCounts = Array(7).fill(0);
        bookings.forEach((booking) => {
            const dateOnly = new Date(`${booking.date}T${booking.time}:00`);
            if (dateOnly >= startOfWeek) {
                const dayIndex = (dateOnly.getDay() + 6) % 7;
                weeklyCounts[dayIndex]++;
            }
        });

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyBookingData = days.map((day, i) => ({
            name: day,
            bookings: weeklyCounts[i],
        }));

        return {
            weekly: weeklyBookingData,
        };
    }

    async generateMonthlyStats(bookings: any[]): Promise<{ monthly: { name: string; bookings: number; }[]; }> {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts = Array(12).fill(0);

        bookings.forEach((booking) => {
            const dateObj = new Date(`${booking.date}T${booking.time}:00`);
            if (dateObj.getFullYear() !== new Date().getFullYear()) return;
            const monthIndex = dateObj.getMonth(); 
            monthlyCounts[monthIndex]++;
        });

        const monthlyBookingData = months.map((month, i) => ({
            name: month,
            bookings: monthlyCounts[i],
        }));

        return { monthly: monthlyBookingData };
    }

    async generateRevenueStats(wallet: any[]) {
        const weeklyRevenue = Array(7).fill(0);
        const monthlyRevenue = Array(12).fill(0);

        wallet.filter((val)=>val.type !== "debit").forEach((wallet) => {
            const dateObj = new Date(wallet.date);
            const dayIndex = dateObj.getDay();
            weeklyRevenue[dayIndex] += wallet.amount || 0;
            if (dateObj.getFullYear() === new Date().getFullYear()) {
                const monthIndex = dateObj.getMonth();
                monthlyRevenue[monthIndex] += wallet.amount || 0;
            }
        });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
        weekly: days.map((day, i) => ({ name: day, revenue: weeklyRevenue[i] })),
        monthly: months.map((month, i) => ({ name: month, revenue: monthlyRevenue[i] }))
    };
}
}