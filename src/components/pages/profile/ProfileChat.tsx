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
import {
    createConversation,
    editMessage,
    FirebaseConversation,
    FirebaseMessage,
    FirebasePresence,
    markMessagesAsRead,
    sendMessage,
    setTypingStatus,
    subscribeToMessages,
    subscribeToPresence,
    subscribeToTyping,
    subscribeToUserConversation,
    updateConversation
} from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface Message extends FirebaseMessage {
    id: string;
}

interface Conversation extends FirebaseConversation {
    id: string;
}

export default function ProfileChat() {
    const { user } = useAuth();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [adminPresence, setAdminPresence] = useState<FirebasePresence | null>(null);
    const [adminUserId, setAdminUserId] = useState<string | null>(null);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(
        null
    );
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [loading, setLoading] = useState(true);
    const [historyModal, setHistoryModal] = useState<{
        isOpen: boolean;
        content: string;
        history: { content: string; editedAt: string }[];
    }>({ isOpen: false, content: "", history: [] });

    // Subscribe to user's conversation
    useEffect(() => {
        if (!user?.id) return;

        const unsubscribe = subscribeToUserConversation(user.id, (conv) => {
            setConversation(conv);
            setLoading(false);
        });

        return unsubscribe;
    }, [user?.id]);

    // Subscribe to messages when conversation exists
    useEffect(() => {
        if (!conversation?.id) {
            setMessages([]);
            return;
        }

        const unsubscribe = subscribeToMessages(conversation.id, setMessages);
        return unsubscribe;
    }, [conversation?.id]);

    // Find admin user ID and subscribe to their presence
    useEffect(() => {
        // We need to find the admin's presence
        // For simplicity, we'll look for presence entries and find the admin
        // In a real app, you might store the admin ID in a config
        const findAdminPresence = async () => {
            // Try to get admin presence by checking conversations
            // The admin is whoever responds to user messages
            if (messages.length > 0) {
                const adminMessage = messages.find((m) => m.senderType === "admin");
                if (adminMessage) {
                    setAdminUserId(adminMessage.senderId);
                }
            }
        };

        findAdminPresence();
    }, [messages]);

    // Subscribe to admin presence
    useEffect(() => {
        if (!adminUserId) return;

        const unsubscribe = subscribeToPresence(adminUserId, setAdminPresence);
        return unsubscribe;
    }, [adminUserId]);

    // Subscribe to typing status
    useEffect(() => {
        if (!conversation?.id || !user?.id) return;

        const unsubscribe = subscribeToTyping(conversation.id, user.id, setIsAdminTyping);
        return unsubscribe;
    }, [conversation?.id, user?.id]);

    // Mark messages as read when viewing
    useEffect(() => {
        if (conversation?.id && messages.length > 0) {
            markMessagesAsRead(conversation.id, "admin");
            updateConversation(conversation.id, { unreadCountUser: 0 });
        }
    }, [conversation?.id, messages]);

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
    }, [messages, isAdminTyping, shouldScrollToBottom]);

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
            if (!conversation?.id || !user?.id) return;
            try {
                await setTypingStatus(conversation.id, user.id, isTyping);
            } catch {
                // Ignore errors
            }
        },
        [conversation?.id, user?.id]
    );

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!user?.id) return;

            try {
                let convId = conversation?.id;

                // Create conversation if it doesn't exist
                if (!convId) {
                    convId = await createConversation({
                        participantId: user.id,
                        participantName: user.name || "Anonymous",
                        participantEmail: user.email || "",
                        participantImage: user.image || "",
                        lastMessage: content.substring(0, 100),
                        lastMessageAt: Date.now(),
                        lastMessageBy: "user",
                        unreadCountUser: 0,
                        unreadCountAdmin: 1,
                        isActive: true,
                        createdAt: Date.now(),
                    });
                }

                await sendMessage({
                    conversationId: convId,
                    senderId: user.id,
                    senderType: "user",
                    senderName: user.name || "Anonymous",
                    senderImage: user.image || "",
                    content,
                    isRead: false,
                    isEdited: false,
                    isDeleted: false,
                });

                // Update conversation metadata
                if (conversation) {
                    await updateConversation(convId, {
                        lastMessage: content.substring(0, 100),
                        lastMessageAt: Date.now(),
                        lastMessageBy: "user",
                        unreadCountAdmin: (conversation.unreadCountAdmin || 0) + 1,
                    });
                }

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
            if (!conversation?.id) return;

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
        [conversation?.id, messages]
    );

    const canEditMessage = (message: Message) => {
        if (message.senderType !== "user") return false;
        const createdAt = typeof message.createdAt === "number" ? message.createdAt : Date.now();
        const messageAge = Date.now() - createdAt;
        const tenMinutes = 10 * 60 * 1000;
        return messageAge <= tenMinutes;
    };

    const shouldShowReadStatus = (message: Message) => {
        if (message.senderType === "user") {
            return !adminPresence?.hideLastSeen;
        }
        return true;
    };

    const presenceLastSeen =
        adminPresence && typeof adminPresence.lastSeen === "number"
            ? new Date(adminPresence.lastSeen).toISOString()
            : null;

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
                                lastSeen={presenceLastSeen}
                                hideLastSeen={adminPresence.hideLastSeen}
                                size="sm"
                            />
                        )}
                        {adminPresence?.hideLastSeen && (
                            <span className="text-xs text-muted-foreground">Admin</span>
                        )}
                        {!adminPresence && (
                            <span className="text-xs text-muted-foreground">Admin</span>
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
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-3/4" />
                        ))}
                    </div>
                ) : messages.length === 0 ? (
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
                                            isOwn={msg.senderType === "user"}
                                            isRead={shouldShowReadStatus(msg) ? msg.isRead : false}
                                            readAt={readAt}
                                            isEdited={msg.isEdited}
                                            editHistory={msg.editHistory?.map((h) => ({
                                                content: h.content,
                                                editedAt: new Date(h.editedAt).toISOString(),
                                            }))}
                                            createdAt={createdAt}
                                            canEdit={canEditMessage(msg)}
                                            isAdmin={false}
                                            onStartEdit={(id, content) =>
                                                setEditingMessage({ id, content })
                                            }
                                            showReadStatus={shouldShowReadStatus(msg)}
                                        />
                                    );
                                })}
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
