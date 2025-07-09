import { inject, injectable } from "tsyringe";
import { IGetAllBookingDataUseCase } from "../../entities/useCaseInterfaces/turf/IGetAllBookingDataUseCase";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { ITurfRepository } from "../../entities/repositoryInterface/turf/ITurfRepository";
import { ISlotRepository } from "../../entities/repositoryInterface/turf/ISlotRepository";
import { ISharedBookingEntity } from "../../entities/models/sharedBooking.entity";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IGetRevenueDataUseCase } from "../../entities/useCaseInterfaces/admin/IGetRevenueDataUseCase";
import { IWalletRepository } from "../../entities/repositoryInterface/wallet/IWalletRepository";

@injectable()
export class GetRevenueDataUseCase implements IGetRevenueDataUseCase{
    constructor(
        @inject("IBookingRepository")
        private bookingRepo: IBookingRepository,
        @inject("ITurfRepository")
        private turfRepo: ITurfRepository,
        @inject("IWalletRepository")
        private walletRepo: IWalletRepository
    ){}
    async execute(): Promise<{
        normal:IBookingEntity[],
        hosted:ISharedBookingEntity[],
        revenueStats:{
            totalBookings:number,
            totalEarnings:number,
            revenue:number,
            normalBooking:number,
            sharedBooking:number
        }}> {
        const normalGame = await this.bookingRepo.getAllBooking()
        const hostedGame = await this.bookingRepo.find()

        const enrichedNormal = [];
        const enrichedHosted = [];

    for (const booking of normalGame) {
        const turfDetails = await this.turfRepo.getTurfByTurfId(booking.turfId);
        enrichedNormal.push({
        ...booking,
        turf: turfDetails,
        });
    }

    for(const game of hostedGame){
        const turfDetails = await this.turfRepo.getTurfByTurfId(game.turfId);
        enrichedHosted.push({
            ...game,
            turf: turfDetails,
        });
    }
    const adminRevenue = await this.walletRepo.getWalletBalance(process.env.ADMIN_ID || "");
    const totalEarnings = normalGame.filter(booking => booking.status === "Booked").reduce((total, booking) => total + booking.price, 0) +
        hostedGame.filter(game => game.status === "Booked").reduce((total, game) => total + game.price, 0);
    console.log("totalEarnings", totalEarnings); 
    const revenueStats = {
        totalBookings: normalGame.length + hostedGame.length,
        totalEarnings: totalEarnings,
        revenue: adminRevenue,
        normalBooking: normalGame.length,
        sharedBooking: hostedGame.length,
    }

        return {normal:enrichedNormal,hosted:enrichedHosted,revenueStats:revenueStats,};

    }
}