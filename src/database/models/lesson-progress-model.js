import mongoose, { Schema } from "mongoose";

const lessonProgressSchema = new Schema(
    {
        enrollmentId: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

lessonProgressSchema.index({ enrollmentId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ enrollmentId: 1 });

export const LessonProgressModel =
    mongoose.models.LessonProgress || mongoose.model("LessonProgress", lessonProgressSchema);
