import { INotification } from "../../../entities/models/notification.entity";
import { Schema } from "mongoose";
import { NotificationType } from "../../../shared/constants";

export const NotificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    type: {
        type: String,
        enum: Object.values(NotificationType), 
        required: true,
    },
    message: { type: String, required: true },
    title: { type: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });