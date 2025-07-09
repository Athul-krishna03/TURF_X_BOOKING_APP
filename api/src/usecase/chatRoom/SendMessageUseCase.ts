import { inject, injectable } from "tsyringe";
import { IMessageEntity } from "../../entities/models/message.entity";
import { IChatRoomRepository } from "../../entities/repositoryInterface/chatRoom/chat-room-repository";
import { ISendMessageUseCase } from "../../entities/useCaseInterfaces/chatRoom/ISendMessageUseCase";
import { IMessageRepository } from "../../entities/repositoryInterface/chatRoom/message-repository";
import { INotificationRepository } from "../../entities/repositoryInterface/notification/INotificationRepository";
import { NotificationType } from "../../shared/constants";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { messaging } from "../../shared/config";


@injectable()
export class SendMessageUseCase implements ISendMessageUseCase{
    constructor(
        @inject("IChatRoomRepository") private _chatRoomRepo:IChatRoomRepository,
        @inject("IMessageRepository") private _messageRepo:IMessageRepository,
        @inject("INotificationRepository") private _notificationRepo:INotificationRepository,
        @inject("IClientRepository") private _clientRepo:IClientRepository
    ){}
    async execute(chatRoomId: string, userId: string, content: string,messageType:"text" | "image"): Promise<IMessageEntity> {
    const message: IMessageEntity = {
        messageId: `msg-${Date.now()}`,
        communityId: chatRoomId,
        senderId: userId,
        messageType: messageType,
        content:messageType === "text" ? content : "",
        mediaUrl: messageType === "image" ? content : "",
        timestamp: new Date(),
        status: "sent",
        readBy: []
    };
    const chatRoom = await this._chatRoomRepo.findById(chatRoomId);
    for (const ids of chatRoom?.users || []) { 
        const user = await this._clientRepo.findById(ids);
        console.log("user in sendMessageUseCase",user)
        if (user?.id && user.id !== userId) {
            await this._notificationRepo.create(
                user.id,
                NotificationType.MESSAGE,
                "New Message",
                `You have a new message from ${user.name} from ${chatRoom?.name}`,
            );
        

            if(user?.fcmToken) {
                // Send FCM notification
                const payload = {
                    notification: {
                        title: "New Message",
                        body: `You have a new message from ${message.senderId}`,
                    }
                };
                try {
                    await messaging.send({notification: payload.notification, token: user.fcmToken});
                } catch (error) {
                    console.error("Error sending FCM notification:", error);
                }
            }
        }

    }
    await this._messageRepo.create(message);

    return message;
}
}