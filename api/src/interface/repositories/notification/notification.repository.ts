import { injectable } from "tsyringe";
import { NotificationModel } from "../../../frameworks/database/models/notification.model";
import { INotification } from "../../../entities/models/notification.entity";
import { INotificationRepository } from "../../../entities/repositoryInterface/notification/INotificationRepository";

@injectable()
export class NotificationRepository implements INotificationRepository {
    constructor() {}

    async create(userId: string, type: string, message: string, title: string): Promise<void> {
        await NotificationModel.create({
        userId,
        type,
        message,
        title,
        });
    }

    async updateToRead(id: string): Promise<void> {
        await NotificationModel.findByIdAndUpdate(id, { isRead: true });
    }

    async getAll(userId: string): Promise<INotification[]> {
    return NotificationModel.find({ userId, isRead: false }).sort({ createdAt: -1 });
    }


    async updateAllToRead(userId: string): Promise<void> {
        await NotificationModel.updateMany({userId},{isRead:true});
    }
}