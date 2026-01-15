import mongoose, { Schema } from "mongoose";

const reactionSchema = new Schema(
    {
        sayloId: {
            type: Schema.Types.ObjectId,
            ref: "Saylo",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        deviceId: {
            type: String,
            default: null,
        },
        guestName: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ["like", "love", "haha", "fire"],
            required: true,
        },
    },
    { timestamps: true }
);

reactionSchema.index({ sayloId: 1, userId: 1 });
reactionSchema.index({ sayloId: 1, deviceId: 1 });

const shareSchema = new Schema(
    {
        sayloId: {
            type: Schema.Types.ObjectId,
            ref: "Saylo",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        deviceId: {
            type: String,
            default: null,
        },
        guestName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

shareSchema.index({ sayloId: 1, userId: 1 });
shareSchema.index({ sayloId: 1, deviceId: 1 });

const sayloSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
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
        discussionNumber: {
            type: Number,
            default: null,
        },
    },
    { timestamps: true }
);

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

export const SayloModel =
    mongoose.models.Saylo || mongoose.model("Saylo", sayloSchema);

export const SayloCategoryModel =
    mongoose.models.SayloCategory || mongoose.model("SayloCategory", sayloCategorySchema);

export const SayloReactionModel =
    mongoose.models.SayloReaction || mongoose.model("SayloReaction", reactionSchema);

export const SayloShareModel =
    mongoose.models.SayloShare || mongoose.model("SayloShare", shareSchema);
