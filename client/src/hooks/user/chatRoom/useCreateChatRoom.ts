import { useMutation } from "@tanstack/react-query";
import { createChatRoom } from "../../../services/user/userServices";

export const useCreateChatRoom = () => {
    return useMutation({
        mutationFn: (data: object) => createChatRoom(data),
    });
};
