import { auth } from "@/auth";
import { ChatConversationModel } from "@/database/models/chat-conversation-model";
import { ChatMessageModel } from "@/database/models/chat-message-model";
import { UserModel } from "@/database/models/user-model";
import { UserPresenceModel } from "@/database/models/user-presence-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ conversationId: string }>;
}

// GET: Get messages for a conversation with pagination
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { conversationId } = await params;
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get("cursor");
        const limit = 30; // Messages per page

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

        // Build query for messages
        interface MessageQuery {
            conversationId: string;
            isDeleted: boolean;
            createdAt?: { $lt: Date };
        }
        
        const query: MessageQuery = {
            conversationId,
            isDeleted: false,
        };

        // If cursor provided, get messages older than cursor
        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        // Get messages (fetch one extra to check if there are more)
        const messages = await ChatMessageModel.find(query)
            .sort({ createdAt: -1 }) // Newest first for pagination
            .limit(limit + 1)
            .lean();

        // Check if there are more messages
        const hasMore = messages.length > limit;
        if (hasMore) {
            messages.pop(); // Remove the extra message
        }

        // Reverse to get chronological order for display
        messages.reverse();

        // Get next cursor (oldest message in current batch)
        const nextCursor = hasMore && messages.length > 0 
            ? (messages[0] as unknown as { createdAt: Date }).createdAt.toISOString() 
            : undefined;

        // Get admin presence for user view
        const adminUser = await UserModel.findOne({ 
            email: { $regex: new RegExp(`^${MY_MAIL}$`, 'i') }
        });
        let adminPresence = null;
        
        if (adminUser) {
            const presence = await UserPresenceModel.findOne({
                userId: adminUser._id,
            }).lean() as { isOnline: boolean; lastSeen: Date; hideLastSeen: boolean } | null;
            
            // Use global setting (hideLastSeen) for status visibility
            const shouldHideStatus = presence?.hideLastSeen ?? false;
            
            // Always return adminPresence object (even if presence record doesn't exist)
            adminPresence = {
                isOnline: shouldHideStatus ? false : (presence?.isOnline ?? false),
                lastSeen: shouldHideStatus ? null : (presence?.lastSeen ?? null),
                hideLastSeen: shouldHideStatus,
            };
        }

        // Get participant presence (for admin view)
        const participantPresence = await UserPresenceModel.findOne({
            userId: conversation.participantId,
        }).lean() as { isOnline: boolean; lastSeen: Date; hideLastSeen: boolean } | null;

        // Only mark as read on first page (no cursor)
        if (!cursor) {
            const updateField = isAdmin ? "unreadCountAdmin" : "unreadCountUser";
            await ChatConversationModel.findByIdAndUpdate(conversationId, {
                [updateField]: 0,
            });

            const senderTypeToMark = isAdmin ? "user" : "admin";
            await ChatMessageModel.updateMany(
                {
                    conversationId,
                    senderType: senderTypeToMark,
                    isRead: false,
                },
                { isRead: true, readAt: new Date() }
            );
        }

        return NextResponse.json({
            conversation,
            messages,
            presence: isAdmin 
                ? (participantPresence
                    ? {
                          isOnline: participantPresence.isOnline,
                          lastSeen: participantPresence.hideLastSeen ? null : participantPresence.lastSeen,
                          hideLastSeen: participantPresence.hideLastSeen,
                      }
                    : null)
                : adminPresence,
            hasMore,
            nextCursor,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

// POST: Send a message to conversation
export async function POST(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { conversationId } = await params;
        const { message } = await request.json();

        if (!message?.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        await dbConnect();

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        // Check if user is banned (only for non-admin)
        if (!isAdmin) {
            const user = await UserModel.findById(session.user.id);
            if (user?.isBanned) {
                return NextResponse.json({ error: "Your account has been suspended" }, { status: 403 });
            }
        }

        // Verify access to conversation
        const conversation = await ChatConversationModel.findById(conversationId);
        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        if (!isAdmin && conversation.participantId.toString() !== session.user.id) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Create message
        const chatMessage = await ChatMessageModel.create({
            conversationId,
            senderId: session.user.id,
            senderType: isAdmin ? "admin" : "user",
            senderName: session.user.name || "Anonymous",
            senderImage: session.user.image || "",
            content: message.trim(),
        });

        // Update conversation
        const unreadField = isAdmin ? "unreadCountUser" : "unreadCountAdmin";
        await ChatConversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: message.trim().substring(0, 100),
            lastMessageAt: new Date(),
            lastMessageBy: isAdmin ? "admin" : "user",
            $inc: { [unreadField]: 1 },
        });

        // Update presence
        await UserPresenceModel.findOneAndUpdate(
            { userId: session.user.id },
            { isOnline: true, lastSeen: new Date() },
            { upsert: true }
        );

        return NextResponse.json({ success: true, message: chatMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}

// DELETE: Delete conversation (admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();
        if (!isAdmin) {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const { conversationId } = await params;
        await dbConnect();

        // Soft delete - mark as inactive
        await ChatConversationModel.findByIdAndUpdate(conversationId, {
            isActive: false,
        });

        // Mark all messages as deleted
        await ChatMessageModel.updateMany(
            { conversationId },
            { isDeleted: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
    }
}
