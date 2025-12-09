import mongoose, { Schema } from "mongoose";

const adminSettingsSchema = new Schema(
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

export const AdminSettingsModel =
    mongoose.models.AdminSettings || mongoose.model("AdminSettings", adminSettingsSchema);
