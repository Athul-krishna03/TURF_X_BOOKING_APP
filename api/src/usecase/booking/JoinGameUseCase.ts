import { inject, injectable } from "tsyringe";
import { IJoinGameUseCase } from "../../entities/useCaseInterfaces/booking/IJoinGameUseCase";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { ISharedBookingEntity } from "../../entities/models/sharedBooking.entity";
import { IWalletSercvices } from "../../entities/services/IWalletServices";
import { config, messaging } from "../../shared/config";
import { INotificationRepository } from "../../entities/repositoryInterface/notification/INotificationRepository";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { NotificationType } from "../../shared/constants";
import { IChatRoomRepository } from "../../entities/repositoryInterface/chatRoom/chat-room-repository";

@injectable()
export class JoinGameUseCase implements IJoinGameUseCase{
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
        @inject("IWalletSercvices") private _walletService: IWalletSercvices,
        @inject("INotificationRepository") private _notificationRepo: INotificationRepository,
        @inject("IClientRepository") private _clientRepo: IClientRepository,
        @inject("IChatRoomRepository") private _chatRoomRepo:IChatRoomRepository
    ){}
    async execute(data: any): Promise< ISharedBookingEntity | null> {
        try {
            const booking = await this._bookingRepo.joinGame(data);
            if (booking && booking.userIds.length === booking.playerCount) {
                await this._bookingRepo.updateJoinedGameBookingStatus(booking.id, {
                    isSlotLocked:true,
                    status: "Booked"
                });
            }

            const Amount = booking?.playerCount ? booking.price / booking.playerCount : 0;
            const totalAmount = Amount/(1+0.05);
            const platformfee = totalAmount*0.05;
            const transctionTurf = {
                type: "credit",
                amount: totalAmount,
                description: `Booking done for ${booking?.date}`
            }
            const adminTransaction = {
                type: "credit",
                amount:platformfee,
                description: `Platfrom Charge for booking`
            }
            if (!booking?.turfId) {
                throw new Error("Turf ID is missing in booking data");
            }
            //adding money to admin and turfOwner wallet
            const walletUpdate = await this._walletService.addFundsToWallet(booking.turfId, totalAmount, transctionTurf, "turf");
            const adminWalletUpdate = await this._walletService.addFundsToWallet(config.adminId,platformfee,adminTransaction,"admin");

            //joining chat room
            const chatRoom = await this._chatRoomRepo.findByGameId(booking.id);
            if(chatRoom){
                await this._chatRoomRepo.addUserToChatRoom(chatRoom?.id, data.userId as string);
            }
            

            if(!walletUpdate || !adminWalletUpdate){
                throw new Error("Wallet not updated for turf or admin");
            }
            console.log(booking);
            if (!booking) {
                throw new Error("Booking not found or already confirmed");
            }

            const hostUser = await this._clientRepo.findById(booking.userIds[0]);
            if(hostUser?.id){
                await this._notificationRepo.create(
                    hostUser.id,
                    NotificationType.JOINED_GAME,
                    `A player joined the game: ${booking.id}`,
                    "Player Joined"
                );
            }
            if(hostUser?.fcmToken){
                await messaging.send({
                    notification:{
                        title: "Player Joined",
                        body: `A player joined the game: ${booking.id}`,
                    },
                    token: hostUser.fcmToken,
                });
            }

            return booking;
        } catch (error:any) {
            console.error("JoinGameUseCase failed:", error);
            throw error;
        }
        
    }
}