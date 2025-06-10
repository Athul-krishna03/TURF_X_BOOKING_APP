import { INotification } from "../../models/notification.entity";


export interface IGetAllNotificationUseCase{
    execute(userId:string):Promise<INotification[]>
}