import { inject, injectable } from "tsyringe";
import { IPushNotificationService } from "../../entities/services/IPushNotificationService";
import { INotificationRepository } from "../../entities/repositoryInterface/notification/INotificationRepository";
import { IClientRepository } from "../../entities/repositoryInterface/client/IClient-repository.interface";
import { messaging } from "../../shared/config";

@injectable()
export class PushNotificationService implements IPushNotificationService {
    constructor(
        @inject("INotificationRepository") private _notificationRepo: INotificationRepository,
        @inject("IClientRepository") private _clientRepo: IClientRepository
    ){}

    async sendNotification(
        userId: string,
        title: string,
        body: string,
        notificationType: string,
    ): Promise<void> {
        const notification = {
            userId,
            title,
            body,
            notificationType
        };
        const user = await this._clientRepo.findById(userId);
        if (user?.id) {
            await this._notificationRepo.create(
                user.id,
                notificationType,
                title,
                body
            );
        }
        if(user?.fcmToken) {
            await messaging.send({
                notification: {
                    title: title,
                    body: body
                },
                token: user.fcmToken
            });
        }
    }
}
