import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
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
            default: "Project",
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
        categories: {
            type: String,
            default: "Project",
        },
        company: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "completed",
        },
        tags: {
            type: [String],
            default: [],
        },
        imageSrc: {
            type: String,
            required: true,
        },
        liveUrl: {
            type: String,
            default: null,
        },
        githubUrl: {
            type: String,
            default: null,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const ProjectModel =
    mongoose.models.Project || mongoose.model("Project", projectSchema);