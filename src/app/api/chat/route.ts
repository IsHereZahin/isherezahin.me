import { auth } from "@/auth";
import { ChatConversationModel } from "@/database/models/chat-conversation-model";
import { ChatMessageModel } from "@/database/models/chat-message-model";
import { UserModel } from "@/database/models/user-model";
import { UserPresenceModel } from "@/database/models/user-presence-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

// GET: Get conversations (admin gets all, user gets their own)
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        await dbConnect();

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        if (isAdmin) {
            // Admin gets all conversations
            const conversations = await ChatConversationModel.find({ isActive: true })
                .sort({ lastMessageAt: -1 })
                .lean();
            return NextResponse.json({ conversations });
        } else {
            // User gets their own conversation
            const conversation = await ChatConversationModel.findOne({
                participantId: session.user.id,
                isActive: true,
            }).lean();
            return NextResponse.json({ conversation });
        }
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}

// POST: Create a new conversation or send first message
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        await dbConnect();

        // Check if user is banned
        const user = await UserModel.findById(session.user.id);
        if (user?.isBanned) {
            return NextResponse.json({ error: "Your account has been suspended" }, { status: 403 });
        }

        const { message } = await request.json();

        if (!message?.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        if (isAdmin) {
            return NextResponse.json({ error: "Admin cannot start a conversation" }, { status: 400 });
        }

        // Check if conversation already exists
        let conversation = await ChatConversationModel.findOne({
            participantId: session.user.id,
        });

        if (!conversation) {
            // Create new conversation
            conversation = await ChatConversationModel.create({
                participantId: session.user.id,
                participantName: session.user.name || "Anonymous",
                participantEmail: session.user.email || "",
                participantImage: session.user.image || "",
                lastMessage: message.trim().substring(0, 100),
                lastMessageAt: new Date(),
                lastMessageBy: "user",
                unreadCountAdmin: 1,
            });
        } else if (!conversation.isActive) {
            // Reactivate conversation
            conversation.isActive = true;
            conversation.lastMessage = message.trim().substring(0, 100);
            conversation.lastMessageAt = new Date();
            conversation.lastMessageBy = "user";
            conversation.unreadCountAdmin = (conversation.unreadCountAdmin || 0) + 1;
            await conversation.save();
        } else {
            // Update existing conversation
            conversation.lastMessage = message.trim().substring(0, 100);
            conversation.lastMessageAt = new Date();
            conversation.lastMessageBy = "user";
            conversation.unreadCountAdmin = (conversation.unreadCountAdmin || 0) + 1;
            await conversation.save();
        }

        // Create the message
        const chatMessage = await ChatMessageModel.create({
            conversationId: conversation._id,
            senderId: session.user.id,
            senderType: "user",
            senderName: session.user.name || "Anonymous",
            senderImage: session.user.image || "",
            content: message.trim(),
        });

        // Update user presence
        await UserPresenceModel.findOneAndUpdate(
            { userId: session.user.id },
            { isOnline: true, lastSeen: new Date() },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            conversation,
            message: chatMessage,
        });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}
