"use client";

import {
    ChatInput,
    ChatMessage,
    DateDivider,
    EditHistoryModal,
    PresenceIndicator,
    TypingIndicator,
} from "@/components/chat";
import { BlurImage, Skeleton } from "@/components/ui";
import { chat } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useChatUnread } from "@/lib/hooks/useChat";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, ChevronUp, Loader2, MoreVertical, RefreshCw, Trash2 } from "lucide-react";
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
    participantId: string;
    participantName: string;
    participantEmail: string;
    participantImage?: string;
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

interface ChatViewProps {
    conversation: Conversation;
    onBack: () => void;
    onDelete: () => void;
}

export default function ChatView({ conversation, onBack, onDelete }: ChatViewProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { refreshUnreadCount } = useChatUnread();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [historyModal, setHistoryModal] = useState<{
        isOpen: boolean;
        content: string;
        history: { content: string; editedAt: string }[];
    }>({ isOpen: false, content: "", history: [] });

    // Fetch messages with infinite query
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery<MessagesResponse>({
        queryKey: ["admin-chat-messages", conversation._id],
        queryFn: async ({ pageParam }) => {
            return await chat.getMessages(conversation._id, pageParam as string | undefined);
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: undefined as string | undefined,
        refetchInterval: 3000,
    });

    // Flatten messages from all pages
    const allMessages = useMemo(() => {
        if (!data?.pages) return [];
        const messages: Message[] = [];
        for (let i = data.pages.length - 1; i >= 0; i--) {
            messages.push(...(data.pages[i].messages || []));
        }
        return messages;
    }, [data]);

    const presence: Presence | null = data?.pages[0]?.presence || null;

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
        const checkTyping = async () => {
            try {
                const data = await chat.getTypingStatus(conversation._id);
                setIsUserTyping(data.isTyping);
            } catch {
                // Ignore errors
            }
        };

        const interval = setInterval(checkTyping, 2000);
        checkTyping();
        return () => clearInterval(interval);
    }, [conversation._id]);

    // Scroll to bottom
    useEffect(() => {
        if (shouldScrollToBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages, isUserTyping, shouldScrollToBottom]);

    // Track scroll position
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShouldScrollToBottom(isAtBottom);

        if (scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleTyping = useCallback(
        async (isTyping: boolean) => {
            try {
                await chat.setTypingStatus(conversation._id, isTyping);
            } catch {
                // Ignore errors
            }
        },
        [conversation._id]
    );

    const handleSendMessage = useCallback(
        async (message: string) => {
            try {
                await chat.sendMessage(conversation._id, message);
                setShouldScrollToBottom(true);
                refetch();
                queryClient.invalidateQueries({ queryKey: ["admin-chat-conversations"] });
                refreshUnreadCount();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to send message");
                throw error;
            }
        },
        [conversation._id, queryClient, refetch, refreshUnreadCount]
    );

    const handleSaveEdit = useCallback(
        async (messageId: string, content: string) => {
            try {
                await chat.editMessage(conversation._id, messageId, content);
                toast.success("Message updated");
                refetch();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to edit message");
                throw error;
            }
        },
        [conversation._id, refetch]
    );

    const handleViewHistory = useCallback(
        async (messageId: string) => {
            try {
                const data = await chat.getMessage(conversation._id, messageId);
                setHistoryModal({
                    isOpen: true,
                    content: data.message.content,
                    history: data.message.editHistory || [],
                });
            } catch {
                toast.error("Failed to load edit history");
            }
        },
        [conversation._id]
    );

    const handleDeleteConversation = async () => {
        if (!confirm("Are you sure you want to delete this conversation?")) return;

        try {
            await chat.deleteConversation(conversation._id);
            toast.success("Conversation deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-chat-conversations"] });
            onDelete();
        } catch {
            toast.error("Failed to delete conversation");
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <BlurImage
                        src={conversation.participantImage || "/default-avatar.png"}
                        alt={conversation.participantName}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold">{conversation.participantName}</h3>
                        {presence && (
                            <PresenceIndicator
                                isOnline={presence.isOnline}
                                lastSeen={presence.lastSeen}
                                size="sm"
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-20">
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            handleDeleteConversation();
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors rounded-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Conversation
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
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

                {isLoading && !data ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-3/4" />
                        ))}
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
                                        isOwn={msg.senderType === "admin"}
                                        isRead={msg.isRead}
                                        readAt={msg.readAt}
                                        isEdited={msg.isEdited}
                                        editHistory={msg.editHistory}
                                        createdAt={msg.createdAt}
                                        canEdit={msg.senderType === "admin" && msg.senderId === user?.id}
                                        isAdmin={true}
                                        onStartEdit={(id, content) => setEditingMessage({ id, content })}
                                        onViewHistory={handleViewHistory}
                                    />
                                ))}
                            </div>
                        ))}
                        {isUserTyping && <TypingIndicator name={conversation.participantName} />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <ChatInput
                onSend={handleSendMessage}
                onTyping={handleTyping}
                placeholder="Type your reply..."
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
