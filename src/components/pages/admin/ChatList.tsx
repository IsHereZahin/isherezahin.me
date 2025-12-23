"use client";

import { PresenceIndicator } from "@/components/chat";
import { BlurImage } from "@/components/ui";
import {
    FirebaseConversation,
    FirebasePresence,
    subscribeToConversations,
    subscribeToPresence
} from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Conversation extends FirebaseConversation {
    id: string;
}

interface ChatListProps {
    selectedConversationId?: string;
    onSelectConversation: (conversation: Conversation) => void;
}

export default function ChatList({
    selectedConversationId,
    onSelectConversation,
}: ChatListProps) {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [presenceMap, setPresenceMap] = useState<Record<string, FirebasePresence>>({});
    const [loading, setLoading] = useState(true);

    // Subscribe to conversations (real-time)
    useEffect(() => {
        if (!user?.id) return;

        const unsubscribe = subscribeToConversations((convs) => {
            // Filter out admin's own conversation
            const filtered = convs.filter((c) => c.participantId !== user.id);
            setConversations(filtered);
            setLoading(false);
        });

        return unsubscribe;
    }, [user?.id]);

    // Subscribe to presence for each participant
    useEffect(() => {
        const unsubscribes: (() => void)[] = [];

        conversations.forEach((conv) => {
            const unsubscribe = subscribeToPresence(conv.participantId, (presence) => {
                if (presence) {
                    setPresenceMap((prev) => ({
                        ...prev,
                        [conv.participantId]: presence,
                    }));
                }
            });
            unsubscribes.push(unsubscribe);
        });

        return () => {
            unsubscribes.forEach((unsub) => unsub());
        };
    }, [conversations]);

    const onlineCount = Object.values(presenceMap).filter((p) => p.isOnline).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                        const userPresence = presenceMap[conv.participantId];
                        const isSelected = selectedConversationId === conv.id;
                        const lastMessageAt =
                            typeof conv.lastMessageAt === "number"
                                ? new Date(conv.lastMessageAt)
                                : new Date();

                        return (
                            <button
                                key={conv.id}
                                onClick={() => onSelectConversation(conv)}
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
                                            {formatDistanceToNow(lastMessageAt, {
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
                                            lastSeen={
                                                typeof userPresence.lastSeen === "number"
                                                    ? new Date(userPresence.lastSeen).toISOString()
                                                    : null
                                            }
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
