import { IChatRoomEntity } from "../../models/chatRoom.entity";

export interface IGetChatRoomByGameIdUseCase{
    execute(gameId: string): Promise<IChatRoomEntity | null>;
}