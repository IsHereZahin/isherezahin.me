import { SiteSettingsModel } from "@/database/models/site-settings-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();

        // Fetch all visibility settings in a single query
        const settings = await SiteSettingsModel.find({
            key: {
                $in: [
                    "statisticsPublic",
                    "statsCardsPublic",
                    "visitorTrendsPublic",
                    "deviceTypesPublic",
                    "countriesPublic",
                    "topPagesPublic",
                    "referralSourcesPublic",
                ],
            },
        }).lean();

        // Map settings to response object with defaults
        const settingsMap = settings.reduce((acc, s) => {
            const setting = s as unknown as { key: string; value: boolean };
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, boolean>);

        return NextResponse.json({
            isPublic: settingsMap.statisticsPublic ?? false,
            isCardsPublic: settingsMap.statsCardsPublic ?? true,
            isTrendsPublic: settingsMap.visitorTrendsPublic ?? true,
            isDevicesPublic: settingsMap.deviceTypesPublic ?? true,
            isCountriesPublic: settingsMap.countriesPublic ?? true,
            isPathPublic: settingsMap.topPagesPublic ?? false,
            isRefPublic: settingsMap.referralSourcesPublic ?? false,
        });
    } catch (error) {
        console.error("Error fetching statistics settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
