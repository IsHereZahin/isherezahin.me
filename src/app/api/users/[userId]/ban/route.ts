import { auth } from "@/auth";
import { SessionModel } from "@/database/models/session-model";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.email.toLowerCase() !== MY_MAIL.toLowerCase()) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { userId } = await params;
        const { action } = await request.json();

        if (!["ban", "unban"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Prevent admin from banning themselves
        if (user.email?.toLowerCase() === MY_MAIL.toLowerCase()) {
            return NextResponse.json(
                { error: "Cannot ban admin user" },
                { status: 400 }
            );
        }

        const isBanned = action === "ban";
        await UserModel.findByIdAndUpdate(userId, { isBanned });

        // If banning, revoke all user sessions
        if (isBanned) {
            await SessionModel.updateMany(
                { userId: user._id },
                { isRevoked: true }
            );
        }

        return NextResponse.json({
            success: true,
            isBanned,
            message: isBanned
                ? "User has been banned"
                : "User has been unbanned",
        });
    } catch (error) {
        console.error("Error updating user ban status:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
