"use client";

import MotionPopup from "@/components/motion/MotionPopup";
import { useAuth } from "@/lib/hooks/useAuth";
import { useChatUnread } from "@/lib/hooks/useChat";
import { LogOut, MessageCircle, Settings, User } from "lucide-react";
import Link from "next/link";

export default function ProfileDropdown({ onClose }: { readonly onClose: () => void }) {
    const { user, logout, isAdmin } = useAuth();
    const { unreadCount } = useChatUnread();

    if (!user) return null;

    return (
        <MotionPopup isOpen={true} className="p-2">
            {/* Profile Info */}
            <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={onClose}
            >
                <User className="h-4 w-4" />
                <div>
                    <p className="text-xs sm:text-sm font-medium text-foreground">{user.name || user.email}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{user.email}</p>
                </div>
            </Link>

            {/* Chat Option */}
            <Link
                href={isAdmin ? "/admin/chat" : "/profile/chat"}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted mt-1"
                onClick={onClose}
            >
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat
                </div>
                {unreadCount > 0 && (
                    <span className="h-5 min-w-5 px-1.5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </Link>

            {/* Admin Route */}
            {isAdmin && (
                <Link
                    href="/admin"
                    className="items-center gap-2 px-3 py-2 rounded-md hover:bg-muted mt-1 flex"
                    onClick={onClose}
                >
                    <Settings className="h-4 w-4" />
                    Admin
                </Link>
            )}

            {/* Logout Button */}
            <button
                onClick={() => {
                    logout();
                    onClose();
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-destructive rounded-md hover:bg-muted cursor-pointer mt-1"
            >
                <LogOut className="h-4 w-4" />
                Logout
            </button>
        </MotionPopup>
    );
}
