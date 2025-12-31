import mongoose, { Schema } from "mongoose";

const bucketListSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["travel", "adventure", "personal", "career", "learning", "lifestyle"],
            required: true,
        },
        status: {
            type: String,
            enum: ["completed", "in-progress", "pending"],
            default: "pending",
        },
        location: {
            type: String,
            default: null,
        },
        completedDate: {
            type: String,
            default: null,
        },
        order: {
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

export const BucketListModel =
    mongoose.models.BucketList || mongoose.model("BucketList", bucketListSchema);
