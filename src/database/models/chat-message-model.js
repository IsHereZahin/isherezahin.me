import mongoose, { Schema } from "mongoose";

const editHistorySchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        editedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const chatMessageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "ChatConversation",
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderType: {
            type: String,
            enum: ["user", "admin"],
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        senderImage: {
            type: String,
        },
        content: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        editHistory: [editHistorySchema],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Index for efficient querying
chatMessageSchema.index({ conversationId: 1, createdAt: -1 });

export const ChatMessageModel =
    mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
