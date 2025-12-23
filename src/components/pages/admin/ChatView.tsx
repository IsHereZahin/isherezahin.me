"use client";

import {
    ChatInput,
    ChatMessage,
    DateDivider,
    EditHistoryModal,
    PresenceIndicator,
    TypingIndicator,
} from "@/components/chat";
import { BlurImage, ConfirmDialog } from "@/components/ui";
import {
    deleteConversationPermanently,
    editMessage,
    FirebaseConversation,
    FirebaseMessage,
    FirebasePresence,
    getMessage,
    markMessagesAsRead,
    sendMessage,
    setTypingStatus,
    subscribeToMessages,
    subscribeToPresence,
    subscribeToTyping,
    updateConversation
} from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { format } from "date-fns";
import { ArrowLeft, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface Message extends FirebaseMessage {
    id: string;
}

interface Conversation extends FirebaseConversation {
    id: string;
}

interface ChatViewProps {
    conversation: Conversation;
    onBack: () => void;
    onDelete: () => void;
}

export default function ChatView({ conversation, onBack, onDelete }: ChatViewProps) {
    const { user } = useAuth();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [presence, setPresence] = useState<FirebasePresence | null>(null);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [loading, setLoading] = useState(true);
    const [historyModal, setHistoryModal] = useState<{
        isOpen: boolean;
        content: string;
        history: { content: string; editedAt: string }[];
    }>({ isOpen: false, content: "", history: [] });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Subscribe to messages (real-time)
    useEffect(() => {
        const unsubscribe = subscribeToMessages(conversation.id, (msgs) => {
            setMessages(msgs);
            setLoading(false);
        });

        return unsubscribe;
    }, [conversation.id]);

    // Subscribe to participant's presence
    useEffect(() => {
        const unsubscribe = subscribeToPresence(conversation.participantId, setPresence);
        return unsubscribe;
    }, [conversation.participantId]);

    // Subscribe to typing status
    useEffect(() => {
        if (!user?.id) return;
        const unsubscribe = subscribeToTyping(conversation.id, user.id, setIsUserTyping);
        return unsubscribe;
    }, [conversation.id, user?.id]);

    // Mark messages as read when viewing
    useEffect(() => {
        if (messages.length > 0) {
            markMessagesAsRead(conversation.id, "user");
            updateConversation(conversation.id, { unreadCountAdmin: 0 });
        }
    }, [conversation.id, messages]);

    // Group messages by date
    const groupedMessages = useMemo(() => {
        const groups: { date: string; messages: Message[] }[] = [];
        let currentDate = "";

        for (const msg of messages) {
            const createdAt = typeof msg.createdAt === "number" ? msg.createdAt : Date.now();
            const msgDate = format(new Date(createdAt), "yyyy-MM-dd");
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                groups.push({ date: new Date(createdAt).toISOString(), messages: [msg] });
            } else {
                groups[groups.length - 1].messages.push(msg);
            }
        }

        return groups;
    }, [messages]);

    // Scroll to bottom
    useEffect(() => {
        if (shouldScrollToBottom && messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isUserTyping, shouldScrollToBottom]);

    // Track scroll position
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShouldScrollToBottom(isAtBottom);
    }, []);

    const handleTyping = useCallback(
        async (isTyping: boolean) => {
            if (!user?.id) return;
            try {
                await setTypingStatus(conversation.id, user.id, isTyping);
            } catch {
                // Ignore errors
            }
        },
        [conversation.id, user?.id]
    );

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!user?.id) return;

            try {
                await sendMessage({
                    conversationId: conversation.id,
                    senderId: user.id,
                    senderType: "admin",
                    senderName: user.name || "Admin",
                    senderImage: user.image || "",
                    content,
                    isRead: false,
                    isEdited: false,
                    isDeleted: false,
                });

                // Update conversation metadata
                await updateConversation(conversation.id, {
                    lastMessage: content.substring(0, 100),
                    lastMessageAt: Date.now(),
                    lastMessageBy: "admin",
                    unreadCountUser: (conversation.unreadCountUser || 0) + 1,
                });

                setShouldScrollToBottom(true);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to send message");
                throw error;
            }
        },
        [conversation, user]
    );

    const handleSaveEdit = useCallback(
        async (messageId: string, content: string) => {
            const originalMessage = messages.find((m) => m.id === messageId);
            if (!originalMessage) return;

            try {
                await editMessage(conversation.id, messageId, content, originalMessage.content);
                toast.success("Message updated");
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to edit message");
                throw error;
            }
        },
        [conversation.id, messages]
    );

    const handleViewHistory = useCallback(
        async (messageId: string) => {
            try {
                const msg = await getMessage(conversation.id, messageId);
                if (msg) {
                    setHistoryModal({
                        isOpen: true,
                        content: msg.content,
                        history:
                            msg.editHistory?.map((h) => ({
                                content: h.content,
                                editedAt: new Date(h.editedAt).toISOString(),
                            })) || [],
                    });
                }
            } catch {
                toast.error("Failed to load edit history");
            }
        },
        [conversation.id]
    );

    const handleDeleteConversation = async () => {
        try {
            await deleteConversationPermanently(conversation.id);
            toast.success("Conversation deleted permanently");
            onDelete();
        } catch {
            toast.error("Failed to delete conversation");
        }
    };

    const presenceLastSeen =
        presence && typeof presence.lastSeen === "number"
            ? new Date(presence.lastSeen).toISOString()
            : null;

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
                                lastSeen={presenceLastSeen}
                                size="sm"
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
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
                                            setDeleteDialogOpen(true);
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
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {groupedMessages.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                <DateDivider date={group.date} />
                                {group.messages.map((msg) => {
                                    const createdAt =
                                        typeof msg.createdAt === "number"
                                            ? new Date(msg.createdAt).toISOString()
                                            : new Date().toISOString();
                                    const readAt =
                                        msg.readAt && typeof msg.readAt === "number"
                                            ? new Date(msg.readAt).toISOString()
                                            : undefined;

                                    return (
                                        <ChatMessage
                                            key={msg.id}
                                            id={msg.id}
                                            content={msg.content}
                                            senderName={msg.senderName}
                                            senderImage={msg.senderImage}
                                            senderType={msg.senderType}
                                            isOwn={msg.senderType === "admin"}
                                            isRead={msg.isRead}
                                            readAt={readAt}
                                            isEdited={msg.isEdited}
                                            editHistory={msg.editHistory?.map((h) => ({
                                                content: h.content,
                                                editedAt: new Date(h.editedAt).toISOString(),
                                            }))}
                                            createdAt={createdAt}
                                            canEdit={msg.senderType === "admin"}
                                            isAdmin={true}
                                            onStartEdit={(id, content) =>
                                                setEditingMessage({ id, content })
                                            }
                                            onViewHistory={handleViewHistory}
                                        />
                                    );
                                })}
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

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Conversation"
                description="Are you sure you want to permanently delete this conversation? All messages will be deleted and this action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleDeleteConversation}
            />
        </div>
    );
}
