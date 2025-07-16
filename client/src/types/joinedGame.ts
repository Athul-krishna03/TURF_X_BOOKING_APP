import { String } from "lodash";
import { BookingType } from "./Booking";


export interface JoinedGameBooking extends BookingType {
  joinedUsers: {
    _id: string;
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  }[];
  playerCount: number;
  walletBalance: number;
}
