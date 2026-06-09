import mongoose, { Schema } from "mongoose";

// Encrypted blob shape reused for wrappedDEK and any AES-256-GCM payload.
const encBlobSchema = new Schema(
    {
        ciphertext: { type: String, default: "" },
        iv: { type: String, default: "" },
        authTag: { type: String, default: "" },
    },
    { _id: false }
);

// Single-document settings for the one (admin) Personal Vault.
const vaultSettingsSchema = new Schema(
    {
        // Module toggle. When false, the vault is fully inaccessible.
        enabled: {
            type: Boolean,
            default: false,
        },
        // Whether a vault password has ever been set up.
        isConfigured: {
            type: Boolean,
            default: false,
        },
        // scrypt hash of the vault password (for verification only).
        passwordHash: {
            type: String,
            default: "",
        },
        passwordSalt: {
            type: String,
            default: "",
        },
        // Salt used to derive the KEK from the password.
        kdfSalt: {
            type: String,
            default: "",
        },
        // The Data-Encryption-Key, wrapped (encrypted) with the KEK.
        wrappedDEK: {
            type: encBlobSchema,
            default: () => ({}),
        },
        // Bumped whenever the DEK is regenerated (password reset).
        dekVersion: {
            type: Number,
            default: 1,
        },
        // Inactivity timeout for the unlocked vault session.
        sessionTimeoutMinutes: {
            type: Number,
            default: 20,
        },
        // Upload limits (admin-configurable).
        maxFileSizeMB: {
            type: Number,
            default: 25,
        },
        allowedFileTypes: {
            type: [String],
            default: [
                "pdf",
                "doc",
                "docx",
                "xls",
                "xlsx",
                "png",
                "jpg",
                "jpeg",
                "gif",
                "webp",
                "zip",
            ],
        },
    },
    { timestamps: true }
);

export const VaultSettingsModel =
    mongoose.models.VaultSettings ||
    mongoose.model("VaultSettings", vaultSettingsSchema);