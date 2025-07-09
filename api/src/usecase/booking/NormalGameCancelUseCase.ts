import { inject, injectable } from "tsyringe";
import { INormalGameCancelUseCase } from "../../entities/useCaseInterfaces/booking/INormalGameCancelUseCase";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { ISlotRepository } from "../../entities/repositoryInterface/turf/ISlotRepository";
import { IWalletSercvices } from "../../entities/services/IWalletServices";
import { addHours, format, parse } from "date-fns";
import { ISlotService } from "../../entities/services/ISlotService";


@injectable()
export class NormalGameCancelUseCase implements INormalGameCancelUseCase{
    constructor(
        @inject("IBookingRepository") private _bookingRepo:IBookingRepository,
        @inject("ISlotRepository") private _slotRepo:ISlotRepository,
        @inject("ISlotService") private _slotService:ISlotService,
        @inject('IWalletSercvices') private _walletService: IWalletSercvices,
    ){}
    async execute(bookingId: string): Promise<IBookingEntity | null> {
        const result=await this._bookingRepo.cancelNormalGame(bookingId);
        if(result && result.duration > 0){
            await this._slotService.cancelTheSlots(result)
            const  data={
                    type: "credit",
                    amount: result.price,
                    description: "Booking cancellation refund"
            };
            const turfData={
                type:"debit",
                amount: result.price,
                description:`Booking cancellation of ${result.bookingId}`
            }
            await this._walletService.addFundsToWallet(result.userId,result.price,data,"client");
            await this._walletService.reduceFunds(result.turfId,result.price,turfData,"turf");
        } else if (result) {
            const slotData = await this._slotRepo.findOne({
                turfId: result.turfId,
                date: result.date,
                startTime: result.time
            });

            if (slotData) {
                await this._slotRepo.update(slotData.id!, { isBooked: false });
            }
        }
    return result;
}
}