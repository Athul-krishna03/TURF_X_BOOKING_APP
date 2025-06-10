import { inject,injectable} from "tsyringe";
import { IGetAllNotificationUseCase } from "../../entities/useCaseInterfaces/notifications/IGetAllNotificationUseCase";
import { INotification } from "../../entities/models/notification.entity";
import { INotificationRepository } from "../../entities/repositoryInterface/notification/INotificationRepository";

@injectable()
export class GetAllNotificationUseCase implements IGetAllNotificationUseCase{
    constructor(
        @inject("INotificationRepository") private _notificationRepositry:INotificationRepository
    ){}
    async execute(userId: string): Promise<INotification[]> {
        const data = await this._notificationRepositry.getAll(userId);
        return data;
    }
}