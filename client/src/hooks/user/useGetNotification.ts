import { getNotifications } from "../../services/user/userServices";
import { useQuery } from "@tanstack/react-query";

export const useNotification = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};
