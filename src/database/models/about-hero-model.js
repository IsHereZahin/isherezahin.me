import mongoose, { Schema } from "mongoose";

const aboutHeroSchema = new Schema(
    {
        name: {
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
        age: {
            type: String,
            default: "",
        },
        imageSrc: {
            type: String,
            required: true,
        },
        paragraphs: [{
            type: String,
            required: true,
        }],
        pageTitle: {
            type: String,
            default: "About Me",
        },
        pageSubtitle: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const AboutHeroModel =
    mongoose.models.AboutHero || mongoose.model("AboutHero", aboutHeroSchema);
