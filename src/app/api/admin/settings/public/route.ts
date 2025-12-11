import { AdminSettingsModel } from "@/database/models/admin-settings-model";
import dbConnect from "@/database/services/mongo";
import { NextResponse } from "next/server";

// Public settings that can be accessed without authentication
const PUBLIC_SETTINGS = ["allowGitHubLogin", "allowGoogleLogin", "primaryLoginMethod"];

const DEFAULT_VALUES: Record<string, unknown> = {
    allowGitHubLogin: true,
    allowGoogleLogin: false,
    primaryLoginMethod: "github",
};

export async function GET() {
    try {
        await dbConnect();

        const settings = await AdminSettingsModel.find({ 
            key: { $in: PUBLIC_SETTINGS } 
        }).lean();

        const settingsMap: Record<string, unknown> = {};

        for (const key of PUBLIC_SETTINGS) {
            const existing = settings.find((s: Record<string, unknown>) => s.key === key);
            settingsMap[key] = existing ? existing.value : DEFAULT_VALUES[key];
        }

        return NextResponse.json({ settings: settingsMap });
    } catch (error) {
        console.error("Error fetching public settings:", error);
        return NextResponse.json({ 
            settings: DEFAULT_VALUES 
        });
    }
}
