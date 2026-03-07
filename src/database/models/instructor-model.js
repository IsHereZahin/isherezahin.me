import mongoose, { Schema } from "mongoose";

const instructorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

instructorSchema.index({ name: 1 });

export const InstructorModel =
    mongoose.models.Instructor || mongoose.model("Instructor", instructorSchema);
