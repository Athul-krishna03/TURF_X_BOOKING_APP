import { inject, injectable } from "tsyringe";
import { IChatRoomEntity } from "../../entities/models/chatRoom.entity";
import { IGetChatRoomByGameIdUseCase } from "../../entities/useCaseInterfaces/chatRoom/IGetChatRoomByGameIdUseCase";
import { IChatRoomRepository } from "../../entities/repositoryInterface/chatRoom/chat-room-repository";

@injectable()
export class GetChatRoomByGameIdUseCase implements IGetChatRoomByGameIdUseCase {
    constructor(
        @inject("IChatRoomRepository") private _chatRoomRepo:IChatRoomRepository
    ){}
    async execute(gameId: string): Promise<IChatRoomEntity | null> {
        return this._chatRoomRepo.findByGameId(gameId);
    }
}