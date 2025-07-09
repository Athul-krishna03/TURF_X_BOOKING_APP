
import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterface/booking/IBookingRepository";
import { IDeleteUnfilledGamesUseCase } from "../../entities/useCaseInterfaces/IDeleteUnfilledGamesUseCase";
import { IWalletSercvices } from "../../entities/services/IWalletServices";
import { ISlotService } from "../../entities/services/ISlotService";

@injectable()
export class DeleteUnfilledGamesUseCase  implements IDeleteUnfilledGamesUseCase{
  constructor(
    @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
    @inject("IWalletSercvices") private _walletServices:IWalletSercvices,
    @inject("ISlotRepository") private _slotServices:ISlotService
  ) {}

  async checkDeadlines(): Promise<void> {
    try {
      const now = new Date();
      const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const allBookings = await this._bookingRepo.find();
      const bookings = allBookings.filter(booking => {
        if (booking.status !== "Pending" || booking.isSlotLocked) return false;
        const bookingDate = new Date(`${booking.date}T${booking.time}:00+05:30`);
        return bookingDate >= now && bookingDate <= deadline;
      });  
      for (const booking of bookings) {
        const totalPaid = Object.values(booking.walletContributions).reduce(
          (sum, amt) => sum + amt,
          0
        );
        if (
          booking.playerCount > booking.userIds.length ||
          totalPaid < booking.price
        ) {
          try {
            await this._bookingRepo.updateJoinedGameBookingStatus(booking.id, {
                status: "Cancelled",
                cancelledUsers: booking.userIds,
                refundsIssued: booking.walletContributions,
            });
            for (const userId of booking.userIds) {
              const amount =booking.price/booking.playerCount
              try {
                const transction = {
                        type: "credit",
                        amount: amount,
                        description: "Refund of booking because of lack of players"
                }
                await this._walletServices.addFundsToWallet(userId._id, booking.price/booking.playerCount,transction,"client")
              } catch (refundError:any) {
                console.error("Refund failed:", {
                  userId,
                  bookingId: booking.id,
                  error: refundError.message,
                });
              }
            }
            await this._slotServices.cancelTheSlots(booking)
          } catch (updateError:any) {
            console.error("Failed to cancel booking:", {
              bookingId: booking.id,
              error: updateError.message,
            });
          }
        }
      }
    } catch (error) {
      console.error("BookingDeadlineChecker error:", error);
    }
  }
}
