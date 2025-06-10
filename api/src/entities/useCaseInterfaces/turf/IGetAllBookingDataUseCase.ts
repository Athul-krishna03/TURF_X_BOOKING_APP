import { IBookingEntity } from "../../models/booking.entity";
import { ISharedBookingEntity } from "../../models/sharedBooking.entity";
import { ITurfEntity } from "../../models/turf.entity";


export interface IGetAllBookingDataUseCase{
    execute(userId:string): Promise<{normal:IBookingEntity[],hosted:ISharedBookingEntity[]}>
}