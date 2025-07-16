import { inject, injectable } from "tsyringe";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { IBookingSlotUseCase } from "../../entities/useCaseInterfaces/IBookingSlotUseCase";
import { generateBookingId } from "../../frameworks/security/uniqueuid.bcrypt";
import { INotificationRepository } from "../../entities/repositoryInterface/notification/INotificationRepository";
import { NotificationType } from "../../shared/constants";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { messaging } from "../../shared/config";

@injectable()
export class BookingSlotUseCase implements IBookingSlotUseCase {
  constructor(
    @inject("IBookingRepository") private bookingRepo: IBookingRepository,
    @inject("INotificationRepository")
    private _notificationRepo: INotificationRepository,
    @inject("IClientRepository") private _clientRepo: IClientRepository
  ) {}
  async execute(
    userId: string,
    turfId: string,
    time: string,
    duration: number,
    price: number,
    date: string,
    paymentType: string,
    game: string,
    playerCount: number
  ): Promise<IBookingEntity> {
    try {
      const bookingId = generateBookingId();
      const data = {
        userId,
        turfId,
        bookingId,
        time,
        duration,
        price,
        date,
        paymentType,
        game,
        status: "Booked",
      };
      console.log("data inside usecase", data);
      if (paymentType == "single") {
        const saveData = await this.bookingRepo.save(data);
        return saveData as IBookingEntity;
      } else if (paymentType == "shared") {
        let userIds = [userId];
        let walletContributions = new Map<string, number>();
        walletContributions.set(userId, price);
        price = price * playerCount;
        let data = {
          turfId,
          time,
          userIds,
          bookingId,
          duration,
          price,
          date,
          paymentType,
          walletContributions,
          status: "Pending",
          game,
          playerCount,
        };
        const saveData = await this.bookingRepo.saveSharedBooking(data);
        const user = await this._clientRepo.findById(userId);
        if (user?.id) {
          await this._notificationRepo.create(
            userId,
            NotificationType.HOSTED_GAME,
            `Your booking for ${data.date} at ${data.time} has been created successfully.`,
            "Booking Created"
          );
            if (user?.fcmToken) {
              await messaging.send({
                notification: {
                  title: "Booking Created",
                  body: `Your booking for ${data.date} at ${data.time} has been created successfully.`,
                },
                token: user.fcmToken,
              });
            }
        }

        

        return saveData as IBookingEntity;
      } else {
        const saveData = await this.bookingRepo.save(data);
        return saveData as IBookingEntity;
      }
    } catch (error) {
      console.error("BookingSlotUseCase failed:", error);
      throw new Error("Failed to save");
    }
  }
}
