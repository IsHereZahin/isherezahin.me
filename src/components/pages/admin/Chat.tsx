"use client";

import { chat } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useChatStatus } from "@/lib/hooks/useChat";
import { Loader2, MessageCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatView from "./ChatView";

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
}

function AdminChatContent() {
    const { user } = useAuth();
    const { globalHideStatus, isLoading, toggleGlobalStatus } = useChatStatus();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    // Update presence heartbeat
    useEffect(() => {
        if (!user) return;

        const updatePresence = async () => {
            try {
                await chat.updatePresence(true);
            } catch (error) {
                console.error("Failed to update presence:", error);
            }
        };

        updatePresence();
        const interval = setInterval(updatePresence, 15000);

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

    return (
        <div className="border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                        <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Live Chat</h3>
                        <p className="text-xs text-muted-foreground">
                            Manage conversations with users
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Chat Settings"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                    {showSettings && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowSettings(false)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-80 rounded-lg border border-border bg-card shadow-lg z-20">
                                <div className="p-4">
                                    <h4 className="font-medium text-sm mb-4">Chat Settings</h4>

                                    {/* Status Visibility Toggle - Newsletter style */}
                                    <div className="border border-border rounded-lg p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm">
                                                    User can see your active and read status
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Show online status and message read receipts to users
                                                </p>
                                            </div>
                                            <button
                                                onClick={toggleGlobalStatus}
                                                disabled={isLoading}
                                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${!globalHideStatus
                                                    ? "bg-green-500"
                                                    : "bg-gray-300 dark:bg-gray-600"
                                                    } disabled:opacity-50`}
                                            >
                                                {isLoading ? (
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                                    </span>
                                                ) : (
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${!globalHideStatus ? "translate-x-6" : "translate-x-1"
                                                            }`}
                                                    />
                                                )}
                                            </button>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <p className="text-xs text-muted-foreground">
                                                {!globalHideStatus ? (
                                                    <span className="text-green-600 dark:text-green-400">
                                                        ✓ Users can see when you&apos;re online and when
                                                        you&apos;ve read their messages
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 dark:text-amber-400">
                                                        ⚠ Your online status and read receipts are hidden from
                                                        users
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex h-[600px]">
                {/* Sidebar - Conversation List */}
                <div
                    className={`w-full md:w-80 border-r border-border overflow-y-auto p-4 ${selectedConversation ? "hidden md:block" : ""
                        }`}
                >
                    <ChatList
                        selectedConversationId={selectedConversation?._id}
                        onSelectConversation={setSelectedConversation}
                    />
                </div>

                {/* Main - Chat View */}
                <div className={`flex-1 ${selectedConversation ? "" : "hidden md:flex"}`}>
                    {selectedConversation ? (
                        <ChatView
                            conversation={selectedConversation}
                            onBack={() => setSelectedConversation(null)}
                            onDelete={() => setSelectedConversation(null)}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <MessageCircle className="h-16 w-16 mb-4 opacity-30" />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminChat() {
    return <AdminChatContent />;
}
