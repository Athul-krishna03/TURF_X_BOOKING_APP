import { model } from "mongoose";
import { INotification } from "../../../entities/models/notification.entity";
import { NotificationSchema } from "../schemas/notification.Schema";

export const NotificationModel = model<INotification>("Notification",NotificationSchema);
