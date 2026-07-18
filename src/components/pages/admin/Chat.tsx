"use client";

import { FirebaseConversation, setupPresenceWithDisconnect } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useChatStatus } from "@/lib/hooks/useChat";
import { Loader2, MessageCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatView from "./ChatView";

interface Conversation extends FirebaseConversation {
    id: string;
}

function AdminChatContent() {
    const { user } = useAuth();
    const { globalHideStatus, isLoading, toggleGlobalStatus } = useChatStatus();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    // Setup presence with Firebase (handles disconnect automatically)
    useEffect(() => {
        if (!user?.id) return;
        const cleanup = setupPresenceWithDisconnect(user.id);
        return cleanup;
    }, [user?.id]);

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex min-h-0 flex-1">
                {/* Sidebar — conversation list */}
                <div
                    className={`flex w-full flex-col border-r border-[var(--s-border)] md:w-80 ${selectedConversation ? "hidden md:flex" : "flex"}`}
                >
                    {/* Sidebar header + settings */}
                    <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-[var(--s-border)] p-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4C63D]/15">
                                <MessageCircle className="h-[18px] w-[18px] text-[var(--s-text)]" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-[var(--s-text)]">Conversations</h3>
                        </div>
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--s-text2)] transition-colors hover:bg-[var(--s-soft)]"
                                title="Chat Settings"
                                aria-label="Chat Settings"
                            >
                                <Settings className="h-4 w-4" />
                            </button>
                            {showSettings && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowSettings(false)}
                                    />
                                    <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-2xl border border-[var(--s-border)] bg-[var(--s-card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                        <h4 className="mb-3 text-[14px] font-semibold text-[var(--s-text)]">Chat Settings</h4>

                                        {/* Status Visibility Toggle */}
                                        <div className="rounded-2xl border border-[var(--s-border)] p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-medium text-[var(--s-text)]">
                                                        Show active &amp; read status
                                                    </p>
                                                    <p className="mt-0.5 text-[12px] text-[var(--s-muted)]">
                                                        Let users see your online status and read receipts
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={toggleGlobalStatus}
                                                    disabled={isLoading}
                                                    aria-pressed={!globalHideStatus}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--s-text)]/30 focus:ring-offset-2 ${!globalHideStatus
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
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-[var(--s-card)] shadow-md transition-all duration-300 ease-in-out ${!globalHideStatus
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                                }`}
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                            <div
                                                className={`mt-3 flex items-start gap-1.5 rounded-xl px-3 py-2 text-[12px] ${!globalHideStatus
                                                    ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                                    : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                                    }`}
                                            >
                                                <span className="mt-px">{!globalHideStatus ? "✓" : "⚠"}</span>
                                                <span>
                                                    {!globalHideStatus
                                                        ? "Users can see when you're online and when you've read their messages"
                                                        : "Your online status and read receipts are hidden from users"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="pretty-scroll min-h-0 flex-1 overflow-y-auto p-4">
                        <ChatList
                            selectedConversationId={selectedConversation?.id}
                            onSelectConversation={setSelectedConversation}
                        />
                    </div>
                </div>

                {/* Main — chat view */}
                <div className={`flex-1 ${selectedConversation ? "" : "hidden md:flex"}`}>
                    {selectedConversation ? (
                        <ChatView
                            conversation={selectedConversation}
                            onBack={() => setSelectedConversation(null)}
                            onDelete={() => setSelectedConversation(null)}
                        />
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                                <MessageCircle className="h-8 w-8 text-[var(--s-faint)]" />
                            </div>
                            <p className="text-[15px] font-semibold text-[var(--s-text)]">No conversation selected</p>
                            <p className="mt-1 text-[13px] text-[var(--s-muted)]">
                                Choose a conversation from the list to start chatting
                            </p>
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
