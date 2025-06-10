import { IChatRoomEntity } from "../../models/chatRoom.entity";

export interface ICreateChatRoomUseCase{
    execute(chatRoom:IChatRoomEntity):Promise<IChatRoomEntity>
}