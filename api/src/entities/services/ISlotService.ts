import { ISlot } from "../../usecase/turf/GenerateSlotsUseCase"
import { IBookingEntity } from "../models/booking.entity"
import { ISharedBookingEntity } from "../models/sharedBooking.entity"
import { ISlotEntity } from "../models/slot.entity"


export interface ISlotService{
    findBySlotId(slotId:string):Promise<ISlotEntity>
    validateAndGetSlots(slotId: string, duration: number):Promise<ISlotEntity[]>
    bookSlots(slots: ISlotEntity[]):Promise<ISlotEntity[]>
    releaseSlots(slots: ISlotEntity[]):Promise<ISlotEntity[]>
    cancelTheSlots(bookingData: IBookingEntity | ISharedBookingEntity): Promise<void>
}