import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema(
    {
        moduleId: {
            type: Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
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
        contentType: {
            type: String,
            enum: ["video", "text", "quiz"],
            default: "video",
        },
        videoUrl: {
            type: String,
            default: null,
        },
        content: {
            type: String,
            default: null,
        },
        duration: {
            type: String,
            default: null,
        },
        isFree: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

lessonSchema.index({ moduleId: 1, order: 1 });
lessonSchema.index({ courseId: 1 });

export const LessonModel =
    mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
