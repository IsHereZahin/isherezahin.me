import { auth } from "@/auth";
import { ChatConversationModel } from "@/database/models/chat-conversation-model";
import { ChatMessageModel } from "@/database/models/chat-message-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ conversationId: string; messageId: string }>;
}

// GET: Get message with edit history (admin only)
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();
        if (!isAdmin) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const { messageId } = await params;
        await dbConnect();

        const message = await ChatMessageModel.findById(messageId).lean();
        if (!message) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Error fetching message:", error);
        return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 });
    }
}

// PATCH: Edit message (user can edit within 10 minutes)
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { conversationId, messageId } = await params;
        const { content } = await request.json();

        if (!content?.trim()) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

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

        // Get the message
        const message = await ChatMessageModel.findById(messageId);
        if (!message) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        // Check if user owns the message
        if (message.senderId.toString() !== session.user.id) {
            return NextResponse.json({ error: "You can only edit your own messages" }, { status: 403 });
        }

        // Check 10-minute edit window (only for users, not admin)
        if (!isAdmin) {
            const messageAge = Date.now() - new Date(message.createdAt).getTime();
            const tenMinutes = 10 * 60 * 1000;
            if (messageAge > tenMinutes) {
                return NextResponse.json(
                    { error: "Messages can only be edited within 10 minutes of sending" },
                    { status: 400 }
                );
            }
        }

        // Save current content to edit history
        const editHistory = message.editHistory || [];
        editHistory.push({
            content: message.content,
            editedAt: new Date(),
        });

        // Update message
        message.content = content.trim();
        message.isEdited = true;
        message.editHistory = editHistory;
        await message.save();

        // Update conversation last message if this was the last message
        const lastMessage = await ChatMessageModel.findOne({ conversationId })
            .sort({ createdAt: -1 })
            .lean() as { _id: { toString(): string } } | null;

        if (lastMessage && lastMessage._id.toString() === messageId) {
            await ChatConversationModel.findByIdAndUpdate(conversationId, {
                lastMessage: content.trim().substring(0, 100),
            });
        }

        // Sanitize response for non-admin users
        const responseMessage = isAdmin
            ? message
            : {
                  _id: message._id,
                  conversationId: message.conversationId,
                  senderType: message.senderType,
                  senderName: message.senderName,
                  senderImage: message.senderImage,
                  content: message.content,
                  isRead: message.isRead,
                  isEdited: message.isEdited,
                  createdAt: message.createdAt,
                  updatedAt: message.updatedAt,
              };

        return NextResponse.json({ success: true, message: responseMessage });
    } catch (error) {
        console.error("Error editing message:", error);
        return NextResponse.json({ error: "Failed to edit message" }, { status: 500 });
    }
}
