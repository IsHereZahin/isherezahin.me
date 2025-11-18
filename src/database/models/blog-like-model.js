import mongoose, { Schema } from "mongoose";

const blogLikeSchema = new Schema(
    {
        blogSlug: {
            type: String,
            required: true,
            index: true,
        },
        deviceId: {
            type: String,
            required: true,
            index: true,
        },
        userEmail: {
            type: String,
            default: null,
            index: true,
            sparse: true,
        },
        likeCount: {
            type: Number,
            required: true,
            default: 1,
            min: 0,
            max: 3,
        },
    },
    { timestamps: true }
);

// Compound indexes for efficient lookups
blogLikeSchema.index({ blogSlug: 1, deviceId: 1 });
blogLikeSchema.index({ blogSlug: 1, userEmail: 1 });

export const BlogLikeModel =
    mongoose.models.BlogLike || mongoose.model("BlogLike", blogLikeSchema);