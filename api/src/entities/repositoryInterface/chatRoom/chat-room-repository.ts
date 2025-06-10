import { IChatRoomEntity } from "../../models/chatRoom.entity";
import {  IMessageEntity } from "../../models/message.entity";


export interface IChatRoomRepository {
    create(chatRoom: IChatRoomEntity): Promise<IChatRoomEntity>;
    findByGameId(gameId: string): Promise<IChatRoomEntity | null>;
    findById(chatRoomId: string): Promise<IChatRoomEntity | null>
    addUserToChatRoom(chatRoomId: string | undefined, userId: string): Promise<void>;
    getChatRooms(userId: string): Promise<IChatRoomEntity[]>
    addReaction(chatRoomId:string | undefined, messageId: string, userId: string, reaction: string): Promise<void>;
}