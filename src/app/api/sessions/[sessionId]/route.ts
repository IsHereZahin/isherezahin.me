import { auth } from "@/auth";
import { SessionModel } from "@/database/models/session-model";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const session = await auth();
        const { sessionId } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        // Get user from database
        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Find the session to revoke
        const targetSession = await SessionModel.findById(sessionId);

        if (!targetSession) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Verify ownership - user can only revoke their own sessions
        if (targetSession.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 403 }
            );
        }

        // Prevent revoking current session
        if (targetSession.sessionToken === session.sessionToken) {
            return NextResponse.json(
                { error: "Cannot revoke current session" },
                { status: 400 }
            );
        }

        // Revoke the session
        targetSession.isRevoked = true;
        await targetSession.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error revoking session:", error);
        return NextResponse.json(
            { error: "Failed to revoke session" },
            { status: 500 }
        );
    }
}
