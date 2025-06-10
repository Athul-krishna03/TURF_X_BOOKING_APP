import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "../../services/auth/authServices";
import { changePassword, saveFCMtoken } from "../../services/user/userServices";



export interface ChangePasswordData { 
    currPass: string;
    newPass: string;
}


export const useUserChangePassword=()=>{
    return useMutation<AxiosResponse,Error,ChangePasswordData>({
        mutationFn:changePassword
    })
}

export const useStoreFCMToken = ()=>{
    return useMutation({
        mutationFn:saveFCMtoken
    })
}