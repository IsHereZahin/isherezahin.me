"use client";

import { ChatContext } from "@/lib/contexts";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Firebase is loaded lazily (dynamic import) inside the effects below so its
// realtime SDK is code-split out of the bundle for anonymous visitors, who
// never reach any of this logic (it all requires a logged-in user).

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { user, isAdmin } = useAuth();

    // Unread count state
    const [unreadCount, setUnreadCount] = useState(0);

    // Status visibility state (admin only)
    const [globalHideStatus, setGlobalHideStatus] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    // ============ PRESENCE TRACKING (Firebase handles disconnect automatically) ============
    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        let active = true;
        let cleanup: (() => void) | undefined;

        // Setup presence with automatic disconnect handling
        import("@/lib/firebase")
            .then(({ setupPresenceWithDisconnect }) => {
                if (active) cleanup = setupPresenceWithDisconnect(userId);
            })
            .catch((error) => console.error("Failed to set up presence:", error));

        return () => {
            active = false;
            cleanup?.();
        };
    }, [user?.id]);

    // ============ UNREAD COUNT (Real-time with Firebase) ============
    useEffect(() => {
        const userId = user?.id;
        if (!userId) {
            setUnreadCount(0);
            return;
        }

        let active = true;
        let unsubscribe: (() => void) | undefined;

        import("@/lib/firebase")
            .then((firebase) => {
                if (!active) return;
                if (isAdmin) {
                    // Admin subscribes to all conversations
                    unsubscribe = firebase.subscribeToConversations((conversations) => {
                        const total = conversations
                            .filter((c) => c.participantId !== userId)
                            .reduce((sum, conv) => sum + (conv.unreadCountAdmin || 0), 0);
                        setUnreadCount(total);
                    });
                } else {
                    // User subscribes to their own conversation
                    unsubscribe = firebase.subscribeToUserConversation(userId, (conversation) => {
                        setUnreadCount(conversation?.unreadCountUser || 0);
                    });
                }
            })
            .catch((error) => console.error("Failed to subscribe to chat updates:", error));

        return () => {
            active = false;
            unsubscribe?.();
        };
    }, [user?.id, isAdmin]);

    const refreshUnreadCount = useCallback(async () => {
        // With Firebase real-time, this is handled automatically
        // Keep this for API compatibility
    }, []);

    // ============ STATUS VISIBILITY (admin only) ============
    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        let active = true;
        const fetchSettings = async () => {
            try {
                const { getPresence } = await import("@/lib/firebase");
                const presence = await getPresence(userId);
                if (active && presence?.hideLastSeen !== undefined) {
                    setGlobalHideStatus(presence.hideLastSeen);
                }
            } catch (error) {
                console.error("Failed to fetch presence settings:", error);
            }
        };
        fetchSettings();

        return () => { active = false; };
    }, [user?.id]);

    const toggleGlobalStatus = useCallback(async () => {
        const userId = user?.id;
        if (isStatusLoading || !userId) return;

        setIsStatusLoading(true);
        try {
            const { updatePresenceSettings } = await import("@/lib/firebase");
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