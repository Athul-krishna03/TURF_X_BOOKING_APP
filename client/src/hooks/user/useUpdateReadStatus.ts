import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotification } from "../../services/user/userServices";

interface UpdateNotificationPayload {
    id?: string;
    all?: boolean;
}

export const useUpdateReadStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<
        any,
        Error,
        UpdateNotificationPayload 
    >({
        mutationFn: (payload: UpdateNotificationPayload) => updateNotification(payload),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error) => {
        console.error('Mutation failed:', error);
        },
    });
};