import { auth } from "@/auth";
import { ChatConversationModel } from "@/database/models/chat-conversation-model";
import { ChatMessageModel } from "@/database/models/chat-message-model";
import { UserModel } from "@/database/models/user-model";
import { UserPresenceModel } from "@/database/models/user-presence-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

// Timeout for considering a user offline (30 seconds)
const ONLINE_TIMEOUT_MS = 30 * 1000;

interface RouteParams {
    params: Promise<{ conversationId: string }>;
}

interface ConversationDoc {
    _id: unknown;
    participantId: { toString(): string };
    participantName: string;
    participantEmail: string;
    participantImage?: string;
    lastMessage?: string;
    lastMessageAt?: Date;
    lastMessageBy?: string;
    unreadCountUser?: number;
    unreadCountAdmin?: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface MessageDoc {
    _id: unknown;
    conversationId: unknown;
    senderId?: unknown;
    senderType: string;
    senderName: string;
    senderImage?: string;
    content: string;
    isRead: boolean;
    readAt?: Date;
    isEdited: boolean;
    editHistory?: unknown[];
    createdAt: Date;
    updatedAt?: Date;
}

// Helper to sanitize conversation for non-admin users
function sanitizeConversationForUser(conversation: ConversationDoc) {
    return {
        _id: conversation._id,
        participantId: conversation.participantId,
        participantName: conversation.participantName,
        participantImage: conversation.participantImage,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        lastMessageBy: conversation.lastMessageBy,
        unreadCountUser: conversation.unreadCountUser || 0,
        isActive: conversation.isActive,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    };
}

// Helper to sanitize messages - remove senderId for non-admin
function sanitizeMessagesForUser(messages: MessageDoc[]) {
    return messages.map((msg) => ({
        _id: msg._id,
        conversationId: msg.conversationId,
        senderType: msg.senderType,
        senderName: msg.senderName,
        senderImage: msg.senderImage,
        content: msg.content,
        isRead: msg.isRead,
        readAt: msg.readAt,
        isEdited: msg.isEdited,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
    }));
}

// Helper to check if user is actually online based on lastSeen
function isUserActuallyOnline(
    isOnline: boolean | undefined,
    lastSeen: Date | undefined
): boolean {
    if (!isOnline || !lastSeen) return false;
    return new Date(lastSeen).getTime() >= Date.now() - ONLINE_TIMEOUT_MS;
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
        const limit = 30;

        await dbConnect();

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        // Verify access to conversation
        const conversation = (await ChatConversationModel.findById(
            conversationId
        ).lean()) as unknown as ConversationDoc | null;
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

        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        const messages = (await ChatMessageModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit + 1)
            .lean()) as unknown as MessageDoc[];

        const hasMore = messages.length > limit;
        if (hasMore) {
            messages.pop();
        }

        messages.reverse();

        const nextCursor =
            hasMore && messages.length > 0 ? messages[0].createdAt.toISOString() : undefined;

        // Get presence data based on role
        let presenceData = null;

        if (isAdmin) {
            // Admin sees participant's presence
            const participantPresence = (await UserPresenceModel.findOne({
                userId: conversation.participantId,
            }).lean()) as { isOnline: boolean; lastSeen: Date; hideLastSeen: boolean } | null;

            if (participantPresence) {
                presenceData = {
                    isOnline: isUserActuallyOnline(
                        participantPresence.isOnline,
                        participantPresence.lastSeen
                    ),
                    lastSeen: participantPresence.hideLastSeen
                        ? null
                        : participantPresence.lastSeen,
                    hideLastSeen: participantPresence.hideLastSeen,
                };
            }
        } else {
            // User sees admin's presence (respecting hideLastSeen setting)
            const adminUser = await UserModel.findOne({
                email: { $regex: new RegExp("^" + MY_MAIL + "$", "i") },
            });

            if (adminUser) {
                const adminPresence = (await UserPresenceModel.findOne({
                    userId: adminUser._id,
                }).lean()) as { isOnline: boolean; lastSeen: Date; hideLastSeen: boolean } | null;

                const shouldHideStatus = adminPresence?.hideLastSeen ?? false;
                const actuallyOnline = isUserActuallyOnline(
                    adminPresence?.isOnline,
                    adminPresence?.lastSeen
                );

                presenceData = {
                    isOnline: shouldHideStatus ? false : actuallyOnline,
                    lastSeen: shouldHideStatus ? null : (adminPresence?.lastSeen ?? null),
                    hideLastSeen: shouldHideStatus,
                };
            }
        }

        // Mark messages as read on first page
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

        // Sanitize response based on role
        const responseConversation = isAdmin
            ? conversation
            : sanitizeConversationForUser(conversation);

        const responseMessages = isAdmin ? messages : sanitizeMessagesForUser(messages);

        return NextResponse.json({
            conversation: responseConversation,
            messages: responseMessages,
            presence: presenceData,
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
                return NextResponse.json(
                    { error: "Your account has been suspended" },
                    { status: 403 }
                );
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

        // Sanitize message response for non-admin
        const responseMessage = isAdmin
            ? chatMessage
            : {
                  _id: chatMessage._id,
                  conversationId: chatMessage.conversationId,
                  senderType: chatMessage.senderType,
                  senderName: chatMessage.senderName,
                  senderImage: chatMessage.senderImage,
                  content: chatMessage.content,
                  isRead: chatMessage.isRead,
                  isEdited: chatMessage.isEdited,
                  createdAt: chatMessage.createdAt,
                  updatedAt: chatMessage.updatedAt,
              };

        return NextResponse.json({ success: true, message: responseMessage });
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
        await ChatMessageModel.updateMany({ conversationId }, { isDeleted: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
    }
}
