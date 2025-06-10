import { Server, Socket } from "socket.io";
import http from 'http';
import { ISendMessageUseCase } from "../../entities/useCaseInterfaces/chatRoom/ISendMessageUseCase";
import { inject, injectable } from "tsyringe";
import { IChatRoomRepository } from "../../entities/repositoryInterface/chatRoom/chat-room-repository";
import { ClientModel } from "../database/models/client.model";
import { IMessageRepository } from "../../entities/repositoryInterface/chatRoom/message-repository";
import { Types } from "mongoose";


@injectable()
export class SocketServer{
    private io:Server;

    constructor(
        server:http.Server,
        @inject("ISendMessageUseCase") private _sendMessageUseCase:ISendMessageUseCase,
        @inject("IChatRoomRepository") private _chatRoomRepository:IChatRoomRepository,
        @inject("IMessageRepository") private _messageRepo:IMessageRepository
    ){
        this.io = new Server(server,{
            cors:{
                origin: 'http://localhost:5173', 
                methods: ['GET', 'POST','PATCH'],
            }
        });
        this.setupSocketEvents();
    }
    private setupSocketEvents() {
        this.io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);
        
        socket.on('joinGame', async (gameId: string, userId: string) => {
            try {
                console.log("joined Game event",gameId,userId);
                
                const chatRoom = await this._chatRoomRepository.findByGameId(gameId);
                if (!chatRoom) {
                    socket.emit('error', 'Chat room not found');
                    return;
                }

                socket.join(gameId);
                const user = await ClientModel.findOne({ _id: userId }, { name: 1 });
                const username = user?.name || userId;

                await this._chatRoomRepository.addUserToChatRoom(chatRoom.id, userId);
                socket.to(gameId).emit('message', {
                    id: `sys-${Date.now()}`,
                    senderId: userId,
                    content: `${username} joined the chat`,
                    timestamp: new Date(),
                });

                const messages = await this._messageRepo.findByGameId(chatRoom.id);
                console.log("users id ",chatRoom)
                const users = await ClientModel.find(
                    { _id: {
                        $in: chatRoom.users.map(id => new Types.ObjectId(id))
                    }  
                },
                    { name: 1, email: 1, profileImage: 1 } // Select specific fields
                );

                console.log("messages data",messages,"users list",users)
                socket.emit('chatRoomData', {
                    messages, // list of message entities
                    users: users.map((u) => ({ id: u.id, username: u.name })),
                });

                await this._chatRoomRepository.addUserToChatRoom(chatRoom.id, userId);

            } catch (error) {
                console.error('joinGame error', error);
                socket.emit('error', 'Failed to join game');
            }
        });

        socket.on('sendMessage', async (gameId: string, userId: string, content: string) => {
            try {
            const chatRoom = await this._chatRoomRepository.findByGameId(gameId);
            if (!chatRoom) {
                socket.emit('error', 'Chat room not found');
                return;
            }
            const message = await this._sendMessageUseCase.execute(chatRoom.id, userId, content,"text");
            this.io.to(gameId).emit('message', message);
            } catch (err) {
            socket.emit('error', 'Failed to send message');
            }
        });

        socket.on('sendImage', async (gameId: string,userId:string, imageData: string) => {
            try {
            const chatRoom = await this._chatRoomRepository.findByGameId(gameId);
            if (!chatRoom) {
                socket.emit('error', 'Chat room not found');
                return;
            }
            const message = await this._sendMessageUseCase.execute(chatRoom.id, userId, imageData,"image");
            this.io.to(gameId).emit('message', message);
            } catch (err) {
            socket.emit('error', 'Failed to send image');
            }
        });

        // socket.on('reactToMessage', async (gameId: string,userId:string, messageId: string, reaction: string) => {
        //     try {
        //     const chatRoom = await this._chatRoomRepository.findByGameId(gameId);
        //     if (!chatRoom) {
        //         socket.emit('error', 'Chat room not found');
        //         return;
        //     }
        //     await this._chatRoomRepository.addReaction(chatRoom.id, messageId, userId, reaction);
        //     const updatedChatRoom = await this._chatRoomRepository.findByGameId(gameId);
        //     const message = updatedChatRoom?.messages ? updatedChatRoom.messages.find((m:IMessageEntity) => m.id === messageId): [];
        //     this.io.to(gameId).emit('messageUpdate', message);
        //     } catch (err) {
        //     socket.emit('error', 'Failed to add reaction');
        //     }
        // });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
        });
    }
}