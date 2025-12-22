import { auth } from "@/auth";
import { ChatConversationModel } from "@/database/models/chat-conversation-model";
import { ChatMessageModel } from "@/database/models/chat-message-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ conversationId: string }>;
}

// POST: Mark messages as read
export async function POST(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { conversationId } = await params;
        await dbConnect();

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        // Verify access to conversation
        const conversation = await ChatConversationModel.findById(conversationId);
        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        if (!isAdmin && conversation.participantId.toString() !== session.user.id) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Mark messages as read
        const senderTypeToMark = isAdmin ? "user" : "admin";
        await ChatMessageModel.updateMany(
            {
                conversationId,
                senderType: senderTypeToMark,
                isRead: false,
            },
            { isRead: true, readAt: new Date() }
        );

        // Reset unread count
        const updateField = isAdmin ? "unreadCountAdmin" : "unreadCountUser";
        await ChatConversationModel.findByIdAndUpdate(conversationId, {
            [updateField]: 0,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
    }
}
