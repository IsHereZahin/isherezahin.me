import mongoose, { Schema } from "mongoose";

const chatConversationSchema = new Schema(
    {
        participantId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        participantName: {
            type: String,
            required: true,
        },
        participantEmail: {
            type: String,
            required: true,
        },
        participantImage: {
            type: String,
        },
        lastMessage: {
            type: String,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
        lastMessageBy: {
            type: String,
            enum: ["user", "admin"],
        },
        unreadCountUser: {
            type: Number,
            default: 0,
        },
        unreadCountAdmin: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const ChatConversationModel =
    mongoose.models.ChatConversation || mongoose.model("ChatConversation", chatConversationSchema);
