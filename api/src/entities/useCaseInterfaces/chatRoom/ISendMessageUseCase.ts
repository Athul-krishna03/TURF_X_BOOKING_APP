import {  IMessageEntity } from "../../models/message.entity";

export interface ISendMessageUseCase{
    execute(chatRoomId: string | undefined, userId: string, content: string,messageType:"text" | "image"): Promise<IMessageEntity>
}