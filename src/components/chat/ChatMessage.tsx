"use client";

import { BlurImage } from "@/components/ui";
import { parseMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock, Edit2, History } from "lucide-react";

interface EditHistory {
    content: string;
    editedAt: string;
}

interface ChatMessageProps {
    id: string;
    content: string;
    senderName: string;
    senderImage?: string;
    senderType: "user" | "admin";
    isOwn: boolean;
    isRead: boolean;
    readAt?: string;
    isEdited: boolean;
    editHistory?: EditHistory[];
    createdAt: string;
    canEdit: boolean;
    isAdmin: boolean;
    showReadStatus?: boolean;
    onStartEdit?: (messageId: string, content: string) => void;
    onViewHistory?: (messageId: string) => void;
}

export default function ChatMessage({
    id,
    content,
    senderName,
    senderImage,
    isOwn,
    isRead,
    isEdited,
    createdAt,
    canEdit,
    isAdmin,
    showReadStatus = true,
    onStartEdit,
    onViewHistory,
}: ChatMessageProps) {
    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={cn("flex gap-2 mb-4", isOwn ? "flex-row-reverse" : "flex-row")}>
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 mt-1">
                <BlurImage
                    src={senderImage || "/default-avatar.png"}
                    alt={senderName}
                    width={36}
                    height={36}
                    className="w-full h-full"
                    imageClassName="rounded-full"
                />
            </div>
            <div className={cn("max-w-[75%] min-w-[100px]", isOwn ? "items-end" : "items-start")}>
                <div
                    className={cn(
                        "rounded-2xl px-4 py-2.5 relative group",
                        isOwn
                            ? "bg-primary text-primary-foreground rounded-tr-md"
                            : "bg-muted rounded-tl-md"
                    )}
                >
                    <div
                        className="text-sm leading-relaxed break-words [&_a]:underline [&_a:hover]:no-underline [&_pre]:my-2 [&_code]:text-[0.85em]"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                    />
                    {(canEdit || (isAdmin && isEdited)) && (
                        <div
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
                                isOwn ? "-left-14" : "-right-14"
                            )}
                        >
                            {canEdit && (
                                <button
                                    onClick={() => onStartEdit?.(id, content)}
                                    className="p-1.5 rounded-full bg-background border border-border shadow-sm hover:bg-muted transition-colors"
                                    title="Edit message"
                                >
                                    <Edit2 className="h-3 w-3 text-muted-foreground" />
                                </button>
                            )}
                            {isAdmin && isEdited && (
                                <button
                                    onClick={() => onViewHistory?.(id)}
                                    className="p-1.5 rounded-full bg-background border border-border shadow-sm hover:bg-muted transition-colors"
                                    title="View edit history"
                                >
                                    <History className="h-3 w-3 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        "flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground",
                        isOwn ? "justify-end" : "justify-start"
                    )}
                >
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(createdAt)}</span>
                    {isEdited && (
                        <span className="text-muted-foreground/70">• edited</span>
                    )}
                    {isOwn && showReadStatus && (
                        <span className="ml-0.5">
                            {isRead ? (
                                <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                            ) : (
                                <Check className="h-3.5 w-3.5" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
