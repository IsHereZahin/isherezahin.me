import mongoose, { Schema } from "mongoose";

const siteSettingsSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: Schema.Types.Mixed,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const SiteSettingsModel =
    mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);
