import mongoose, { Schema } from "mongoose";

const encBlobSchema = new Schema(
    {
        ciphertext: { type: String, default: "" },
        iv: { type: String, default: "" },
        authTag: { type: String, default: "" },
    },
    { _id: false }
);

const checklistItemSchema = new Schema(
    {
        text: { type: String, default: "" },
        done: { type: Boolean, default: false },
    },
    { _id: false }
);

export const VAULT_NOTE_TYPES = ["rich", "code", "checklist"];

const vaultNoteSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            enum: VAULT_NOTE_TYPES,
            default: "rich",
        },
        // Plaintext content for non-encrypted notes (rich text / markdown or code).
        content: {
            type: String,
            default: "",
        },
        checklistItems: {
            type: [checklistItemSchema],
            default: [],
        },
        // Programming language for code snippets.
        language: {
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
        // When true, the note body lives encrypted in `enc` and `content` is empty.
        isEncrypted: {
            type: Boolean,
            default: false,
        },
        enc: {
            type: encBlobSchema,
            default: () => ({}),
        },
    },
    { timestamps: true }
);

export const VaultNoteModel =
    mongoose.models.VaultNote || mongoose.model("VaultNote", vaultNoteSchema);
