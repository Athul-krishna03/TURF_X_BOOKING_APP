import { useQuery } from "@tanstack/react-query"
import { getChatRoomByGameId } from "../../../services/user/userServices"

export const useGetChatRoomByGameId = (gameId:string)=>{
    return useQuery({
        queryKey:['room',gameId],
        queryFn:()=>getChatRoomByGameId(gameId)

    })
}