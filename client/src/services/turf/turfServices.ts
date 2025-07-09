import { axiosInstance } from "../../api/private.axios";
import { TurfBookingResponse } from "../../components/turf/bookingManagement";
import { TURF_ROUTES } from "../../constants/turf_routes";
import { ChangePasswordData } from "../../hooks/user/userDashboard";

export const logoutTurf = async () => {
  const response = await axiosInstance.post(TURF_ROUTES.LOGOUT_TURF);
  return response.data;
};
export const generateSlots = async (
  turfId: string,
  date: string,
  startTime: string,
  endTime: string,
  slotDuration: number,
  price: number
) => {
  const response = await axiosInstance.post(TURF_ROUTES.GENERATE_SLOTS, {
    turfId,
    date,
    startTime,
    endTime,
    slotDuration,
    price,
  });
  return response.data;
};

export const generateSlotsDateRange = async (
  turfId: string,
  selectedDate: string, // start date
  endDate: string, // end date
  startTime: string,
  endTime: string,
  slotDuration: number,
  price: number
) => {
  const response = await axiosInstance.post(TURF_ROUTES.GENERATE_SLOTS_DATE_RANGE, {
    turfId,
    selectedDate,
    endDate,
    startTime,
    endTime,
    slotDuration,
    price,
  });
  return response.data;
};

export const changeTurfPassword = async (data: ChangePasswordData) => {
  const response = await axiosInstance.patch(TURF_ROUTES.CHANGE_TURF_PASSWORD, data);
  console.log("changeturfPassword response", response);
  return response.data;
};

export const fetchSlots = async (turfId: string, date: string) => {
  const response = await axiosInstance.get(
    TURF_ROUTES.FETCH_SLOTS(turfId, date)
  );
  return response.data;
};

export const updateSlotStatus = async (id: string) => {
  const response = await axiosInstance.patch(TURF_ROUTES.UPDATE_SLOT_STATUS(id));
  return response;
};

export const getTurfBookings = async (): Promise<TurfBookingResponse> => {
  const response = await axiosInstance.get(TURF_ROUTES.GET_TURF_BOOKINGS);
  return response.data.data;
};

export const cancelTurfBooking = async (
  bookingId: string,
  bookingType: string
) => {
  const response = await axiosInstance.patch(TURF_ROUTES.CANCEL_TURF_BOOKING, {
    bookingId,
    bookingType,
  });
  return response.data;
};

export const getTurfDashBoardData = async () => {
  const response = await axiosInstance.get(TURF_ROUTES.GET_TURF_DASHBOARD_DATA);
  console.log("dashBoard", response);
  return response.data.dashBoardData;
};
