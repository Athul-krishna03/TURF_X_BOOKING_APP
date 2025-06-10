import { INotification } from "../../models/notification.entity";

export interface INotificationRepository{
    create(userId:string,type:string,message:string,title:string):Promise<void>
    updateToRead(id:string):Promise<void>;
    getAll(userId:string):Promise<INotification[]>
    updateAllToRead(userId:string):Promise<void>
}