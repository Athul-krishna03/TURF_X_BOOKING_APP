import { useQuery } from "@tanstack/react-query";
import { getAdminDashBoardData } from "../../services/admin/adminService";

export const useGetAdminDashboardData = () => {
    return useQuery({
        queryKey: ["adminDashboardData"],
        queryFn: () => getAdminDashBoardData(),
    });
}