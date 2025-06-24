import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../entities/services/IPaymentService";
import { ISlotService } from "../../entities/services/ISlotService";
import { IBookingSlotUseCase } from "../../entities/useCaseInterfaces/IBookingSlotUseCase";
import { IRedisClient } from "../../entities/services/IRedisClient";
import { IWalletSercvices } from "../../entities/services/IWalletServices";
import { config } from "../../shared/config";


@injectable()
export class SlotBookingService {
constructor(
    @inject("IPaymentService") private paymentService: IPaymentService,
    @inject("ISlotService") private slotService: ISlotService,
    @inject("IBookingSlotUseCase") private bookingUseCase: IBookingSlotUseCase,
    @inject("IRedisClient") private redis:IRedisClient,
    @inject("IWalletSercvices") private _walletService: IWalletSercvices,
) {}

async bookSlot(input: {
    userId: string;
    slotId: string;
    price: number;
    duration: number;
    date: string;
    slotLockId: string;
    paymentIntentId: string;
    paymentType: "single" | "shared";
    playerCount?: number;
    }) {
    const {
        userId,
        slotId,
        price,
        duration,
        date,
        slotLockId,
        paymentIntentId,
        paymentType,
        playerCount,
    } = input;

    const isPaymentValid = await this.paymentService.verifyPaymentIntent(paymentIntentId);
    if (!isPaymentValid) {
        throw new Error("Payment not completed");
    }

    const lockKey = `slot_lock:${slotId}`;

    try {
    const slot = await this.slotService.findBySlotId(slotId);
    const turfId = slot.turfId;
    const slots = await this.slotService.validateAndGetSlots(slotId, duration);
    const bookedSlots = await this.slotService.bookSlots(slots);
    const booking = await this.bookingUseCase.execute(
        userId,
        turfId,
        bookedSlots[0].startTime,
        duration,
        price,
        date,
        paymentType,
        playerCount
    );
    if(paymentType == "single"){
        
        const totalAmount=slots.reduce((total, slot) => total + slot.price, 0);
        const transctionTurf = {
            type: "credit",
            amount: totalAmount,
            description: `Booking done for ${date}`
        }
        
        const platformFee = totalAmount * 0.05;
        const adminTransaction = {
            type: "credit",
            amount:platformFee,
            description: `Platfrom Charge for booking`
        }
        const walletUpdate = await this._walletService.addFundsToWallet(turfId,totalAmount,transctionTurf,"turf");
        const adminWalletUpdate = await this._walletService.addFundsToWallet(config.adminId,platformFee,adminTransaction,"admin");
        if(!walletUpdate || !adminWalletUpdate){
            throw new Error("Wallet not updated for turf or admin");
        }
    }else{
        if (!playerCount || playerCount <= 0) {
            throw new Error("Invalid or missing playerCount for shared payment type");
        }
        const totalAmount = slots.reduce((total, slot) => total + slot.price, 0) / playerCount;
        const platformFee = totalAmount * 0.05;
        const transctionTurf = {
            type: "credit",
            amount: totalAmount,
            description: `Booking done for ${date}`
        }
        const adminTransaction = {
            type: "credit",
            amount:platformFee,
            description: `Platfrom Charge for booking`
        }
        const walletUpdate = await this._walletService.addFundsToWallet(turfId,totalAmount,transctionTurf,"turf");
        const adminWalletUpdate = await this._walletService.addFundsToWallet(config.adminId,platformFee,adminTransaction,"admin");
        if(!walletUpdate || !adminWalletUpdate){
            throw new Error("Wallet not updated for turf or admin");
        }
    }
    return { booking, bookedSlots };
    } finally {
    await this.redis.releaseLock(slotLockId, lockKey);
    }
}
}
