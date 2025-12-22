// src/lib/hooks/useChat.ts
"use client";

import { ChatContext } from "@/lib/contexts";
import { useContext } from "react";

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within ChatProvider");
    }
    return context;
};

// Convenience hooks
export const useChatUnread = () => {
    const { unreadCount, refreshUnreadCount } = useChat();
    return { unreadCount, refreshUnreadCount };
};

export const useChatStatus = () => {
    const { globalHideStatus, isStatusLoading: isLoading, toggleGlobalStatus } = useChat();
    return { globalHideStatus, isLoading, toggleGlobalStatus };
};
