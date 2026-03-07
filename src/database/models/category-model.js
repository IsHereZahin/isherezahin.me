import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
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
            default: null,
        },
        icon: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

categorySchema.index({ slug: 1 });

export const CategoryModel =
    mongoose.models.Category || mongoose.model("Category", categorySchema);
