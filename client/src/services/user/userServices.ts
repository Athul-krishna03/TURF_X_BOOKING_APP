
import { axiosInstance } from "../../api/private.axios";
import { USER_ROUTES } from "../../constants/user_routes";
import { ChangePasswordData } from "../../hooks/user/userDashboard";

export const logoutUser = async () => {
  const response = await axiosInstance.post(USER_ROUTES.LOGOUT);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData) => {
  const response = await axiosInstance.patch(USER_ROUTES.CHANGE_PASSWORD, data);
  console.log("changePassword response", response);
  return response.data;
};

export const getAllTurfsData = async ({
  page = 1,
  limit = 10,
  search = "",
  location,
  filter,
}: {
  page: number;
  limit: number;
  search: string;
  location?: [number, number];
  filter?: string;
}) => {
  const reponse = await axiosInstance.get(USER_ROUTES.GET_TURFS, {
    params: {
      page,
      limit,
      search,
      lat: location?.[1],
      lng: location?.[0],
      filter,
    },
  });
  return reponse.data;
};

export const slots = async (turfId: string, date: string) => {
  const response = await axiosInstance.get(
    USER_ROUTES.SLOTS(turfId, date)
  );
  return response.data;
};

export const paymentService = async (slotId: string, price: number,durarion:number) => {
  console.log("payment service");

  const response = await axiosInstance.post(
    USER_ROUTES.PAYMENT_CREATE_INTENT,
    { slotId, price ,durarion }
  );
  console.log("payment api response", response);
  return response;
};

export const sharedSlotPaymentService = async (price: number) => {
  const response = await axiosInstance.post(
    USER_ROUTES.SHARED_SLOT_PAYMENT,
    { price }
  );
  console.log("shared payment api response", response);
  return response;
};

export const slotUpdate = async (
  date: string,
  slotId: string,
  price: number,
  game:string,
  duration: number,
  paymentIntentId: string,
  slotLockId: string,
  paymentType: string,
  playerCount?: number
) => {
  const response = await axiosInstance.post(USER_ROUTES.SLOT_UPDATE, {
    date,
    isBooked: true,
    slotId,
    price,
    duration,
    slotLockId,
    paymentIntentId,
    paymentType,
    playerCount,
    game
  });
  return response;
};

export const sharedSlotJoin = async (
  date: string,
  slotId: string,
  price: number
) => {
  console.log(date, slotId);
  const response = await axiosInstance.post(USER_ROUTES.SHARED_SLOT_JOIN, {
    date,
    slotId,
    price,
  });
  console.log("shared slot data", response);

  return response.data.bookingData;
};

export const getAllBookings = async () => {
  const response = await axiosInstance.get(USER_ROUTES.GET_ALL_BOOKING);
  console.log("booking data", response);

  return response.data.data;
};

export const getSlotData = async (slotId: string) => {
  const response = await axiosInstance.get(
    USER_ROUTES.GET_SLOT_DATA(slotId)
  );
  console.log(response);

  return response.data.slotData;
};

export const fetchHostedGames = async () => {
  const response = await axiosInstance.get(USER_ROUTES.FETCH_HOSTED_GAMES);
  console.log(response);

  return response.data.games;
};

export const getJoinedGameDetials = async (bookingId: string | undefined) => {
  const response = await axiosInstance.get(
    USER_ROUTES.GET_JOINED_GAME_DETAILS(bookingId)
  );
  console.log("joinedGameDetials", response);

  return response.data.joinedGameDetials;
};

export const cancelBooking = async (
  bookingId: string | null,
  bookingType: string,
  isHost?: boolean
) => {
  if (bookingType == "joined") {
    const response = await axiosInstance.patch(USER_ROUTES.CANCEL_BOOKING, {
      bookingId,
      bookingType,
      isHost,
    });
    return response;
  } else {
    const response = await axiosInstance.patch(USER_ROUTES.CANCEL_BOOKING_SINGLE, {
      bookingId,
      bookingType,
    });
    return response;
  }
};

export const getWalletData = async () => {
  const response = await axiosInstance.get(USER_ROUTES.GET_WALLET_DETAILS);
  console.log("wallet data", response);
  return response.data;
};

export const getChatRooms = async (userId: string) => {
  console.log("api calling");

  const response = await axiosInstance.get(
    USER_ROUTES.GET_CHAT_ROOMS(userId)
  );
  return [response.data.data,response.data.newsData]
};

export const createChatRoom = async (data: object) => {
  console.log("createChatRoom data", data);
  const response = await axiosInstance.post(USER_ROUTES.CREATE_CHAT_ROOM, data);
  return response.data;
};

export const getChatRoomByGameId = async (gameId: string) => {
  const response = await axiosInstance.get(
    USER_ROUTES.GET_CHAT_ROOM_BY_GAME_ID(gameId)
  );
  console.log("getChatRoomByGameId response", response);
  return response.data;
};

export const saveFCMtoken = async (token: string) => {
  const response = await axiosInstance.post(USER_ROUTES.SAVE_FCM_TOKEN, {
    token,
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await axiosInstance.get(USER_ROUTES.GET_NOTIFICATIONS);
  return response.data;
};

export const updateNotification = async (payload: {
  id?: string;
  all?: boolean;
}) => {
  const response = await axiosInstance.patch(USER_ROUTES.UPDATE_NOTIFICATION, payload);
  return response.data;
};

export const getReviews = async (turfId: string) => {
  const response = await axiosInstance.get(
    USER_ROUTES.GET_REVIEWS(turfId)
  );
  console.log("review data", response.data);
  return response.data.reviews;
};

export const addReview = async ({
  turfId,
  rating,
  reviewText,
}: {
  turfId: string;
  rating: string;
  reviewText: string;
}) => {
  const response = await axiosInstance.post(USER_ROUTES.ADD_REVIEW, {
    turfId,
    rating,
    reviewText,
  });
  return response.data;
};
