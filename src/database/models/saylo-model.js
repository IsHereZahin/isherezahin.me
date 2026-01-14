import mongoose, { Schema } from "mongoose";

// Reaction types: like, love, haha, fire
const reactionSchema = new Schema(
    {
        sayloId: {
            type: Schema.Types.ObjectId,
            ref: "Saylo",
            required: true,
        },
        deviceId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["like", "love", "haha", "fire"],
            required: true,
        },
    },
    { timestamps: true }
);

// Compound index to ensure one reaction per device per saylo
reactionSchema.index({ sayloId: 1, deviceId: 1 }, { unique: true });

// Comment schema
const sayloCommentSchema = new Schema(
    {
        sayloId: {
            type: Schema.Types.ObjectId,
            ref: "Saylo",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        authorImage: {
            type: String,
            default: null,
        },
        authorId: {
            type: String,
            default: null,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

sayloCommentSchema.index({ sayloId: 1, createdAt: -1 });

const sayloSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            default: null,
        },
        authorImage: {
            type: String,
            default: null,
        },
        authorId: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            default: null,
        },
        images: {
            type: [String],
            default: [],
        },
        videos: {
            type: [String],
            default: [],
        },
        reactions: {
            like: { type: Number, default: 0 },
            love: { type: Number, default: 0 },
            haha: { type: Number, default: 0 },
            fire: { type: Number, default: 0 },
        },
        commentCount: {
            type: Number,
            default: 0,
        },
        shareCount: {
            type: Number,
            default: 0,
        },
        published: {
            type: Boolean,
            required: true,
            default: true,
        },
        visibility: {
            type: String,
            enum: ["public", "authenticated", "private"],
            default: "public",
        },
    },
    { timestamps: true }
);

// Category model for storing available categories
const sayloCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        color: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Delete cached model if schema changed (needed for development hot reload)
if (mongoose.models.Saylo) {
    delete mongoose.models.Saylo;
}
export const SayloModel = mongoose.model("Saylo", sayloSchema);

export const SayloCategoryModel =
    mongoose.models.SayloCategory || mongoose.model("SayloCategory", sayloCategorySchema);

export const SayloReactionModel =
    mongoose.models.SayloReaction || mongoose.model("SayloReaction", reactionSchema);

export const SayloCommentModel =
    mongoose.models.SayloComment || mongoose.model("SayloComment", sayloCommentSchema);
