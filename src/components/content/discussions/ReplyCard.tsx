"use client"

import { MoreVertical } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { getFormatDistanceToNow, getReactionCounts, getRoleBadge } from "@/utils"

import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Reply } from "@/lib/github/types"
import { useAuth } from "@/lib/hooks/useAuth"
import MarkdownPreview from "./MarkdownPreview"
import ReactionButton from "./ReactionButton"

interface ReplyCardProps {
    reply: Reply
    parentCommentId: string
    authUsername: string
}

export default function ReplyCard({ reply, parentCommentId, authUsername }: Readonly<ReplyCardProps>) {
    const { user } = useAuth();
    const { toggleReaction, deleteReply, hasUserReacted } = useDiscussion();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { thumbsUp, thumbsDown } = getReactionCounts(reply.reactions);
    const hasThumbsUp = hasUserReacted(reply.reaction_users, "THUMBS_UP");
    const hasThumbsDown = hasUserReacted(reply.reaction_users, "THUMBS_DOWN");
    const isAuthor = authUsername === reply.user.login;
    const roleBadge = getRoleBadge(reply.author_association, reply.is_owner);

    // Handle delete reply
    const handleDelete = () => {
        deleteReply(parentCommentId, reply.id)
        setShowDeleteDialog(false)
    }

    return (
        <>
            <div className="group rounded-lg p-4 border border-border/30 hover:border-border hover:shadow-feature-card transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                        <a href={reply.user.html_url} target="_blank" rel="noopener noreferrer">
                            <Image
                                src={reply.user.avatar_url || "/placeholder.svg"}
                                alt={reply.user.login}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all"
                            />
                        </a>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <a
                                    href={reply.user.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-foreground hover:text-primary text-xs transition-colors"
                                >
                                    {reply.user.login}
                                </a>

                                {roleBadge && (
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                                        {roleBadge.label}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-muted-foreground">
                                    {getFormatDistanceToNow(new Date(reply.created_at))}
                                </p>

                                {reply.last_edited_at && (
                                    <span
                                        className="text-xs text-muted-foreground"
                                        title={`Edited ${getFormatDistanceToNow(new Date(reply.last_edited_at))}`}
                                    >
                                        • Edited
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {isAuthor && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-1 transition-all"
                                    title="Reply options"
                                    aria-label="Reply options"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="text-foreground text-xs mb-2 leading-relaxed prose prose-sm max-w-none">
                    <MarkdownPreview content={reply.body} />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                    <ReactionButton
                        type="up"
                        count={thumbsUp}
                        active={hasThumbsUp}
                        onClick={() => toggleReaction(reply.id, "+1", hasThumbsUp, true, parentCommentId)}
                        disabled={!user}
                    />

                    <ReactionButton
                        type="down"
                        count={thumbsDown}
                        active={hasThumbsDown}
                        onClick={() => toggleReaction(reply.id, "-1", hasThumbsDown, true, parentCommentId)}
                        disabled={!user}
                    />
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Reply?"
                description="Are you sure you want to delete this reply? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    )
}
