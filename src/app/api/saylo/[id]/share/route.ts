import { SayloModel, SayloShareModel } from "@/database/models/saylo-model";
import { SiteSettingsModel } from "@/database/models/site-settings-model";
import dbConnect from "@/database/services/mongo";
import { auth } from "@/auth";
import { UserModel } from "@/database/models/user-model";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

// Helper function to check if Saylo page is public
async function isSayloPagePublic(): Promise<boolean> {
    const setting = await SiteSettingsModel.findOne({ key: "sayloPagePublic" }).lean();
    return setting ? (setting as { value: boolean }).value : true;
}

interface DbUser {
    _id: { toString(): string };
}

const GUEST_ADJECTIVES = ["Happy", "Curious", "Clever", "Friendly", "Bright", "Swift", "Calm", "Bold", "Wise", "Kind"];
const GUEST_NOUNS = ["Panda", "Fox", "Owl", "Bear", "Wolf", "Eagle", "Tiger", "Lion", "Hawk", "Deer"];

function generateGuestName(): string {
    const adj = GUEST_ADJECTIVES[Math.floor(Math.random() * GUEST_ADJECTIVES.length)];
    const noun = GUEST_NOUNS[Math.floor(Math.random() * GUEST_NOUNS.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        // Check if Saylo page is public - return empty data for non-admin if private
        const isAdmin = await checkIsAdmin();
        const pageIsPublic = await isSayloPagePublic();
        if (!isAdmin && !pageIsPublic) {
            return NextResponse.json({
                shareCount: 0,
                hasShared: false,
            });
        }

        const { id } = await context.params;
        const deviceId = req.headers.get("x-device-id") || "";

        const session = await auth();
        let dbUser: DbUser | null = null;
        if (session?.user?.id) {
            dbUser = await UserModel.findById(session.user.id).lean() as DbUser | null;
        }

        const saylo = await SayloModel.findById(id).lean();

        if (!saylo) {
            return NextResponse.json({ error: "Saylo not found" }, { status: 404 });
        }

        const shareCount = await SayloShareModel.countDocuments({ sayloId: id });

        let hasShared = false;

        if (dbUser) {
            const existingShare = await SayloShareModel.findOne({
                sayloId: id,
                userId: dbUser._id,
            }).lean();
            hasShared = !!existingShare;
        } else if (deviceId) {
            const existingShare = await SayloShareModel.findOne({
                sayloId: id,
                deviceId,
                userId: null,
            }).lean();
            hasShared = !!existingShare;
        }

        return NextResponse.json({
            shareCount,
            hasShared,
        });
    } catch {
        return NextResponse.json({ error: "Failed to fetch share status" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        // Check if Saylo page is public - return empty data for non-admin if private
        const isAdmin = await checkIsAdmin();
        const pageIsPublic = await isSayloPagePublic();
        if (!isAdmin && !pageIsPublic) {
            return NextResponse.json({
                shareCount: 0,
                hasShared: false,
            });
        }

        const { id } = await context.params;
        const deviceId = req.headers.get("x-device-id");

        const session = await auth();
        let dbUser: DbUser | null = null;
        if (session?.user?.id) {
            dbUser = await UserModel.findById(session.user.id).lean() as DbUser | null;
        }

        if (!dbUser && !deviceId) {
            return NextResponse.json({ error: "Device ID required for guest users" }, { status: 400 });
        }

        const saylo = await SayloModel.findById(id);

        if (!saylo) {
            return NextResponse.json({ error: "Saylo not found" }, { status: 404 });
        }

        let existingShare;

        if (dbUser) {
            existingShare = await SayloShareModel.findOne({
                sayloId: id,
                userId: dbUser._id,
            });
        } else {
            existingShare = await SayloShareModel.findOne({
                sayloId: id,
                deviceId,
                userId: null,
            });
        }

        if (existingShare) {
            const shareCount = await SayloShareModel.countDocuments({ sayloId: id });
            return NextResponse.json({
                shareCount,
                hasShared: true,
            });
        }

        const shareData: {
            sayloId: string;
            userId?: string;
            deviceId?: string;
            guestName?: string;
        } = {
            sayloId: id,
        };

        if (dbUser) {
            shareData.userId = dbUser._id.toString();
        } else {
            shareData.deviceId = deviceId!;
            shareData.guestName = generateGuestName();
        }

        await SayloShareModel.create(shareData);

        const shareCount = await SayloShareModel.countDocuments({ sayloId: id });

        return NextResponse.json({
            shareCount,
            hasShared: true,
        });
    } catch {
        return NextResponse.json({ error: "Failed to record share" }, { status: 500 });
    }
}
