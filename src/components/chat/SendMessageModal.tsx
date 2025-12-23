"use client";

import { BlurImage, ShadcnButton as Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, MarkdownTextarea } from "@/components/ui";
import {
    createConversation,
    getUserConversation,
    sendMessage,
    updateConversation,
} from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TargetUser {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface SendMessageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** For admin sending to a specific user */
    targetUser?: TargetUser;
    /** Whether to redirect to chat after sending (for user mode) */
    redirectToChat?: boolean;
}

export default function SendMessageModal({
    open,
    onOpenChange,
    targetUser,
    redirectToChat = false,
}: SendMessageModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const isAdminMode = !!targetUser;

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setMessage("");
        }
    }, [open]);

    const handleSend = async () => {
        if (!message.trim() || !user?.id) {
            toast.error("Please enter a message");
            return;
        }

        setSending(true);
        try {
            if (isAdminMode && targetUser) {
                // Admin sending to user
                let conversation = await getUserConversation(targetUser.id);

                if (!conversation) {
                    const conversationId = await createConversation({
                        participantId: targetUser.id,
                        participantName: targetUser.name || "Unknown",
                        participantEmail: targetUser.email,
                        participantImage: targetUser.image,
                        lastMessage: message.trim().substring(0, 100),
                        lastMessageAt: Date.now(),
                        lastMessageBy: "admin",
                        unreadCountUser: 1,
                        unreadCountAdmin: 0,
                        isActive: true,
                        createdAt: Date.now(),
                    });
                    conversation = {
                        id: conversationId,
                        participantId: targetUser.id,
                        participantName: targetUser.name || "Unknown",
                        participantEmail: targetUser.email,
                        participantImage: targetUser.image,
                        unreadCountUser: 1,
                        unreadCountAdmin: 0,
                        isActive: true,
                        createdAt: Date.now(),
                    };
                }

                await sendMessage({
                    conversationId: conversation.id,
                    senderId: user.id,
                    senderType: "admin",
                    senderName: user.name || "Admin",
                    senderImage: user.image || "",
                    content: message.trim(),
                    isRead: false,
                    isEdited: false,
                    isDeleted: false,
                });

                await updateConversation(conversation.id, {
                    lastMessage: message.trim().substring(0, 100),
                    lastMessageAt: Date.now(),
                    lastMessageBy: "admin",
                    unreadCountUser: (conversation.unreadCountUser || 0) + 1,
                    isActive: true,
                });

                toast.success("Message sent!");
            } else {
                // User sending to admin
                let conversation = await getUserConversation(user.id);
                let convId = conversation?.id;

                if (!convId) {
                    convId = await createConversation({
                        participantId: user.id,
                        participantName: user.name || "Anonymous",
                        participantEmail: user.email || "",
                        participantImage: user.image || "",
                        lastMessage: message.trim().substring(0, 100),
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
                    content: message.trim(),
                    isRead: false,
                    isEdited: false,
                    isDeleted: false,
                });

                if (redirectToChat) {
                    toast.success("Message sent! Redirecting to chat...");
                    router.push("/profile/chat");
                } else {
                    toast.success("Message sent!");
                }
            }

            setMessage("");
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        if (!sending) {
            setMessage("");
            onOpenChange(false);
        }
    };

    const handleGoToChat = () => {
        onOpenChange(false);
        router.push("/profile/chat");
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    {isAdminMode && targetUser ? (
                        <DialogTitle className="flex items-center gap-3">
                            <BlurImage
                                src={targetUser.image || "/default-avatar.png"}
                                alt={targetUser.name || "User"}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>
                                <p className="font-medium text-sm">{targetUser.name || "Unknown"}</p>
                                <p className="text-xs text-muted-foreground font-normal">{targetUser.email}</p>
                            </div>
                        </DialogTitle>
                    ) : (
                        <>
                            <DialogTitle>Send a Message</DialogTitle>
                            <DialogDescription>
                                {user?.name ? `Hi ${user.name.split(" ")[0]}, ` : ""}
                                Start a conversation and I&apos;ll get back to you soon.
                            </DialogDescription>
                        </>
                    )}
                </DialogHeader>

                <div className="space-y-3">
                    <MarkdownTextarea
                        value={message}
                        onChange={setMessage}
                        placeholder="Type your message..."
                        rows={4}
                        disabled={sending}
                    />

                    <p className="text-[10px] text-muted-foreground">
                        Supports markdown formatting
                    </p>
                </div>

                <DialogFooter className={isAdminMode ? "" : "flex-col sm:flex-row gap-2"}>
                    {!isAdminMode && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoToChat}
                            disabled={sending}
                            className="gap-2 w-full sm:w-auto"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Go to Chat
                        </Button>
                    )}
                    {isAdminMode && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={sending}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || sending}
                        className="gap-2 w-full sm:w-auto"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                {isAdminMode ? "Send" : "Send & Open Chat"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
