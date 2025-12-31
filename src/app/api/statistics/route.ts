import { BlogModel } from "@/database/models/blog-model";
import { ProjectModel } from "@/database/models/project-model";
import { SiteSettingsModel } from "@/database/models/site-settings-model";
import { DailyStatsModel, GlobalStatsModel } from "@/database/models/visitor-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

interface GlobalStatsDoc {
    totalPageViews?: number;
    totalUniqueVisitors?: number;
    devices?: Map<string, number> | Record<string, number>;
    countries?: Map<string, number> | Record<string, number>;
    pages?: Map<string, number> | Record<string, number>;
    referrals?: Map<string, number> | Record<string, number>;
}

function mapToSortedArray<T extends string>(
    data: Map<string, number> | Record<string, number> | undefined,
    keyName: T
): Array<{ [K in T]: string } & { count: number }> {
    if (!data) return [];
    const obj = data instanceof Map ? Object.fromEntries(data) : data;
    return Object.entries(obj)
        .map(([key, count]) => ({ [keyName]: key.replaceAll("_", "."), count } as { [K in T]: string } & { count: number }))
        .sort((a, b) => b.count - a.count);
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const isAdmin = await checkIsAdmin();
        const searchParams = request.nextUrl.searchParams;
        const refPage = parseInt(searchParams.get("refPage") || "1");
        const pathPage = parseInt(searchParams.get("pathPage") || "1");
        const limit = 10;

        const settingsKeys = [
            "statisticsPublic",
            "referralSourcesPublic",
            "topPagesPublic",
            "statsCardsPublic",
            "visitorTrendsPublic",
            "deviceTypesPublic",
            "countriesPublic",
        ];

        const settings = await SiteSettingsModel.find({ key: { $in: settingsKeys } }).lean();
        const settingsMap = new Map(
            settings.map((s) => {
                const setting = s as unknown as { key: string; value?: boolean };
                return [setting.key, setting.value];
            })
        );

        const isPublic = settingsMap.get("statisticsPublic") === true;
        const isRefPublic = settingsMap.get("referralSourcesPublic") === true;
        const isPathPublic = settingsMap.get("topPagesPublic") === true;
        const isCardsPublic = settingsMap.has("statsCardsPublic") ? settingsMap.get("statsCardsPublic") === true : true;
        const isTrendsPublic = settingsMap.has("visitorTrendsPublic") ? settingsMap.get("visitorTrendsPublic") === true : true;
        const isDevicesPublic = settingsMap.has("deviceTypesPublic") ? settingsMap.get("deviceTypesPublic") === true : true;
        const isCountriesPublic = settingsMap.has("countriesPublic") ? settingsMap.get("countriesPublic") === true : true;

        if (!isAdmin && !isPublic) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const response: Record<string, unknown> = {
            isPublic,
            isRefPublic,
            isPathPublic,
            isCardsPublic,
            isTrendsPublic,
            isDevicesPublic,
            isCountriesPublic,
            isAdmin,
        };

        const globalStats = (await GlobalStatsModel.findOne({ key: "global" }).lean()) as GlobalStatsDoc | null;

        if (isAdmin || isCardsPublic) {
            const [totalBlogs, totalProjects] = await Promise.all([
                BlogModel.countDocuments({ published: true }),
                ProjectModel.countDocuments({ published: true }),
            ]);

            response.totalVisitors = globalStats?.totalPageViews || 0;
            response.uniqueVisitors = globalStats?.totalUniqueVisitors || 0;
            response.totalBlogs = totalBlogs;
            response.totalProjects = totalProjects;
        }

        if (isAdmin || isTrendsPublic) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const startDate = thirtyDaysAgo.toISOString().split("T")[0];

            const dailyStats = await DailyStatsModel.find(
                { date: { $gte: startDate } },
                { date: 1, pageViews: 1, uniqueVisitors: 1 }
            ).sort({ date: 1 }).lean();

            const statsMap = new Map(
                dailyStats.map((s) => {
                    const stat = s as unknown as { date: string; pageViews?: number; uniqueVisitors?: number };
                    return [stat.date, { visitors: stat.pageViews || 0, uniqueVisitors: stat.uniqueVisitors || 0 }];
                })
            );

            const trendData = [];
            const currentDate = new Date(thirtyDaysAgo);
            const today = new Date();

            while (currentDate <= today) {
                const dateStr = currentDate.toISOString().split("T")[0];
                const existing = statsMap.get(dateStr);
                trendData.push({
                    date: dateStr,
                    visitors: existing?.visitors || 0,
                    uniqueVisitors: existing?.uniqueVisitors || 0,
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            response.visitorTrends = trendData;
        }

        if (isAdmin || isDevicesPublic) {
            response.deviceStats = mapToSortedArray(globalStats?.devices, "device");
        }

        if (isAdmin || isCountriesPublic) {
            response.countryStats = mapToSortedArray(globalStats?.countries, "country");
        }

        if (isAdmin || isRefPublic) {
            const refStats = mapToSortedArray(globalStats?.referrals, "ref");
            response.totalRefs = refStats.length;
            response.refPage = refPage;

            if (isAdmin) {
                const start = (refPage - 1) * limit;
                response.refStats = refStats.slice(start, start + limit);
            } else {
                response.refStats = refStats.slice(0, 10);
            }
        }

        if (isAdmin || isPathPublic) {
            const pathStats = mapToSortedArray(globalStats?.pages, "path");
            response.totalPaths = pathStats.length;
            response.pathPage = pathPage;

            if (isAdmin) {
                const start = (pathPage - 1) * limit;
                response.pathStats = pathStats.slice(start, start + limit);
            } else {
                response.pathStats = pathStats.slice(0, 10);
            }
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
