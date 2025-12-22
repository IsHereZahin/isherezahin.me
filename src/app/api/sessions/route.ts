import { auth } from "@/auth";
import { SessionModel } from "@/database/models/session-model";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found", logout: true },
                { status: 404 }
            );
        }

        const sessions = await SessionModel.find({
            userId: user._id,
            isRevoked: false,
        }).sort({ createdAt: -1 });

        const formattedSessions = sessions.map((s) => ({
            id: s._id.toString(),
            deviceType: s.deviceType,
            ipAddress: s.ipAddress || null,
            createdAt: s.createdAt,
            lastActiveAt: s.lastActiveAt,
            isCurrent: s.sessionToken === session.sessionToken,
        }));

        return NextResponse.json({ sessions: formattedSessions });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch sessions" },
            { status: 500 }
        );
    }
}
