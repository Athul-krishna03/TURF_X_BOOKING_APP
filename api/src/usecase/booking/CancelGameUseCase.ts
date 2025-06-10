import { inject, injectable } from "tsyringe";
import { ISharedBookingEntity } from "../../entities/models/sharedBooking.entity";
import { ICancelGameUseCase } from "../../entities/useCaseInterfaces/booking/ICancelGameUseCase";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { ISlotRepository } from "../../entities/repositoryInterface/turf/ISlotRepository";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { IRedisClient } from "../../entities/services/IRedisClient";
import { IWalletSercvices } from "../../entities/services/IWalletServices";
import { IPushNotificationService } from "../../entities/services/IPushNotificationService";
import { NotificationType } from "../../shared/constants";



@injectable()
export class CancelGameUseCase implements ICancelGameUseCase{
    constructor(
        @inject('IBookingRepository') private _bookingRepo: IBookingRepository,
        @inject('ISlotRepository') private _slotRepo: ISlotRepository,
        @inject("IRedisClient") private _redis:IRedisClient,
        @inject('IWalletSercvices') private _walletService: IWalletSercvices,
        @inject("IPushNotificationService") private _pushNotificationService:IPushNotificationService
    ) {}
    async execute(data: { bookingId: string; userId: string; isHost: boolean; }): Promise<ISharedBookingEntity | null> {
        
        const lockKey = `lock:cancel_booking:${data.bookingId}`;
        const lockTTL = 10000;
        
        try {
            
            const lockAcquired = await this._redis.acquireLock(lockKey, lockTTL);
            if (!lockAcquired) {
                throw new Error('Could not acquire lock for canceling booking');
            }

            const booking = await this._bookingRepo.cancelGame(data);
            if(!booking){
                throw new Error('Booking not found or already canceled');
            }
            console.log("data in cancel game use case", data);
            if(booking.userIds[0]==data.userId){
                const slotData = await this._slotRepo.findOne({
                    turfId: booking.turfId,
                    date: booking.date,
                    startTime: booking.time
                });
                console.log("slot data in cancel game use case", slotData);
                
                if (slotData) {
                    await this._slotRepo.update(slotData.id!, { isBooked: false });
                }
                for(let usersId of booking.userIds){
                    const data={
                        type: "credit",
                        amount: booking.price/booking.playerCount,
                        description: "Booking cancelled by the Host of the  joined Game"
                    }
                    await this._walletService.addFundsToWallet(usersId, booking.price/booking.playerCount,data,"client");
                    await this._pushNotificationService.sendNotification(
                        usersId,
                        "Booking Cancelled By the host",
                        "The Booking as cancelled by Host the payment is credited to wallet",
                        NotificationType.CANCEL_BOOKING
                    );

                }
            }else{
                const gameTime = new Date(`${booking.date}T${booking.time}:00`);
                const cancellationWindow = new Date(gameTime.getTime() - 6 * 60 * 60 * 1000); // 12 hours before
                const now = new Date();

                const amount = booking.price/booking.playerCount || 0;
                console.log("data in refund:", amount,now, cancellationWindow);
                // const refundAmount = now < cancellationWindow ? amount : amount || 0 * 0.5; // 50% refund if late
                if (now < cancellationWindow) {
                    console.log("Refunding full amount:", amount,now, cancellationWindow);
                    const transction = {
                        type: "credit",
                        amount: amount,
                        description: "Booking cancelled refund  of the joined Game"
                    }
                    await this._walletService.addFundsToWallet(data.userId, amount,transction,"client");
                    await this._pushNotificationService.sendNotification(
                        data.userId,
                        "Booking Cancelled",
                        "Booking cancelled form a joined game the refund is credited to the wallet according to policy",
                        NotificationType.CANCEL_BOOKING
                    )
                }
            }

            return booking;
        } catch (error) {
            console.error('CancelGameUseCase error:', error);
            throw error;
        }
        finally {
            await this._redis.releaseLock(lockKey);
        }
    }
}