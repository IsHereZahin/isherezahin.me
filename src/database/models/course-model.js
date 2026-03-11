import mongoose, { Schema } from "mongoose";

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
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
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
        instructorIds: {
            type: [{ type: Schema.Types.ObjectId, ref: "Instructor" }],
            required: true,
            validate: {
                validator: (v) => Array.isArray(v) && v.length > 0,
                message: "At least one instructor is required",
            },
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

courseSchema.index({ status: 1, categoryId: 1 });
courseSchema.index({ status: 1, createdAt: -1 });

// Delete cached model to ensure schema updates apply in Next.js dev hot-reload
if (mongoose.models.Course) {
    mongoose.deleteModel("Course");
}
export const CourseModel = mongoose.model("Course", courseSchema);
