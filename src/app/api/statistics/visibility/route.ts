import { SiteSettingsModel } from "@/database/models/site-settings-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        await dbConnect();

        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const { isPublic, isRefPublic, setting } = body;

        // Handle specific setting update
        if (setting === "referralSources" && typeof isRefPublic === "boolean") {
            await SiteSettingsModel.findOneAndUpdate(
                { key: "referralSourcesPublic" },
                {
                    key: "referralSourcesPublic",
                    value: isRefPublic,
                    description: "Whether referral sources are publicly visible",
                },
                { upsert: true, new: true }
            );

            return NextResponse.json({
                message: `Referral sources are now ${isRefPublic ? "public" : "private"}`,
                isRefPublic,
            });
        }

        if (typeof isPublic !== "boolean") {
            return NextResponse.json({ error: "isPublic must be a boolean" }, { status: 400 });
        }

        await SiteSettingsModel.findOneAndUpdate(
            { key: "statisticsPublic" },
            {
                key: "statisticsPublic",
                value: isPublic,
                description: "Whether statistics page is publicly visible",
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            message: `Statistics are now ${isPublic ? "public" : "private"}`,
            isPublic,
        });
    } catch (error) {
        console.error("Error updating statistics visibility:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
