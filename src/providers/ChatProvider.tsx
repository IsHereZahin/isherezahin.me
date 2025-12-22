"use client";

import { chat } from "@/lib/api";
import { ChatContext } from "@/lib/contexts";
import { useAuth } from "@/lib/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { user, isAdmin } = useAuth();
    const queryClient = useQueryClient();

    // Unread count state
    const [unreadCount, setUnreadCount] = useState(0);

    // Status visibility state (admin only)
    const [globalHideStatus, setGlobalHideStatus] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    // ============ PRESENCE TRACKING (for ALL users including admin) ============
    useEffect(() => {
        if (!user) return;

        const updatePresence = async (isOnline: boolean) => {
            try {
                await chat.updatePresence(isOnline);
            } catch {
                // Silently fail
            }
        };

        // Set online immediately
        updatePresence(true);

        // Heartbeat every 15 seconds for more responsive tracking
        const interval = setInterval(() => updatePresence(true), 15000);

        const handleVisibilityChange = () => {
            updatePresence(!document.hidden);
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const handleBeforeUnload = () => {
            // Use raw fetch with keepalive for beforeunload
            fetch("/api/chat/presence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isOnline: false }),
                keepalive: true,
            });
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Handle page hide (mobile browsers)
        const handlePageHide = () => {
            fetch("/api/chat/presence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isOnline: false }),
                keepalive: true,
            });
        };
        window.addEventListener("pagehide", handlePageHide);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("pagehide", handlePageHide);
            updatePresence(false);
        };
    }, [user]);

    // ============ UNREAD COUNT ============
    const fetchUnreadCount = useCallback(async () => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        try {
            const data = await chat.getConversations();

            if (isAdmin) {
                const total =
                    data.conversations?.reduce(
                        (sum: number, conv: { unreadCountAdmin?: number }) =>
                            sum + (conv.unreadCountAdmin || 0),
                        0
                    ) || 0;
                setUnreadCount(total);
            } else {
                setUnreadCount(data.conversation?.unreadCountUser || 0);
            }
        } catch {
            setUnreadCount(0);
        }
    }, [user, isAdmin]);

    const refreshUnreadCount = useCallback(async () => {
        await fetchUnreadCount();
        queryClient.invalidateQueries({ queryKey: ["user-unread-count"] });
        queryClient.invalidateQueries({ queryKey: ["admin-unread-total"] });
        queryClient.invalidateQueries({ queryKey: ["user-chat-unread"] });
    }, [fetchUnreadCount, queryClient]);

    useEffect(() => {
        if (!user) return;

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 3000);

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchUnreadCount();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [user, fetchUnreadCount]);

    // ============ STATUS VISIBILITY (admin only) ============
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await chat.getActiveUsers();
                if (data.presence?.hideLastSeen !== undefined) {
                    setGlobalHideStatus(data.presence.hideLastSeen);
                }
            } catch (error) {
                console.error("Failed to fetch presence settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const toggleGlobalStatus = useCallback(async () => {
        if (isStatusLoading) return;

        setIsStatusLoading(true);
        try {
            await chat.toggleLastSeenVisibility(!globalHideStatus);
            setGlobalHideStatus(!globalHideStatus);
            toast.success(
                !globalHideStatus
                    ? "Users can no longer see your active or read status"
                    : "Users can now see your active and read status"
            );
        } catch {
            toast.error("Failed to update setting");
        } finally {
            setIsStatusLoading(false);
        }
    }, [globalHideStatus, isStatusLoading]);

    return (
        <ChatContext.Provider
            value={{
                unreadCount,
                refreshUnreadCount,
                globalHideStatus,
                isStatusLoading,
                toggleGlobalStatus,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}