import { IMessageEntity } from "../../../entities/models/message.entity";
import { IMessageRepository } from "../../../entities/repositoryInterface/chatRoom/message-repository";
import { MessageModal } from "../../../frameworks/database/models/message.model";

export class MessageRepository implements IMessageRepository{
   async findByGameId(gameId: string | undefined): Promise<IMessageEntity[]> {
        console.log("gameid in repo",gameId);
        
        const data =await MessageModal.find({ communityId: gameId }).sort({ timestamp: 1 });
        console.log("message fata",data)
        return data
    }   

    async create(data: IMessageEntity): Promise<IMessageEntity> {
        return await MessageModal.create(data)
    }
}