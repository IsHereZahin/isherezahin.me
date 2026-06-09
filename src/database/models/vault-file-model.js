import mongoose, { Schema } from "mongoose";

const vaultFileSchema = new Schema(
    {
        // Display name (editable via rename).
        name: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            default: "",
        },
        mimeType: {
            type: String,
            default: "application/octet-stream",
        },
        sizeBytes: {
            type: Number,
            default: 0,
        },
        // Cloudinary public_id used for authenticated/private delivery.
        storageKey: {
            type: String,
            required: true,
        },
        // Cloudinary resource type: "image" | "video" | "raw".
        resourceType: {
            type: String,
            default: "raw",
        },
        // File extension (lowercase, no dot) for preview/type decisions.
        extension: {
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

vaultFileSchema.index({ name: "text", originalName: "text" });

export const VaultFileModel =
    mongoose.models.VaultFile || mongoose.model("VaultFile", vaultFileSchema);
