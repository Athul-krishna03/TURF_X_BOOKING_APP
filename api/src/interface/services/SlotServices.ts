import { ISlotRepository } from "../../entities/repositoryInterface/turf/ISlotRepository";
import { addHours, format, parse } from "date-fns";
import { ISlotEntity } from "../../entities/models/slot.entity";
import { inject, injectable } from "tsyringe";
import { ISlotService } from "../../entities/services/ISlotService";
import { ISlot } from "../../usecase/turf/GenerateSlotsUseCase";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { ISharedBookingEntity } from "../../entities/models/sharedBooking.entity";

@injectable()
export class SlotService implements ISlotService {
  constructor(@inject("ISlotRepository") private slotRepo: ISlotRepository) {}

  async findBySlotId(slotId: string): Promise<ISlotEntity> {
    return await this.slotRepo.findById(slotId);
  }
  async validateAndGetSlots(
    slotId: string,
    duration: number
  ): Promise<ISlotEntity[]> {
    console.log("duration ", duration);

    const initialSlot = await this.slotRepo.findById(slotId);
    if (!initialSlot || initialSlot.isBooked) throw new Error("Slot not found");

    if (duration < 1) throw new Error("Duration must be at least 1 hour");

    const { turfId, date, startTime } = initialSlot;
    const startDateTime = parse(startTime, "HH:mm", new Date(date));
    const slotsToBook = [initialSlot];

    for (let i = 1; i < duration; i++) {
      const nextTime = addHours(startDateTime, i);
      const nextTimeStr = format(nextTime, "HH:mm");
      const nextSlot = await this.slotRepo.findOne({
        turfId,
        date,
        startTime: nextTimeStr,
      });

      if (!nextSlot || nextSlot.isBooked) {
        throw new Error(
          `Slot at ${nextTimeStr} is unavailable or already booked`
        );
      }

      slotsToBook.push(nextSlot);
    }

    return slotsToBook;
  }

  async bookSlots(slots: ISlotEntity[]): Promise<ISlotEntity[]> {
    const results = [];
    for (const slot of slots) {
      const updated = await this.slotRepo.update(slot.id, { isBooked: true });
      if (!updated) throw new Error(`Failed to update slot ${slot.id}`);
      results.push(updated);
    }
    return results;
  }

  async releaseSlots(slots: ISlotEntity[]): Promise<ISlotEntity[]> {
    const results = [];
    for (const slot of slots) {
      const updated = await this.slotRepo.update(slot.id, { isBooked: false });
      results.push(updated);
    }
    return results;
  }
  async cancelTheSlots(bookingData: IBookingEntity | ISharedBookingEntity): Promise<void> {
    const startDateTime = parse(bookingData.time, "HH:mm", new Date(bookingData.date));
    for (let i = 0; i < bookingData.duration; i++) {
      const nextTime = addHours(startDateTime, i);
      const nextTimeStr = format(nextTime, "HH:mm");
      const date = new Date(bookingData.date).toLocaleDateString("en-CA");
      const slotData = await this.slotRepo.findOne({
        turfId: bookingData.turfId,
        date: date,
        startTime: nextTimeStr,
      });
      if (slotData) {
        await this.slotRepo.update(slotData.id!, { isBooked: false });
      }
    }
  }
}
