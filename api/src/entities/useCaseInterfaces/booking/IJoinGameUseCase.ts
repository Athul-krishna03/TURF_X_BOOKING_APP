import { ISharedBookingEntity } from "../../models/sharedBooking.entity";

export interface IJoinGameUseCase{
    execute(data: {userId:string,date:string,price:number}): Promise<ISharedBookingEntity | null>
}