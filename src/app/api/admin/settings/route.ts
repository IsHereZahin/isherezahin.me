import { SiteSettingsModel } from "@/database/models/site-settings-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

// Default settings
const DEFAULT_SETTINGS = {
    newsletterEnabled: {
        value: true,
        description: "Send newsletter emails to subscribers when new blog is published",
    },
    allowGitHubLogin: {
        value: true,
        description: "Allow GitHub login for guestbook",
    },
    allowGoogleLogin: {
        value: false,
        description: "Allow Google login for guestbook",
    },
    primaryLoginMethod: {
        value: "github",
        description: "Primary login method when only one is enabled",
    },
    allowAnyUserStartConversation: {
        value: true,
        description: "Allow any GitHub user to start conversations, or restrict to admins only",
    },
    sayloPagePublic: {
        value: true,
        description: "Make Saylo page publicly accessible or show coming soon",
    },
};

export async function GET() {
    try {
        await dbConnect();
        
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Get all settings
        const settings = await SiteSettingsModel.find({}).lean();
        
        // Build settings object with defaults
        const settingsMap: Record<string, unknown> = {};
        
        for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
            const existing = settings.find((s: Record<string, unknown>) => s.key === key);
            settingsMap[key] = existing ? existing.value : defaultValue.value;
        }

        return NextResponse.json({ settings: settingsMap });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await dbConnect();
        
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
        }

        // Validate key exists in default settings
        if (!(key in DEFAULT_SETTINGS)) {
            return NextResponse.json({ error: "Invalid setting key" }, { status: 400 });
        }

        // Upsert the setting
        await SiteSettingsModel.findOneAndUpdate(
            { key },
            { 
                key, 
                value, 
                description: DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS].description 
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            message: "Setting updated successfully",
            key,
            value,
        });
    } catch (error) {
        console.error("Error updating setting:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Helper function to get a specific setting (for internal use)
export async function getAdminSetting(key: string): Promise<unknown> {
    try {
        await dbConnect();
        const setting = await SiteSettingsModel.findOne({ key }).lean();
        
        if (setting) {
            return (setting as Record<string, unknown>).value;
        }
        
        // Return default if exists
        if (key in DEFAULT_SETTINGS) {
            return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS].value;
        }
        
        return null;
    } catch (error) {
        console.error("Error getting setting:", error);
        return null;
    }
}
