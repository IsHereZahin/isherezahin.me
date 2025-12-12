import mongoose, { Schema } from "mongoose";

const highlightSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
});

const workExperienceSchema = new Schema(
    {
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
            default: "Present",
        },
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        companyUrl: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "On Site",
        },
        description: {
            type: String,
            required: true,
        },
        highlights: [highlightSchema],
        logo: {
            type: String,
            required: true,
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

export const WorkExperienceModel =
    mongoose.models.WorkExperience || mongoose.model("WorkExperience", workExperienceSchema);
