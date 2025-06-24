import axios from "axios";
import { store } from "../store/store";
import { userLogout } from "../store/slices/user.slice";
import { adminLogout } from "../store/slices/admin.slice";
import { turfLogout } from "../store/slices/turf.slice";
import { toast } from "../hooks/useToast";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_PRIVATE_URL,
    withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log("original",originalRequest)
        const urlParse = originalRequest.url.split("/")[1];
        let role: string | "";

        switch (urlParse) {
        case "_us":
            role = "user";
            break;
        case "_ad":
            role = "admin";
            break;
        case "_ts":
            role = "turf";
            break;
        default:
            role = "";
        }

        if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        error.response?.data?.message === "Token Expired"
        ) {
        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;
            try {
            const refreshEndpoint =
                role === "admin"
                ? "/_ad/admin/refresh_token"
                : role === "user"
                ? "/_us/user/refresh-token"
                : role === "turf"
                ? "/_ts/turf/refresh-token"
                : "";

            await axiosInstance.post(refreshEndpoint);
            isRefreshing = false;
            return axiosInstance(originalRequest);
            } catch (refreshError) {
            isRefreshing = false;
            handleLogout(role);
            return Promise.reject(refreshError);
            }
        }
        }

        const message = error.response?.data?.message;

        if (
        error.response?.status === 403 &&
        ["Token is blacklisted", "Access denied. You do not have permission to access this resource.", "Access denied: Your account has been blocked"].includes(
            message
        ) &&
        !originalRequest._retry
        ) {
        handleLogout(role);
        return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

function handleLogout(role: string) {
    if (role === "admin") {
        store.dispatch(adminLogout());
        window.location.href = "/admin/login";
    } else if (role === "user") {
        store.dispatch(userLogout());
        window.location.href = "/";
    } else if (role === "turf") {
        store.dispatch(turfLogout());
        window.location.href = "/";
    }

    toast({
        title: "Error",
        description: "Please Login again",
        variant: "destructive",
        duration: 3000,
    });
}
