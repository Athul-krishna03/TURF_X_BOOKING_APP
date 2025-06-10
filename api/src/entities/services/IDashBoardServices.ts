export interface IDashBoardServices{
    generateDailyStats(bookings: any[]): Promise<{ weekly: { name: string; bookings: number; }[]; }>,
    generateMonthlyStats(bookings: any[]): Promise<{ monthly: { name: string; bookings: number; }[]; }>,
    generateRevenueStats(wallet: any[]): Promise<{ weekly: { name: string; revenue: number; }[]; monthly: { name: string; revenue: number; }[]; }>,

}