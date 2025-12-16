import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema({
    type: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    src: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: null,
    },
}, { _id: false });

const questSchema = new Schema(
    {
        date: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        media: {
            type: [mediaSchema],
            default: [],
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

export const QuestModel =
    mongoose.models.Quest || mongoose.model("Quest", questSchema);
