import { auth } from "@/auth";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

// In-memory store for typing status (in production, use Redis)
const typingStatus = new Map<string, { odId: string; isTyping: boolean; timestamp: number }>();

// Clean up old typing statuses (older than 5 seconds)
const cleanupTypingStatus = () => {
    const now = Date.now();
    for (const [key, value] of typingStatus.entries()) {
        if (now - value.timestamp > 5000) {
            typingStatus.delete(key);
        }
    }
};

// GET: Get typing status for a conversation
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
        }

        await dbConnect();
        cleanupTypingStatus();

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        // Get the other party's typing status
        const otherPartyKey = isAdmin
            ? `user-${conversationId}`
            : `admin-${conversationId}`;

        const status = typingStatus.get(otherPartyKey);
        const isTyping = status?.isTyping && Date.now() - status.timestamp < 5000;

        return NextResponse.json({ isTyping: !!isTyping });
    } catch (error) {
        console.error("Error fetching typing status:", error);
        return NextResponse.json({ error: "Failed to fetch typing status" }, { status: 500 });
    }
}

// POST: Update typing status
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { conversationId, isTyping } = await request.json();

        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
        }

        const isAdmin = session.user.email?.toLowerCase() === MY_MAIL.toLowerCase();

        // Set typing status
        const key = isAdmin ? `admin-${conversationId}` : `user-${conversationId}`;
        
        if (isTyping) {
            typingStatus.set(key, {
                odId: session.user.id,
                isTyping: true,
                timestamp: Date.now(),
            });
        } else {
            typingStatus.delete(key);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating typing status:", error);
        return NextResponse.json({ error: "Failed to update typing status" }, { status: 500 });
    }
}
