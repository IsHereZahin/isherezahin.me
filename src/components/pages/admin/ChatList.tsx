"use client";

import { PresenceIndicator } from "@/components/chat";
import { BlurImage, Skeleton } from "@/components/ui";
import { chat } from "@/lib/api";
import { useChatUnread } from "@/lib/hooks/useChat";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Users } from "lucide-react";

interface Conversation {
    _id: string;
    participantId: string;
    participantName: string;
    participantEmail: string;
    participantImage?: string;
    lastMessage: string;
    lastMessageAt: string;
    lastMessageBy: "user" | "admin";
    unreadCountAdmin: number;
    statusVisibilityOverride?: "show" | "hide" | null;
}

interface ActiveUser {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        image?: string;
    };
    isOnline: boolean;
    lastSeen: string;
}

interface ChatListProps {
    selectedConversationId?: string;
    onSelectConversation: (conversation: Conversation) => void;
}

export default function ChatList({
    selectedConversationId,
    onSelectConversation,
}: ChatListProps) {
    const { refreshUnreadCount } = useChatUnread();

    // Fetch conversations
    const { data: conversationsData, isLoading: loadingConversations } = useQuery({
        queryKey: ["admin-chat-conversations"],
        queryFn: () => chat.getConversations(),
        refetchInterval: 3000,
    });

    // Fetch active users
    const { data: presenceData } = useQuery({
        queryKey: ["admin-active-users"],
        queryFn: () => chat.getActiveUsers(),
        refetchInterval: 5000,
    });

    const conversations: Conversation[] = conversationsData?.conversations || [];
    const activeUsers: ActiveUser[] = presenceData?.activeUsers || [];

    const onlineCount = activeUsers.filter((u) => u.isOnline).length;

    if (loadingConversations) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Active Users Summary */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    {onlineCount} user{onlineCount !== 1 ? "s" : ""} online
                </span>
                {onlineCount > 0 && (
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                )}
            </div>

            {/* Conversations List */}
            <div className="space-y-2">
                {conversations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No conversations yet</p>
                    </div>
                ) : (
                    conversations.map((conv) => {
                        const userPresence = activeUsers.find(
                            (u) => u.userId?._id === conv.participantId
                        );
                        const isSelected = selectedConversationId === conv._id;

                        return (
                            <button
                                key={conv._id}
                                onClick={() => {
                                    onSelectConversation(conv);
                                    // Refresh unread count when conversation is opened (will be marked as read)
                                    setTimeout(() => refreshUnreadCount(), 500);
                                }}
                                className={cn(
                                    "w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left",
                                    isSelected
                                        ? "bg-primary/10 border border-primary/20"
                                        : "hover:bg-muted"
                                )}
                            >
                                <div className="relative">
                                    <BlurImage
                                        src={conv.participantImage || "/default-avatar.png"}
                                        alt={conv.participantName}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    {userPresence?.isOnline && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm truncate">
                                            {conv.participantName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(conv.lastMessageAt), {
                                                addSuffix: false,
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {conv.lastMessageBy === "admin" && "You: "}
                                        {conv.lastMessage}
                                    </p>
                                    {userPresence && (
                                        <PresenceIndicator
                                            isOnline={userPresence.isOnline}
                                            lastSeen={userPresence.lastSeen}
                                            size="sm"
                                        />
                                    )}
                                </div>
                                {conv.unreadCountAdmin > 0 && (
                                    <span className="flex-shrink-0 h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                        {conv.unreadCountAdmin}
                                    </span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
