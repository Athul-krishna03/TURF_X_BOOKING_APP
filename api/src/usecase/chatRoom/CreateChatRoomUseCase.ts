import { inject, injectable } from "tsyringe";
import { IChatRoomRepository } from "../../entities/repositoryInterface/chatRoom/chat-room-repository";
import { IChatRoomEntity } from "../../entities/models/chatRoom.entity";
import { ICreateChatRoomUseCase } from "../../entities/useCaseInterfaces/chatRoom/ICreateChatRoomUseCase";


@injectable()
export class CreateChatRoomUseCase implements ICreateChatRoomUseCase{
    constructor(
        @inject("IChatRoomRepository") private _chatRoomRepo:IChatRoomRepository
    ){}

    async execute(chatRoom:IChatRoomEntity):Promise<IChatRoomEntity>{
        return await this._chatRoomRepo.create(chatRoom)
    }
}