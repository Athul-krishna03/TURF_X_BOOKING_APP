import { ObjectId } from "mongoose";
import { NotificationType } from "../../shared/constants";

export interface INotification {
    userId:ObjectId | string;
    type:NotificationType,
    message:string,
    title:string,
    isRead:boolean,
}
