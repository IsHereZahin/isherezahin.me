"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface PresenceIndicatorProps {
    isOnline: boolean;
    lastSeen?: string | null;
    hideLastSeen?: boolean;
    showText?: boolean;
    size?: "sm" | "md";
}

export default function PresenceIndicator({
    isOnline,
    lastSeen,
    hideLastSeen,
    showText = true,
    size = "md",
}: PresenceIndicatorProps) {
    const dotSize = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";

    const getLastSeenText = () => {
        if (isOnline) return "Active";
        if (hideLastSeen || !lastSeen) return "Offline";
        return `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`;
    };

    return (
        <div className="flex items-center gap-1.5">
            <span
                className={cn(
                    "rounded-full",
                    dotSize,
                    isOnline ? "bg-green-500" : "bg-gray-400"
                )}
            />
            {showText && (
                <span className="text-xs text-muted-foreground">
                    {getLastSeenText()}
                </span>
            )}
        </div>
    );
}
