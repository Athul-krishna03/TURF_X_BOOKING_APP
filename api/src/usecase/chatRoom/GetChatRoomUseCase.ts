import { inject ,injectable} from "tsyringe";
import { IChatRoomEntity } from "../../entities/models/chatRoom.entity";
import { IGetChatRoomUseCase } from "../../entities/useCaseInterfaces/chatRoom/IGetChatRoomUseCase";
import { IChatRoomRepository } from "../../entities/repositoryInterface/chatRoom/chat-room-repository";

@injectable()
export class GetChatRoomUseCase implements IGetChatRoomUseCase{
    constructor(
        @inject("IChatRoomRepository") private _chatRoomRepo:IChatRoomRepository
    ){}
    async execute(userId: string): Promise<IChatRoomEntity[]> {
        return await this._chatRoomRepo.getChatRooms(userId)
    }
}