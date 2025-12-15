import mongoose, { Schema } from "mongoose";

const heroButtonSchema = new Schema(
    {
        text: { type: String, required: true },
        href: { type: String, required: true },
        icon: { type: String, default: "" },
        variant: { type: String, default: "default" },
    },
    { _id: false }
);

const heroSchema = new Schema(
    {
        profileImage: {
            type: String,
            default: "",
        },
        greeting: {
            type: String,
            default: "Hey, I'm",
        },
        name: {
            type: String,
            required: true,
        },
        tagline: {
            type: String,
            default: "Coder & Thinker",
        },
        description: {
            type: String,
            required: true,
        },
        highlightedSkills: {
            type: [String],
            default: [],
        },
        buttons: {
            type: [heroButtonSchema],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const HeroModel =
    mongoose.models.Hero || mongoose.model("Hero", heroSchema);
