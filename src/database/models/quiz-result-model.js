import mongoose, { Schema } from "mongoose";

const quizResultSchema = new Schema(
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
        answers: {
            type: Schema.Types.Mixed,
            required: true,
        },
        results: {
            type: [
                {
                    questionIndex: Number,
                    isCorrect: Boolean,
                    correctIndices: [Number],
                    userAnswer: [Number],
                },
            ],
            required: true,
        },
        correctCount: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        passed: {
            type: Boolean,
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

quizResultSchema.index({ enrollmentId: 1, lessonId: 1 }, { unique: true });
quizResultSchema.index({ lessonId: 1 });

export const QuizResultModel =
    mongoose.models.QuizResult || mongoose.model("QuizResult", quizResultSchema);
