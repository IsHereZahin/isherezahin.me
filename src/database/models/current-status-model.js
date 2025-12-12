import mongoose, { Schema } from "mongoose";

const currentStatusSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const CurrentStatusModel =
    mongoose.models.CurrentStatus || mongoose.model("CurrentStatus", currentStatusSchema);
