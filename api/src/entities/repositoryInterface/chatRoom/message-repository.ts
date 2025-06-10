import { IMessageEntity } from "../../models/message.entity";

export interface IMessageRepository{
    create(data:IMessageEntity):Promise<IMessageEntity>;
    findByGameId(gameId: string | undefined): Promise<IMessageEntity[]>
    
}