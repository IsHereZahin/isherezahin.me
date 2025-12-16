import mongoose, { Schema } from "mongoose";

const legalPageSchema = new Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            enum: ["privacy-policy", "terms-of-service"],
        },
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            required: true,
            default: "",
        },
        published: {
            type: Boolean,
            required: true,
            default: false,
        },
        lastUpdatedBy: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export const LegalPageModel =
    mongoose.models.LegalPage || mongoose.model("LegalPage", legalPageSchema);
