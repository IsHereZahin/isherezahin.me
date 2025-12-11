import { BlogModel } from "@/database/models/blog-model";
import { ProjectModel } from "@/database/models/project-model";
import { SiteSettingsModel } from "@/database/models/site-settings-model";
import { VisitorModel } from "@/database/models/visitor-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const isAdmin = await checkIsAdmin();

        // Check if statistics are public
        const publicSetting = await SiteSettingsModel.findOne({ key: "statisticsPublic" }).lean();
        const isPublic = (publicSetting as { value?: boolean } | null)?.value === true;

        // Check if referral sources are public (default: private)
        const refPublicSetting = await SiteSettingsModel.findOne({ key: "referralSourcesPublic" }).lean();
        const isRefPublic = (refPublicSetting as { value?: boolean } | null)?.value === true;

        if (!isAdmin && !isPublic) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Get total visitors
        const totalVisitors = await VisitorModel.countDocuments();

        // Get unique visitors by fingerprint
        const uniqueVisitors = await VisitorModel.distinct("fingerprint");

        // Get ref counts
        const refStats = await VisitorModel.aggregate([
            { $match: { ref: { $ne: null } } },
            { $group: { _id: "$ref", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Get visitor trends (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const visitorTrends = await VisitorModel.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    visitors: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill in missing dates with 0 visitors
        const trendData = [];
        const currentDate = new Date(thirtyDaysAgo);
        const today = new Date();

        while (currentDate <= today) {
            const dateStr = currentDate.toISOString().split("T")[0];
            const existing = visitorTrends.find((t) => t._id === dateStr);
            trendData.push({
                date: dateStr,
                visitors: existing ? existing.visitors : 0,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Get blog and project counts
        const totalBlogs = await BlogModel.countDocuments({ published: true });
        const totalProjects = await ProjectModel.countDocuments({ published: true });

        return NextResponse.json({
            totalVisitors,
            uniqueVisitors: uniqueVisitors.length,
            refStats: isAdmin || isRefPublic ? refStats.map((r) => ({ ref: r._id, count: r.count })) : [],
            visitorTrends: trendData,
            totalBlogs,
            totalProjects,
            isPublic,
            isRefPublic,
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
