import { BASE_URL } from "./route";


export const ADMIN_ROUTES = {
    GET_ALL_USERS: `${BASE_URL.ADMIN}/get-Users`,
    LOGOUT_ADMIN: `${BASE_URL.ADMIN}/logout`,
    UPDATE_USER_STATUS: (turfId: string) =>`${BASE_URL.ADMIN}/user-status/${turfId}`,
    UPDATE_TURF_STATUS: (turfId: string) =>`${BASE_URL.ADMIN}/turf-status/${turfId}`,
    GET_ALL_TURFS: `${BASE_URL.ADMIN}/get-Turfs`,
    GET_ALL_TURF_REQUESTS: `${BASE_URL.ADMIN}/get-Requests`,
    UPDATE_REQUEST_STATUS: (turfId: string) =>`${BASE_URL.ADMIN}/request-status/${turfId}`,
    GET_ADMIN_DASHBOARD_DATA: `${BASE_URL.ADMIN}/get-Dashboard`,
    GET_REVENUE_DATA: `${BASE_URL.ADMIN}/getRevenueData`,
    REFRESH_TOKEN:`${BASE_URL.ADMIN}/refresh-token`,
};
