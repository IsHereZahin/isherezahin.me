import mongoose, { Schema } from "mongoose";

const encBlobSchema = new Schema(
    {
        ciphertext: { type: String, default: "" },
        iv: { type: String, default: "" },
        authTag: { type: String, default: "" },
    },
    { _id: false }
);

// Credentials / reference info. The secret payload is ALWAYS encrypted at rest.
const vaultCredentialSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            default: "",
        },
        // Encrypted JSON blob: { password, notes } (whatever the secret holds).
        enc: {
            type: encBlobSchema,
            default: () => ({}),
        },
        urlHint: {
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

export const VaultCredentialModel =
    mongoose.models.VaultCredential ||
    mongoose.model("VaultCredential", vaultCredentialSchema);
