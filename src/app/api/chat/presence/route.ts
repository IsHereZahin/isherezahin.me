import { auth } from "@/auth";
import { UserModel } from "@/database/models/user-model";
import { UserPresenceModel } from "@/database/models/user-presence-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

// GET: Get active users (for admin) or admin presence (for users)
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        await dbConnect();

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        if (isAdmin) {
            // Admin gets all active users (online in last 5 minutes), excluding admin
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            
            // First get admin user ID to exclude
            const adminUser = await UserModel.findOne({ 
                email: { $regex: new RegExp(`^${MY_MAIL}$`, 'i') }
            }).lean() as { _id: { toString(): string } } | null;
            
            const adminUserId = adminUser?._id?.toString();

            const activeUsersQuery: Record<string, unknown> = {
                $or: [
                    { isOnline: true },
                    { lastSeen: { $gte: fiveMinutesAgo } },
                ],
            };

            // Exclude admin from active users list
            if (adminUserId) {
                activeUsersQuery.userId = { $ne: adminUserId };
            }

            const activeUsers = await UserPresenceModel.find(activeUsersQuery)
                .populate("userId", "name email image")
                .lean();

            // Filter out any null userId entries and admin
            const filteredUsers = activeUsers.filter(u => {
                const userEmail = (u.userId as { email?: string })?.email;
                return u.userId && userEmail?.toLowerCase() !== MY_MAIL.toLowerCase();
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
