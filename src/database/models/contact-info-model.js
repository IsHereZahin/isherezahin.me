import mongoose, { Schema } from "mongoose";

const contactInfoSchema = new Schema(
    {
        email: {
            type: String,
            default: "",
        },
        headline: {
            type: String,
            default: "Any questions about software?",
        },
        subheadline: {
            type: String,
            default: "Feel free to reach out to me!",
        },
        highlightText: {
            type: String,
            default: "",
        },
        skills: [{
            type: String,
        }],
    },
    { timestamps: true }
);

export const ContactInfoModel =
    mongoose.models.ContactInfo || mongoose.model("ContactInfo", contactInfoSchema);
