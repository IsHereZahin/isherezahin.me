import mongoose, { Schema } from "mongoose";

const newsletterOtpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        lastSentAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index for auto-deletion of expired OTPs
newsletterOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const NewsletterOtpModel =
    mongoose.models.NewsletterOtp || mongoose.model("NewsletterOtp", newsletterOtpSchema);
