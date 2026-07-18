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
import { Loader2, MessageCircle } from "lucide-react";
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
    const unreadTotal = conversations.reduce((sum, c) => sum + (c.unreadCountAdmin || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--s-muted)]" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary stat tiles */}
            {conversations.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    <StatTile label="Total" value={conversations.length} />
                    <StatTile label="Online" value={onlineCount} accent={onlineCount > 0 ? "green" : undefined} />
                    <StatTile label="Unread" value={unreadTotal} accent={unreadTotal > 0 ? "coral" : undefined} />
                </div>
            )}

            {/* Conversations List */}
            {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--s-soft)]/60 py-12 text-center">
                    <MessageCircle className="mb-3 h-9 w-9 text-[var(--s-faint)]" />
                    <p className="text-[13px] font-medium text-[var(--s-text2)]">No conversations yet</p>
                    <p className="mt-1 text-[12px] text-[var(--s-muted)]">New messages will appear here</p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    {conversations.map((conv) => {
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
                                    "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors",
                                    isSelected
                                        ? "bg-[var(--s-soft)] ring-1 ring-[var(--s-text)]/10"
                                        : "hover:bg-[var(--s-soft)]"
                                )}
                            >
                                <div className="relative shrink-0">
                                    <BlurImage
                                        src={conv.participantImage || "/default-avatar.png"}
                                        alt={conv.participantName}
                                        width={44}
                                        height={44}
                                        className="rounded-full"
                                    />
                                    {userPresence?.isOnline && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate text-[14px] font-semibold text-[var(--s-text)]">
                                            {conv.participantName}
                                        </span>
                                        <span className="shrink-0 text-[11px] text-[var(--s-muted)]">
                                            {formatDistanceToNow(lastMessageAt, {
                                                addSuffix: false,
                                            })}
                                        </span>
                                    </div>
                                    <p
                                        className={cn(
                                            "mt-0.5 truncate text-[12px]",
                                            conv.unreadCountAdmin > 0
                                                ? "font-medium text-[var(--s-text2)]"
                                                : "text-[var(--s-muted)]"
                                        )}
                                    >
                                        {conv.lastMessageBy === "admin" && "You: "}
                                        {conv.lastMessage}
                                    </p>
                                    {userPresence && (
                                        <div className="mt-1">
                                            <PresenceIndicator
                                                isOnline={userPresence.isOnline}
                                                lastSeen={
                                                    typeof userPresence.lastSeen === "number"
                                                        ? new Date(userPresence.lastSeen).toISOString()
                                                        : null
                                                }
                                                size="sm"
                                            />
                                        </div>
                                    )}
                                </div>
                                {conv.unreadCountAdmin > 0 && (
                                    <span className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--s-invert)] px-1.5 text-[11px] font-medium text-white">
                                        {conv.unreadCountAdmin}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function StatTile({
    label,
    value,
    accent,
}: {
    label: string;
    value: number;
    accent?: "green" | "coral";
}) {
    const color =
        accent === "green"
            ? "text-green-600"
            : accent === "coral"
                ? "text-[#EE5D4A]"
                : "text-[var(--s-text)]";
    return (
        <div className="rounded-2xl bg-[var(--s-soft)] px-3 py-2.5 text-center">
            <p className={cn("text-[18px] font-bold leading-none", color)}>{value}</p>
            <p className="mt-1 text-[11px] text-[var(--s-muted)]">{label}</p>
        </div>
    );
}
