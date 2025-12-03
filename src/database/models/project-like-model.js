import mongoose, { Schema } from "mongoose";

const projectLikeSchema = new Schema(
    {
        projectSlug: {
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
projectLikeSchema.index({ projectSlug: 1, deviceId: 1 });
projectLikeSchema.index({ projectSlug: 1, userEmail: 1 });

export const ProjectLikeModel =
    mongoose.models.ProjectLike || mongoose.model("ProjectLike", projectLikeSchema);