import mongoose, { Schema } from "mongoose";

const subscriberSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        subscribedAt: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const SubscriberModel =
    mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
