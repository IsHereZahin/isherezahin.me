import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

moduleSchema.index({ courseId: 1, order: 1 });

export const ModuleModel =
    mongoose.models.Module || mongoose.model("Module", moduleSchema);
