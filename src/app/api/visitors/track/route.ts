import { DailyStatsModel, GlobalStatsModel, VisitorHashModel } from "@/database/models/visitor-model";
import dbConnect from "@/database/services/mongo";
import { getCountryFromIP, getTodayDate, hashIP, parseDeviceType } from "@/lib/geo-utils";
import { getClientIp } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const userAgent = request.headers.get("user-agent") || null;
        const ip = getClientIp(request);
        const ipHash = hashIP(ip);

        const device = parseDeviceType(userAgent);
        if (device === "Bot") {
            return NextResponse.json({ success: true, tracked: false });
        }

        const body = await request.json();
        const { ref, path } = body;
        const today = getTodayDate();

        const country = await getCountryFromIP(ip);

        let isNewVisitor = false;
        try {
            await VisitorHashModel.create({ hash: ipHash, date: today });
            isNewVisitor = true;
        } catch (error: unknown) {
            if ((error as { code?: number }).code !== 11000) {
                console.error("Error checking visitor hash:", error);
            }
        }

        const sanitizedPath = (path || "/").replaceAll(".", "_");
        const sanitizedRef = ref ? ref.replaceAll(".", "_") : null;

        const dailyInc: Record<string, number> = {
            pageViews: 1,
            [`devices.${device}`]: 1,
            [`countries.${country}`]: 1,
            [`pages.${sanitizedPath}`]: 1,
        };

        const globalInc: Record<string, number> = {
            totalPageViews: 1,
            [`devices.${device}`]: 1,
            [`countries.${country}`]: 1,
            [`pages.${sanitizedPath}`]: 1,
        };

        if (isNewVisitor) {
            dailyInc.uniqueVisitors = 1;
            globalInc.totalUniqueVisitors = 1;
        }

        if (sanitizedRef) {
            dailyInc[`referrals.${sanitizedRef}`] = 1;
            globalInc[`referrals.${sanitizedRef}`] = 1;
        }

        await Promise.all([
            DailyStatsModel.findOneAndUpdate({ date: today }, { $inc: dailyInc }, { upsert: true }),
            GlobalStatsModel.findOneAndUpdate({ key: "global" }, { $inc: globalInc }, { upsert: true }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking visitor:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
