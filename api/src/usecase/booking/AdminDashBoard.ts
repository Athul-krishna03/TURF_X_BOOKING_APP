import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { IWalletRepository } from "../../entities/repositoryInterface/wallet/IWalletRepository";
import { IDashBoardServices } from "../../entities/services/IDashBoardServices";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { IAdminDashBoardUseCase } from "../../entities/useCaseInterfaces/booking/IAdminDashBoardUseCase";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";


@injectable()
export class AdminDashBoardUseCase implements IAdminDashBoardUseCase{
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
        @inject("IWalletRepository") private _walletRepo: IWalletRepository,
        @inject("ITurfRepository") private _turfRepo: ITurfRepository,
        @inject("IDashBoardServices") private _dashboardService: IDashBoardServices,
        @inject("IClientRepository") private _clientRepo: IClientRepository
    ){}

    async execute(adminId:string): Promise<object> {
        const bookingData = await this._bookingRepo.getAllBooking();
        const sharedBookingData = await this._bookingRepo.find();
        const turfData = await this._turfRepo.find({}, 0, 0);
        const clientData = await this._clientRepo.find({}, 0, 0);
        const topTurfs = await this._bookingRepo.getTopTurfsByAllBookings(5);
        console.log("top",topTurfs)
        if (!bookingData || !sharedBookingData || !turfData || !clientData) {
            throw new Error("Turf not found or turfId is missing.");
        }

        const recentBookings = bookingData
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

        // Generate weekly booking data
        const weeklyBookings = await this._dashboardService.generateDailyStats(bookingData);
        const monthlyBookings = await this._dashboardService.generateMonthlyStats(bookingData);

        const wallet = await this._walletRepo.findByUserId(adminId,"admin");
        const revenueStats = await this._dashboardService.generateRevenueStats(wallet?.transaction ?? []);

        const data = {
            normalBooking: turfData.total,
            sharedBooking: clientData.total,
            walletBalance: wallet?.balance || 0,
            weeklyBookings: weeklyBookings,
            monthlyBookings: monthlyBookings,
            revenueStats: revenueStats,
            topTurfs: topTurfs.map(turf => ({
                name: turf.turfName,
                bookings: turf.totalBookings || 0
            })),
            totalPlatformBookings: bookingData.length + sharedBookingData.length,
            recentBookings
        }
        return data; 
    }
}