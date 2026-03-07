import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        lastAccessedLessonId: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            default: null,
        },
        progressPercent: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1 });

export const EnrollmentModel =
    mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
