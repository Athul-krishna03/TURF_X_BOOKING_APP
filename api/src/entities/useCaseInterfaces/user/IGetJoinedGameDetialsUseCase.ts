import { TurfDto } from "../../../shared/utils/MappingTurfData";
import { ISharedBookingEntity } from "../../models/sharedBooking.entity";

export interface IGetJoinedGameDetialsUseCase{
    execute(bookingId: string): Promise<{booking: ISharedBookingEntity; turf: TurfDto | null;}>
}