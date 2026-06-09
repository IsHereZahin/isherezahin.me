import mongoose, { Schema } from "mongoose";

const vaultTagSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        color: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const VaultTagModel =
    mongoose.models.VaultTag || mongoose.model("VaultTag", vaultTagSchema);
