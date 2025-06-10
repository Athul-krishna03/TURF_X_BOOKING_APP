import { IChatRoomEntity } from "../../models/chatRoom.entity";

export interface IGetChatRoomUseCase{
    execute(userId:string):Promise<IChatRoomEntity[]>
}