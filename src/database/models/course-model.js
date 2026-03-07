import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema(
    {
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
        // For video lessons - YouTube embed URL (private/unlisted)
        videoUrl: {
            type: String,
            default: null,
        },
        // For text lessons - markdown content
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

const moduleSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: Number,
            required: true,
        },
        lessons: {
            type: [lessonSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        thumbnail: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            default: null,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        instructors: {
            type: [
                {
                    name: { type: String, required: true },
                    image: { type: String, default: null },
                    bio: { type: String, default: null },
                },
            ],
            default: [],
        },
        price: {
            type: Number,
            default: 0,
        },
        originalPrice: {
            type: Number,
            default: null,
        },
        currency: {
            type: String,
            default: "BDT",
        },
        modules: {
            type: [moduleSchema],
            default: [],
        },
        learningOutcomes: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        enrollmentCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

courseSchema.index({ slug: 1 });
courseSchema.index({ status: 1, category: 1 });
courseSchema.index({ status: 1, createdAt: -1 });

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
        completedLessons: {
            type: [String],
            default: [],
        },
        lastAccessedLessonId: {
            type: String,
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
        // Quiz results: { lessonId: { answers: {0: [1,2], 1: [0]}, results: [...], correctCount, totalQuestions, passed } }
        quizResults: {
            type: Map,
            of: Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ userId: 1, status: 1 });

export const CourseModel =
    mongoose.models.Course || mongoose.model("Course", courseSchema);

export const EnrollmentModel =
    mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
