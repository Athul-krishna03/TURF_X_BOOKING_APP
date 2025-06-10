import { Schema } from "mongoose";
import { IChatRoomModel } from "../models/chatRoom.model";

export const ChatRoomSchema = new Schema<IChatRoomModel>(
    {
        gameId: { type: String, ref: "SharedBooking", required: true },
        users: [String],
        hostId: String,
        name:{type:String},
        imageUrl:{type:String },
        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active",
        },
    },
    { timestamps: true }
)
