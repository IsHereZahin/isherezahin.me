import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        sessionToken: {
            type: String,
            required: true,
            unique: true,
        },
        deviceType: {
            type: String,
            default: "Unknown",
        },
        lastActiveAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

sessionSchema.index({ userId: 1, isRevoked: 1 });

export const SessionModel =
    mongoose.models.Session || mongoose.model("Session", sessionSchema);
