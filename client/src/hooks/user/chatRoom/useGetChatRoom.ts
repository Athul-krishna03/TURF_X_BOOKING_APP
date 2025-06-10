import { useQuery } from "@tanstack/react-query";
import { getChatRooms } from "../../../services/user/userServices";

export const useGetAllChatRooms = (userId:string) => {
    return useQuery({
        queryKey:['chatRooms', userId],
        queryFn: () => getChatRooms(userId)
    });
};