import { userAxiosInstance } from "../../api/client.axios";
import { ChangePasswordData } from "../../hooks/user/userDashboard";


export const logoutUser = async () => {
    const response = await userAxiosInstance.post("/_us/user/logout");
    return response.data;
};


export const changePassword = async (data: ChangePasswordData) => {
    const response = await userAxiosInstance.patch(
    "/_us/user/change-password",
    data
);
    console.log("changePassword response", response);
    return response.data;
};


export const getAllTurfsData = async({
    page=1,
    limit=10,
    search="",
    location,
    filter
}:{
    page:number,
    limit:number,
    search:string,
    location?: [number, number]
    filter?:string
})=>{
    const reponse = await userAxiosInstance.get("/_us/user/get-Turfs",{
        params:{
        page,
        limit,
        search,
        lat: location?.[1],
        lng: location?.[0],
        filter
        }
    });
    return reponse.data
}

export const slots = async (turfId: string, date: string) => {
    const response = await userAxiosInstance.get(`/_us/user/slots?turfId=${turfId}&date=${date}`);
    return response.data;
};

export const paymentService = async (slotId:string,price:number)=>{
    console.log("payment service");
    
    const response = await userAxiosInstance.post("/_us/user/payments/create-payment-intent",{slotId,price})
    console.log("payment api response",response);
    return response
}

export const sharedSlotPaymentService = async (price:number) => {
    const response = await userAxiosInstance.post("/_us/user/payments/create-payment-intent",{price})
    console.log("shared payment api response",response);
    return response
}

export const slotUpdate = async (
    date: string, 
    slotId: string, 
    price: number, 
    duration: number, 
    paymentIntentId: string, 
    slotLockId: string,
    paymentType:string,
    playerCount?:number
) => {
    const response = await userAxiosInstance.post(`/_us/user/slots`, { 
        date,
        isBooked: true,
        slotId,
        price,
        duration,
        slotLockId,
        paymentIntentId,
        paymentType,
        playerCount
    })
    return response
}

export const sharedSlotJoin = async(date:string,slotId:string,price:number)=>{
    console.log(date,slotId)
    const response = await userAxiosInstance.post(`/_us/user/joinSlot`,{
        date,slotId,price
    })
    console.log("shared slot data",response);
    
    return response.data.bookingData
}

export const getAllBookings = async ()=>{
    const response = await userAxiosInstance.get(`/_us/user/bookings`)
    console.log("booking data",response);
    
    return response.data.data
}

export const getSlotData = async (slotId:string)=>{
    const response = await userAxiosInstance.get(`/_us/user/getSlot?slotId=${slotId}`)
    console.log(response);
    
    return response.data.slotData
}

export const fetchHostedGames = async () => {
    const response = await userAxiosInstance.get("/_us/user/hosted-games")
    console.log(response);
    
    return response.data.games
}

export const getJoinedGameDetials = async (bookingId:string | undefined)=>{
    const response = await userAxiosInstance.get(`/_us/user/joinedGameDetials?bookingId=${bookingId}`)
    console.log("joinedGameDetials",response);

    return response.data.joinedGameDetials 
    
}

export const cancelBooking = async (bookingId:string | null ,bookingType:string,isHost?:boolean) => {
    if(bookingType== "joined"){
        const response = await userAxiosInstance.patch(`/_us/user/cancelJoinedGame`,{bookingId,bookingType,isHost})
        return response
    }else{
        const response = await userAxiosInstance.patch(`/_us/user/cancelSingleSlot`,{bookingId,bookingType})
        return response
    }
    
}

export const getWalletData = async () => {
    const response = await userAxiosInstance.get("/_us/user/wallet");
    console.log("wallet data", response);
    return response.data;
}


export const getChatRooms = async (userId: string) => {
    console.log("api calling");
    
    const response = await userAxiosInstance.get(`/_us/user/getChatRooms?userId=${userId}`);
    console.log("getChatRooms", response);
    return response.data.data;
};

export const createChatRoom = async (data:object) => {
    console.log("createChatRoom data", data);
    const response = await userAxiosInstance.post("/_us/user/createChatRoom", data);
    return response.data;
};

export const getChatRoomByGameId = async (gameId: string) => {
    const response = await userAxiosInstance.get(`/_us/user/getChatRoomByGameId?gameId=${gameId}`);
    console.log("getChatRoomByGameId response", response);
    return response.data;
};

export const saveFCMtoken = async (token: string) => {
    const response = await userAxiosInstance.post("/_us/user/savefcm-token", {
        token,
    });
    return response.data;
};

export const getNotifications = async()=>{
    const response = await userAxiosInstance.get(`/_us/user/notification`);
    return response.data
}

export const updateNotification = async (payload:{id?:string,all?:boolean})=>{
    const response = await userAxiosInstance.patch(`/_us/user/notification`,payload);
    return response.data
}

export const getReviews = async (turfId:string)=>{
    const response = await userAxiosInstance.get(`/_us/user/getReview?turfId=${turfId}`)
    console.log("review data",response.data)
    return response.data.reviews
}

export const addReview = async ({turfId,rating,reviewText,}: {turfId: string;rating: string;reviewText: string;}) => {
  const response = await userAxiosInstance.post(`/_us/user/review`, {
    turfId,
    rating,
    reviewText,
  });
  return response.data;
};