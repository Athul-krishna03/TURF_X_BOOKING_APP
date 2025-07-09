import { inject, injectable } from "tsyringe";
import { ITurfDashBoardUseCase } from "../../entities/useCaseInterfaces/booking/ITurfDashBoardUseCase";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { IWalletRepository } from "../../entities/repositoryInterface/wallet/IWalletRepository";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { IDashBoardServices } from "../../entities/services/IDashBoardServices";

@injectable()
export class TurfDashBoardUseCase implements ITurfDashBoardUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
        @inject("IWalletRepository") private _walletRepo: IWalletRepository,
        @inject("ITurfRepository") private _turfRepo: ITurfRepository,
        @inject("IDashBoardServices") private _dashboardService: IDashBoardServices
    ){}
    async execute(turfId: string): Promise<object> {
        const turfData = await this._turfRepo.findById(turfId);
        if (!turfData || !turfData.turfId) {
            throw new Error("Turf not found or turfId is missing.");
        }
        const bookingData = await this._bookingRepo.findNormalByTurfId(turfData.turfId);
        const sharedBookingData = await this._bookingRepo.findSharedByTurfId(turfData.turfId);   
        const totalBookings = [...bookingData,...sharedBookingData]
        const recentBookings = totalBookings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(b => ({
            id: b.bookingId,
            name: b.bookingId,
            time: b.time,
            date: b.date,
            status: b.status,
            price: b.price
        }));
        const weeklyBookings = await this._dashboardService.generateDailyStats(totalBookings);
        const monthlyBookings = await this._dashboardService.generateMonthlyStats(totalBookings);
        let wallet = null;
        if (turfData?.turfId) {
            wallet = await this._walletRepo.findByUserId(turfData.turfId, "turf");
        }
        const revenueStats = await this._dashboardService.generateRevenueStats(wallet?.transaction ?? []);
        const data = {
            normalBooking: bookingData.length,
            sharedBooking: sharedBookingData.length,
            walletBalance: wallet?.balance,
            weeklyBookings: weeklyBookings,
            monthlyBookings: monthlyBookings,
            revenueStats: revenueStats,
            recentBookings
        }
        return data; 
    }
}


