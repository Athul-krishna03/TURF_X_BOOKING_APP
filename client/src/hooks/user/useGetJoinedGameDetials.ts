import { useQuery } from "@tanstack/react-query"
import { getJoinedGameDetials } from "../../services/user/userServices"

export const useGetJoinedGameDetials=(joinedGameId:string)=>{
    return useQuery({
        queryKey:["joinedGameId",joinedGameId],
        queryFn: () => getJoinedGameDetials(joinedGameId)
    })

}