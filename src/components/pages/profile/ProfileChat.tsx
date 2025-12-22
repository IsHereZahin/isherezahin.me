"use client";

import {
    ChatInput,
    ChatMessage,
    DateDivider,
    EditHistoryModal,
    PresenceIndicator,
    TypingIndicator,
} from "@/components/chat";
import { Skeleton } from "@/components/ui";
import { chat } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useChatUnread } from "@/lib/hooks/useChat";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronUp, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
    _id: string;
    content: string;
    senderName: string;
    senderImage?: string;
    senderType: "user" | "admin";
    senderId: string;
    isRead: boolean;
    readAt?: string;
    isEdited: boolean;
    editHistory?: { content: string; editedAt: string }[];
    createdAt: string;
}

interface Conversation {
    _id: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCountUser: number;
}

interface Presence {
    isOnline: boolean;
    lastSeen: string | null;
    hideLastSeen: boolean;
}

interface MessagesResponse {
    messages: Message[];
    conversation: Conversation;
    presence: Presence | null;
    hasMore: boolean;
    nextCursor?: string;
}

export default function ProfileChat() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { refreshUnreadCount } = useChatUnread();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [historyModal, setHistoryModal] = useState<{
        isOpen: boolean;
        content: string;
        history: { content: string; editedAt: string }[];
    }>({ isOpen: false, content: "", history: [] });

    // Fetch conversation first
    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const data = await chat.getConversations();
                if (data.conversation?._id) {
                    setConversationId(data.conversation._id);
                }
            } catch {
                // Ignore
            }
        };
        if (user) fetchConversation();
    }, [user]);

    // Fetch messages with infinite query for lazy loading
    const {
        data,
        isLoading: loadingMessages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: refetchMessages,
    } = useInfiniteQuery<MessagesResponse>({
        queryKey: ["user-chat-messages", conversationId],
        queryFn: async ({ pageParam }) => {
            if (!conversationId) throw new Error("No conversation");
            return await chat.getMessages(conversationId, pageParam as string | undefined);
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: undefined as string | undefined,
        enabled: !!conversationId,
        refetchInterval: 5000,
    });

    // Flatten messages from all pages and reverse for correct order
    const allMessages = useMemo(() => {
        if (!data?.pages) return [];
        const messages: Message[] = [];
        // Pages are in reverse order (newest first), so we need to reverse
        for (let i = data.pages.length - 1; i >= 0; i--) {
            messages.push(...(data.pages[i].messages || []));
        }
        return messages;
    }, [data]);

    const adminPresence: Presence | null = data?.pages[0]?.presence || null;

    // Group messages by date
    const groupedMessages = useMemo(() => {
        const groups: { date: string; messages: Message[] }[] = [];
        let currentDate = "";

        for (const msg of allMessages) {
            const msgDate = format(new Date(msg.createdAt), "yyyy-MM-dd");
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                groups.push({ date: msg.createdAt, messages: [msg] });
            } else {
                groups[groups.length - 1].messages.push(msg);
            }
        }

        return groups;
    }, [allMessages]);

    // Poll for typing status
    useEffect(() => {
        if (!conversationId) return;

        const checkTyping = async () => {
            try {
                const data = await chat.getTypingStatus(conversationId);
                setIsAdminTyping(data.isTyping);
            } catch {
                // Ignore errors
            }
        };

        const interval = setInterval(checkTyping, 2000);
        return () => clearInterval(interval);
    }, [conversationId]);

    // Scroll to bottom on new messages (only if already at bottom)
    useEffect(() => {
        if (shouldScrollToBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages, isAdminTyping, shouldScrollToBottom]);

    // Track scroll position
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShouldScrollToBottom(isAtBottom);

        // Load more when scrolled to top
        if (scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Update presence heartbeat
    useEffect(() => {
        if (!user) return;

        const updatePresence = async () => {
            try {
                await chat.updatePresence(true);
            } catch {
                // Ignore errors
            }
        };

        updatePresence();
        const interval = setInterval(updatePresence, 30000);

        return () => {
            clearInterval(interval);
            // Use raw fetch with keepalive for cleanup
            fetch("/api/chat/presence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isOnline: false }),
                keepalive: true,
            }).catch(() => { });
        };
    }, [user]);

    const handleTyping = useCallback(
        async (isTyping: boolean) => {
            if (!conversationId) return;
            try {
                await chat.setTypingStatus(conversationId, isTyping);
            } catch {
                // Ignore errors
            }
        },
        [conversationId]
    );

    const handleSendMessage = useCallback(
        async (message: string) => {
            try {
                const data = await chat.sendMessage(conversationId, message);
                if (!conversationId && data.conversation?._id) {
                    setConversationId(data.conversation._id);
                }

                setShouldScrollToBottom(true);
                refetchMessages();
                refreshUnreadCount();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to send message");
                throw error;
            }
        },
        [conversationId, refetchMessages, refreshUnreadCount]
    );

    const handleSaveEdit = useCallback(
        async (messageId: string, content: string) => {
            if (!conversationId) return;

            try {
                await chat.editMessage(conversationId, messageId, content);
                toast.success("Message updated");
                refetchMessages();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to edit message");
                throw error;
            }
        },
        [conversationId, refetchMessages]
    );

    const canEditMessage = (message: Message) => {
        if (message.senderId !== user?.id) return false;
        const messageAge = Date.now() - new Date(message.createdAt).getTime();
        const tenMinutes = 10 * 60 * 1000;
        return messageAge <= tenMinutes;
    };

    const shouldShowReadStatus = (message: Message) => {
        if (message.senderId === user?.id) {
            return !adminPresence?.hideLastSeen;
        }
        return true;
    };

    return (
        <div className="border border-border rounded-xl overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                        <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Chat with Admin</h3>
                        {adminPresence && !adminPresence.hideLastSeen && (
                            <PresenceIndicator
                                isOnline={adminPresence.isOnline}
                                lastSeen={adminPresence.lastSeen}
                                hideLastSeen={adminPresence.hideLastSeen}
                                size="sm"
                            />
                        )}
                        {adminPresence?.hideLastSeen && (
                            <span className="text-xs text-muted-foreground">Admin</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => refetchMessages()}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-background/50 chat-scrollbar"
            >
                {/* Load more button */}
                {hasNextPage && (
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-full transition-colors disabled:opacity-50"
                        >
                            {isFetchingNextPage ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ChevronUp className="h-4 w-4" />
                            )}
                            Load previous messages
                        </button>
                    </div>
                )}

                {loadingMessages && !data ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-3/4" />
                        ))}
                    </div>
                ) : allMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start a conversation with the admin</p>
                    </div>
                ) : (
                    <>
                        {groupedMessages.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                <DateDivider date={group.date} />
                                {group.messages.map((msg) => (
                                    <ChatMessage
                                        key={msg._id}
                                        id={msg._id}
                                        content={msg.content}
                                        senderName={msg.senderName}
                                        senderImage={msg.senderImage}
                                        senderType={msg.senderType}
                                        isOwn={msg.senderId === user?.id}
                                        isRead={shouldShowReadStatus(msg) ? msg.isRead : false}
                                        readAt={msg.readAt}
                                        isEdited={msg.isEdited}
                                        editHistory={msg.editHistory}
                                        createdAt={msg.createdAt}
                                        canEdit={canEditMessage(msg)}
                                        isAdmin={false}
                                        onStartEdit={(id, content) => setEditingMessage({ id, content })}
                                        showReadStatus={shouldShowReadStatus(msg)}
                                    />
                                ))}
                            </div>
                        ))}
                        {isAdminTyping && <TypingIndicator name="Admin" />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <ChatInput
                onSend={handleSendMessage}
                onTyping={handleTyping}
                placeholder="Type your message..."
                editingMessage={editingMessage}
                onCancelEdit={() => setEditingMessage(null)}
                onSaveEdit={handleSaveEdit}
            />

            <EditHistoryModal
                isOpen={historyModal.isOpen}
                onClose={() => setHistoryModal({ isOpen: false, content: "", history: [] })}
                currentContent={historyModal.content}
                editHistory={historyModal.history}
            />
        </div>
    );
}
