import { auth } from "@/auth";
import { UserModel } from "@/database/models/user-model";
import { UserPresenceModel } from "@/database/models/user-presence-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

// Timeout for considering a user offline (30 seconds - slightly more than heartbeat interval)
const ONLINE_TIMEOUT_MS = 30 * 1000;

// GET: Get active users (for admin) or user's own presence
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        await dbConnect();

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        if (isAdmin) {
            // Admin gets all active users, excluding admin
            const timeoutThreshold = new Date(Date.now() - ONLINE_TIMEOUT_MS);

            // Get admin user ID to exclude
            const escapedMail = MY_MAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const adminUser = (await UserModel.findOne({
                email: { $regex: new RegExp("^" + escapedMail + "$", "i") },
            }).lean()) as { _id: { toString(): string } } | null;

            const adminUserId = adminUser?._id?.toString();

            // Find users who are online OR were seen recently
            const activeUsersQuery: Record<string, unknown> = {
                $or: [
                    { isOnline: true, lastSeen: { $gte: timeoutThreshold } },
                    { lastSeen: { $gte: new Date(Date.now() - 5 * 60 * 1000) } }, // Show recently active
                ],
            };

            // Exclude admin from active users list
            if (adminUserId) {
                activeUsersQuery.userId = { $ne: adminUserId };
            }

            const activeUsers = await UserPresenceModel.find(activeUsersQuery)
                .populate("userId", "name email image")
                .lean();

            // Filter and mark actual online status based on timeout
            const filteredUsers = activeUsers
                .filter((u) => {
                    const userEmail = (u.userId as { email?: string })?.email;
                    return u.userId && userEmail?.toLowerCase() !== MY_MAIL.toLowerCase();
                })
                .map((u) => {
                    const lastSeen = new Date(u.lastSeen as Date);
                    const isActuallyOnline =
                        u.isOnline && lastSeen.getTime() >= timeoutThreshold.getTime();
                    return {
                        ...u,
                        isOnline: isActuallyOnline,
                    };
                });

            return NextResponse.json({ activeUsers: filteredUsers });
        } else {
            // User gets their own presence
            const presence = await UserPresenceModel.findOne({
                userId: session.user.id,
            }).lean();

            return NextResponse.json({ presence });
        }
    } catch (error) {
        console.error("Error fetching presence:", error);
        return NextResponse.json({ error: "Failed to fetch presence" }, { status: 500 });
    }
}

// POST: Update presence (heartbeat)
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { isOnline } = await request.json();

        await dbConnect();

        await UserPresenceModel.findOneAndUpdate(
            { userId: session.user.id },
            {
                isOnline: isOnline !== false,
                lastSeen: new Date(),
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating presence:", error);
        return NextResponse.json({ error: "Failed to update presence" }, { status: 500 });
    }
}

// PATCH: Update last seen visibility (admin only)
export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();
        if (!isAdmin) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const { hideLastSeen } = await request.json();

        await dbConnect();

        await UserPresenceModel.findOneAndUpdate(
            { userId: session.user.id },
            { hideLastSeen: !!hideLastSeen },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating last seen visibility:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
