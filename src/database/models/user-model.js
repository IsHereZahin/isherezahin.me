import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        providerId: {
            type: String,
            required: true,
        },
        provider: {
            type: String,
            enum: ["github", "google"],
            required: true,
        },
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
        },
        image: {
            type: String,
        },
        username: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        providerData: {
            type: Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

// Compound unique index on providerId and provider
userSchema.index({ providerId: 1, provider: 1 }, { unique: true });

export const UserModel =
    mongoose.models.User || mongoose.model("User", userSchema);
