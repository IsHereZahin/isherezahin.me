"use client";

import { ChatContext } from "@/lib/contexts";
import {
    getPresence,
    setupPresenceWithDisconnect,
    subscribeToConversations,
    subscribeToUserConversation,
    updatePresenceSettings
} from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { user, isAdmin } = useAuth();

    // Unread count state
    const [unreadCount, setUnreadCount] = useState(0);

    // Status visibility state (admin only)
    const [globalHideStatus, setGlobalHideStatus] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    // ============ PRESENCE TRACKING (Firebase handles disconnect automatically) ============
    useEffect(() => {
        if (!user?.id) return;

        // Setup presence with automatic disconnect handling
        const cleanup = setupPresenceWithDisconnect(user.id);

        return cleanup;
    }, [user?.id]);

    // ============ UNREAD COUNT (Real-time with Firebase) ============
    useEffect(() => {
        if (!user?.id) {
            setUnreadCount(0);
            return;
        }

        try {
            if (isAdmin) {
                // Admin subscribes to all conversations
                const unsubscribe = subscribeToConversations((conversations) => {
                    const total = conversations
                        .filter((c) => c.participantId !== user.id)
                        .reduce((sum, conv) => sum + (conv.unreadCountAdmin || 0), 0);
                    setUnreadCount(total);
                });
                return unsubscribe;
            } else {
                // User subscribes to their own conversation
                const unsubscribe = subscribeToUserConversation(user.id, (conversation) => {
                    setUnreadCount(conversation?.unreadCountUser || 0);
                });
                return unsubscribe;
            }
        } catch (error) {
            console.error("Failed to subscribe to chat updates:", error);
        }
    }, [user?.id, isAdmin]);

    const refreshUnreadCount = useCallback(async () => {
        // With Firebase real-time, this is handled automatically
        // Keep this for API compatibility
    }, []);

    // ============ STATUS VISIBILITY (admin only) ============
    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const fetchSettings = async () => {
            try {
                const presence = await getPresence(userId);
                if (presence?.hideLastSeen !== undefined) {
                    setGlobalHideStatus(presence.hideLastSeen);
                }
            } catch (error) {
                console.error("Failed to fetch presence settings:", error);
            }
        };
        fetchSettings();
    }, [user?.id]);

    const toggleGlobalStatus = useCallback(async () => {
        const userId = user?.id;
        if (isStatusLoading || !userId) return;

        setIsStatusLoading(true);
        try {
            await updatePresenceSettings(userId, !globalHideStatus);
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
    }, [globalHideStatus, isStatusLoading, user?.id]);

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