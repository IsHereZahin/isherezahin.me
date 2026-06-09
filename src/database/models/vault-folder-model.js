import mongoose, { Schema } from "mongoose";

const vaultFolderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "VaultFolder",
            default: null,
        },
        color: {
            type: String,
            default: "",
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const VaultFolderModel =
    mongoose.models.VaultFolder ||
    mongoose.model("VaultFolder", vaultFolderSchema);
