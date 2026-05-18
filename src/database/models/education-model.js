import mongoose, { Schema } from "mongoose";

const educationSchema = new Schema(
    {
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
            default: "Present",
        },
        degree: {
            type: String,
            required: true,
        },
        institution: {
            type: String,
            required: true,
        },
        institutionUrl: {
            type: String,
            default: "",
        },
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

export const EducationModel =
    mongoose.models.Education || mongoose.model("Education", educationSchema);
