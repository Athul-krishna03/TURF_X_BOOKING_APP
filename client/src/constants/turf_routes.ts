import { BASE_URL } from "./route";

export const TURF_ROUTES = {
    LOGOUT_TURF: `${BASE_URL.TURF}/logout`,
    GENERATE_SLOTS: `${BASE_URL.TURF}/generateSlots`,
    GENERATE_SLOTS_DATE_RANGE: `${BASE_URL.TURF}/generateSlots`,
    CHANGE_TURF_PASSWORD: `${BASE_URL.TURF}/change-password`,
    FETCH_SLOTS: (turfId: string, date: string) =>`${BASE_URL.TURF}/slots?turfId=${turfId}&date=${date}`,
    UPDATE_SLOT_STATUS: (id: string) =>`${BASE_URL.TURF}/updateSlot?id=${id}`,
    GET_TURF_BOOKINGS: `${BASE_URL.TURF}/getBookingDetials`,
    CANCEL_TURF_BOOKING: `${BASE_URL.TURF}/cancelBooking`,
    GET_TURF_DASHBOARD_DATA: `${BASE_URL.TURF}/getTurfDashBoardData`,
    REFRESH_TOKEN: `${BASE_URL.TURF}/refresh-token`,

};
