import mongoose, { Schema } from "mongoose";

const contactMessageSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        userImage: {
            type: String,
        },
        subject: {
            type: String,
            default: "No Subject",
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const ContactMessageModel =
    mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);
