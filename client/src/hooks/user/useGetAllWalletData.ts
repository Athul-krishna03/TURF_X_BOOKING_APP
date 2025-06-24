import { useQuery } from "@tanstack/react-query";
import { FetchCustomerParams } from "../../types/AdminTypes";
import { WalletData } from "../../pages/user/WalletPage";

export type walletResponse={
    walletData:WalletData;
    totalPages:number;
    currentPage:number;
}

export const useGetAllWalletData=(
    queryFunc:(params:FetchCustomerParams)=>Promise<walletResponse>,
    page:number,
    limit:number,
    search:string,
)=>{
    return useQuery({
        queryKey:['wallet',page,limit,search],
        queryFn:()=>queryFunc({page,limit,search}),
        placeholderData:(prev)=>prev?{...prev}:undefined
    })
}