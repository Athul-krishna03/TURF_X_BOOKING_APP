import { useQuery } from "@tanstack/react-query"
import { FetchCustomerParams } from "../../types/AdminTypes"
import { HostedGame } from "../../components/user/HostedGamesList"


type HostedGamesResponse ={
    games: HostedGame,
    totalPages:number;
    currentPage:number
}
export const useGetAllHostedGames=(
    queryFunc:(params:FetchCustomerParams)=>Promise<HostedGamesResponse>,
    page:number,
    limit:number,
    search:string,
)=>{
    return useQuery({
        queryKey:["Hosted Games",page,limit,search],
        queryFn:()=>queryFunc({page,limit,search}),
        placeholderData:(prev)=>prev?{...prev}:undefined,
    })
}