import { axiosInstance } from "../../api/private.axios";
import { ADMIN_ROUTES } from "../../constants/admin_routes";

export const getAllUsers = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const reponse = await axiosInstance.get(ADMIN_ROUTES.GET_ALL_USERS, {
    params: {
      page,
      limit,
      search,
    },
  });
  return reponse.data;
};

export const logoutAdmin = async () => {
  const response = await axiosInstance.post(ADMIN_ROUTES.LOGOUT_ADMIN);
  return response.data;
};

export const updateStatus = async (userId: string) => {
  console.log("Updating user status for ID:", userId);
  try {
    const reponse = await axiosInstance.patch(
      ADMIN_ROUTES.UPDATE_USER_STATUS(userId),
      {}
    );
    return reponse.data;
  } catch (error: unknown) {
    throw new Error((error as Error).message || "Failed to update status");
  }
};

export const updateTurfStatus = async (turfId: string) => {
  try {
    const reponse = await axiosInstance.patch(ADMIN_ROUTES.UPDATE_TURF_STATUS(turfId),
      {}
    );
    return reponse.data;
  } catch (error: unknown) {
    throw new Error((error as Error).message || "Failed to update status");
  }
};

export const getAllTurfs = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const reponse = await axiosInstance.get(ADMIN_ROUTES.GET_ALL_TURFS, {
    params: {
      page,
      limit,
      search,
    },
  });
  return reponse.data;
};

export const getAllTurfRequests = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  const reponse = await axiosInstance.get(ADMIN_ROUTES.GET_ALL_TURF_REQUESTS, {
    params: {
      page,
      limit,
      search,
    },
  });
  return reponse.data;
};
export const updateRequestStatus = async (
  turfId: string,
  status: string,
  reason?: string
) => {
  try {
    const reponse = await axiosInstance.patch(
      ADMIN_ROUTES.UPDATE_REQUEST_STATUS(turfId),
      { status, reason }
    );
    return reponse.data;
  } catch (error: unknown) {
    throw new Error((error as Error).message || "Failed to update status");
  }
};

export const getAdminDashBoardData = async () => {
  try {
    const response = await axiosInstance.get(ADMIN_ROUTES.GET_ADMIN_DASHBOARD_DATA);
    return response.data.dashBoardData;
  } catch (error: unknown) {
    console.error("Error fetching admin dashboard data:", error);
    throw new Error("Failed to fetch admin dashboard data");
  }
};

export const getRevenueData = async () => {
  try {
    const response = await axiosInstance.get(ADMIN_ROUTES.GET_REVENUE_DATA);
    return response.data.revenueData;
  } catch (error) {
    console.error("Failed to fetch revenue data", error);
    throw new Error("Failed to fetch revenue data");
  }
}