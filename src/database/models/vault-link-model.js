import mongoose, { Schema } from "mongoose";

const vaultLinkSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        tags: {
            type: [String],
            default: [],
        },
        folderId: {
            type: Schema.Types.ObjectId,
            ref: "VaultFolder",
            default: null,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

vaultLinkSchema.index({ title: "text", description: "text", url: "text" });

export const VaultLinkModel =
    mongoose.models.VaultLink || mongoose.model("VaultLink", vaultLinkSchema);
