import mongoose, { Schema } from "mongoose";

const userPresenceSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        hideLastSeen: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const UserPresenceModel =
    mongoose.models.UserPresence || mongoose.model("UserPresence", userPresenceSchema);
