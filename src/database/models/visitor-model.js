import mongoose, { Schema } from "mongoose";

const visitorSchema = new Schema(
    {
        fingerprint: {
            type: String,
            required: true,
            index: true,
        },
        ref: {
            type: String,
            default: null,
            index: true,
        },
        userAgent: {
            type: String,
            default: null,
        },
        path: {
            type: String,
            default: "/",
        },
        ip: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Compound index for efficient queries
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ ref: 1, createdAt: -1 });

export const VisitorModel =
    mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
