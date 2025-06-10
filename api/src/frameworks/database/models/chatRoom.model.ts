import { ObjectId,Document, model } from "mongoose";
import { IChatRoomEntity } from "../../../entities/models/chatRoom.entity";
import { ChatRoomSchema } from "../schemas/chatRoom.Schema";

export interface IChatRoomModel extends Omit<IChatRoomEntity,"id">,Document{
    _id:ObjectId
}

export const ChatRoomModel = model<IChatRoomModel>("ChatRoom",ChatRoomSchema)