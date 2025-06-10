import { IChatRoomEntity } from "../../../entities/models/chatRoom.entity";
import {  IMessageEntity } from "../../../entities/models/message.entity";
import { IChatRoomRepository } from "../../../entities/repositoryInterface/chatRoom/chat-room-repository";
import { ChatRoomModel } from "../../../frameworks/database/models/chatRoom.model";

export class ChatRoomRepository implements IChatRoomRepository{
    async create(chatRoom: IChatRoomEntity): Promise<IChatRoomEntity> {
        return await ChatRoomModel.create(chatRoom)
    }
    async findByGameId(gameId: string): Promise<IChatRoomEntity | null> {
        const chatRoom = await ChatRoomModel.findOne({ gameId });
        if (!chatRoom) return null;

        const plain = chatRoom.toObject();
        return { id: chatRoom._id.toString(), ...plain };
    }

    async findById(chatRoomId: string): Promise<IChatRoomEntity | null> {
        return await ChatRoomModel.findById({_id:chatRoomId})
    }

    async addUserToChatRoom(chatRoomId: string, userId: string): Promise<void> {
        console.log("chtaId",chatRoomId,"userId",userId);
        await ChatRoomModel.findByIdAndUpdate(
        { _id: chatRoomId },
        { $addToSet: { users: userId } }, 
        );
    }

    async addReaction(chatRoomId: string, messageId: string, userId: string, reaction: string): Promise<void> {
        await ChatRoomModel.updateOne(
        { _id: chatRoomId, 'messages.id': messageId },
        { $push: { 'messages.$.reactions': { userId, reaction } } },
        );
    }

    async getChatRooms(userId: string): Promise<IChatRoomEntity[]> {
        const chatRooms = await ChatRoomModel.find({ users: userId });
        return chatRooms.map((chatRoom) => ({
        id: chatRoom._id.toString(),
        ...chatRoom.toObject(),
        }));
    }
}