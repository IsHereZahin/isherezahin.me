import mongoose, { Schema } from "mongoose";

const dailyStatsSchema = new Schema(
    {
        date: { type: String, required: true, unique: true, index: true },
        pageViews: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        devices: { type: Map, of: Number, default: {} },
        countries: { type: Map, of: Number, default: {} },
        pages: { type: Map, of: Number, default: {} },
        referrals: { type: Map, of: Number, default: {} },
    },
    { timestamps: true }
);

dailyStatsSchema.index({ createdAt: 1 });

const visitorHashSchema = new Schema(
    {
        hash: { type: String, required: true },
        date: { type: String, required: true },
    },
    { timestamps: true }
);

visitorHashSchema.index({ hash: 1, date: 1 }, { unique: true });
visitorHashSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 60 * 60 });

const globalStatsSchema = new Schema(
    {
        key: { type: String, default: "global", unique: true },
        totalPageViews: { type: Number, default: 0 },
        totalUniqueVisitors: { type: Number, default: 0 },
        devices: { type: Map, of: Number, default: {} },
        countries: { type: Map, of: Number, default: {} },
        pages: { type: Map, of: Number, default: {} },
        referrals: { type: Map, of: Number, default: {} },
    },
    { timestamps: true }
);

export const DailyStatsModel =
    mongoose.models.DailyStats || mongoose.model("DailyStats", dailyStatsSchema);

export const VisitorHashModel =
    mongoose.models.VisitorHash || mongoose.model("VisitorHash", visitorHashSchema);

export const GlobalStatsModel =
    mongoose.models.GlobalStats || mongoose.model("GlobalStats", globalStatsSchema);
