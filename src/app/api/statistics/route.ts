import { BlogModel } from "@/database/models/blog-model";
import { ProjectModel } from "@/database/models/project-model";
import { SiteSettingsModel } from "@/database/models/site-settings-model";
import { VisitorModel } from "@/database/models/visitor-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

function parseDeviceType(userAgent: string | null): string {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "iOS";
    if (ua.includes("android")) return "Android";
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("macintosh") || ua.includes("mac os")) return "macOS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("bot") || ua.includes("crawler") || ua.includes("spider")) return "Bot";
    return "Other";
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const isAdmin = await checkIsAdmin();
        const searchParams = request.nextUrl.searchParams;
        const refPage = parseInt(searchParams.get("refPage") || "1");
        const pathPage = parseInt(searchParams.get("pathPage") || "1");
        const limit = 10;

        // Check all visibility settings
        const publicSetting = await SiteSettingsModel.findOne({ key: "statisticsPublic" }).lean();
        const isPublic = (publicSetting as { value?: boolean } | null)?.value === true;

        const refPublicSetting = await SiteSettingsModel.findOne({ key: "referralSourcesPublic" }).lean();
        const isRefPublic = (refPublicSetting as { value?: boolean } | null)?.value === true;

        const pathPublicSetting = await SiteSettingsModel.findOne({ key: "topPagesPublic" }).lean();
        const isPathPublic = (pathPublicSetting as { value?: boolean } | null)?.value === true;

        const cardsPublicSetting = await SiteSettingsModel.findOne({ key: "statsCardsPublic" }).lean();
        const isCardsPublic = cardsPublicSetting ? (cardsPublicSetting as { value?: boolean }).value === true : true;

        const trendsPublicSetting = await SiteSettingsModel.findOne({ key: "visitorTrendsPublic" }).lean();
        const isTrendsPublic = trendsPublicSetting ? (trendsPublicSetting as { value?: boolean }).value === true : true;

        const devicesPublicSetting = await SiteSettingsModel.findOne({ key: "deviceTypesPublic" }).lean();
        const isDevicesPublic = devicesPublicSetting ? (devicesPublicSetting as { value?: boolean }).value === true : true;

        // Block access if page is private and user is not admin
        if (!isAdmin && !isPublic) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Initialize response with visibility flags
        const response: Record<string, unknown> = {
            isPublic,
            isRefPublic,
            isPathPublic,
            isCardsPublic,
            isTrendsPublic,
            isDevicesPublic,
            isAdmin,
        };

        // Only fetch and return data that the user is allowed to see
        
        // Stats Cards data - only if admin or cards are public
        if (isAdmin || isCardsPublic) {
            const totalVisitors = await VisitorModel.countDocuments();
            const uniqueVisitors = await VisitorModel.distinct("fingerprint");
            const totalBlogs = await BlogModel.countDocuments({ published: true });
            const totalProjects = await ProjectModel.countDocuments({ published: true });
            
            response.totalVisitors = totalVisitors;
            response.uniqueVisitors = uniqueVisitors.length;
            response.totalBlogs = totalBlogs;
            response.totalProjects = totalProjects;
        }

        // Visitor Trends data - only if admin or trends are public
        if (isAdmin || isTrendsPublic) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const visitorTrends = await VisitorModel.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        visitors: { $sum: 1 },
                        uniqueFingerprints: { $addToSet: "$fingerprint" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        visitors: 1,
                        uniqueVisitors: { $size: "$uniqueFingerprints" },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const trendData = [];
            const currentDate = new Date(thirtyDaysAgo);
            const today = new Date();

            while (currentDate <= today) {
                const dateStr = currentDate.toISOString().split("T")[0];
                const existing = visitorTrends.find((t) => t._id === dateStr);
                trendData.push({
                    date: dateStr,
                    visitors: existing ? existing.visitors : 0,
                    uniqueVisitors: existing ? existing.uniqueVisitors : 0,
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            response.visitorTrends = trendData;
        }

        // Device Types data - only if admin or devices are public
        if (isAdmin || isDevicesPublic) {
            const allVisitors = await VisitorModel.find({}, { userAgent: 1, fingerprint: 1 }).lean();
            const deviceCounts: Record<string, { total: number; uniqueFingerprints: Set<string> }> = {};
            
            allVisitors.forEach((v) => {
                const visitor = v as { userAgent?: string; fingerprint?: string };
                const device = parseDeviceType(visitor.userAgent || null);
                if (!deviceCounts[device]) {
                    deviceCounts[device] = { total: 0, uniqueFingerprints: new Set() };
                }
                deviceCounts[device].total += 1;
                if (visitor.fingerprint) {
                    deviceCounts[device].uniqueFingerprints.add(visitor.fingerprint);
                }
            });

            response.deviceStats = Object.entries(deviceCounts)
                .map(([device, data]) => ({ device, count: data.total, uniqueVisitors: data.uniqueFingerprints.size }))
                .sort((a, b) => b.count - a.count);
        }

        // Referral Sources data - only if admin or refs are public
        if (isAdmin || isRefPublic) {
            const refStats = await VisitorModel.aggregate([
                { $match: { ref: { $ne: null } } },
                { $group: { _id: "$ref", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]);

            response.totalRefs = refStats.length;
            response.refPage = refPage;

            if (isAdmin) {
                const start = (refPage - 1) * limit;
                response.refStats = refStats.slice(start, start + limit).map((r) => ({ ref: r._id, count: r.count }));
            } else {
                response.refStats = refStats.slice(0, 10).map((r) => ({ ref: r._id, count: r.count }));
            }
        }

        // Top Pages data - only if admin or paths are public
        if (isAdmin || isPathPublic) {
            const pathStats = await VisitorModel.aggregate([
                { $group: { _id: "$path", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]);

            response.totalPaths = pathStats.length;
            response.pathPage = pathPage;

            if (isAdmin) {
                const start = (pathPage - 1) * limit;
                response.pathStats = pathStats.slice(start, start + limit).map((p) => ({ path: p._id, count: p.count }));
            } else {
                response.pathStats = pathStats.slice(0, 10).map((p) => ({ path: p._id, count: p.count }));
            }
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
