import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        views: {
            type: Number,
            required: true,
            default: 0,
        },
        likes: {
            type: Number,
            required: true,
            default: 0,
        },
        type: {
            type: String,
            required: true,
            default: "Blog",
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        excerpt: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        imageSrc: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const BlogModel =
    mongoose.models.Blog || mongoose.model("Blog", blogSchema);
