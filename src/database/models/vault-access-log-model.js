import mongoose, { Schema } from "mongoose";

export const VAULT_LOG_ACTIONS = [
    "unlock_success",
    "unlock_failed",
    "lock",
    "logout",
    "file_upload",
    "file_download",
    "password_change",
    "password_reset",
    "settings_change",
];

const vaultAccessLogSchema = new Schema(
    {
        action: {
            type: String,
            enum: VAULT_LOG_ACTIONS,
            required: true,
        },
        ipAddress: {
            type: String,
            default: null,
        },
        userAgentRaw: {
            type: String,
            default: "",
        },
        deviceType: {
            type: String,
            default: "Unknown",
        },
        detail: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

vaultAccessLogSchema.index({ createdAt: -1 });

export const VaultAccessLogModel =
    mongoose.models.VaultAccessLog ||
    mongoose.model("VaultAccessLog", vaultAccessLogSchema);
