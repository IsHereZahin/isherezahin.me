import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
    {
        quote: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
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

export const TestimonialModel =
    mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
