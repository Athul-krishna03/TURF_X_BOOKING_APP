import { ObjectId ,Document, model} from "mongoose";
import { IMessageEntity } from "../../../entities/models/message.entity";
import { MessageSchema } from "../schemas/message.Schema";

export interface IMessageModel extends Omit<IMessageEntity,"id">,Document{
    _id:ObjectId
}

export const MessageModal = model<IMessageModel>("Message",MessageSchema)