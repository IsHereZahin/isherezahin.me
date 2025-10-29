"use client"

import { useAuth } from "@/lib/hooks/useAuth"
import { getFormatDistanceToNow, getRoleBadge } from "@/utils"

import { MessageCircle, MoreVertical } from "lucide-react"
import { useState } from "react"

import BlurImage from "@/components/ui/BlurImage"
import { Comment } from "@/lib/contexts"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import CommentForm from "./CommentForm"
import MarkdownPreview from "./MarkdownPreview"
import ReactionButton from "./ReactionButton"
import ReplyCard from "./ReplyCard"

interface CommentCardProps {
    comment: Comment
}

export default function CommentCard({ comment }: Readonly<CommentCardProps>) {
    const { user, login } = useAuth()
    const {
        deleteComment,
        toggleReaction,
        toggleExpanded,
        expandedCommentId,
        loadedReplies,
        loadedRepliesLoading,
        hasUserReacted,
    } = useDiscussion()

    const [replyingTo, setReplyingTo] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const isOwner = user?.username === comment.user.login
    const roleBadge = getRoleBadge(comment.author_association, comment.is_owner)
    const thumbsUpCount = comment.reactions["+1"] || 0
    const thumbsDownCount = comment.reactions["-1"] || 0

    const hasThumbsUp = hasUserReacted(comment.reaction_users, "THUMBS_UP")
    const hasThumbsDown = hasUserReacted(comment.reaction_users, "THUMBS_DOWN")
    const isEdited = comment.last_edited_at
    const isExpanded = expandedCommentId === comment.id
    const replies = loadedReplies[comment.id] || []
    const isLoadingReplies = loadedRepliesLoading[comment.id] || false
    const isDeleted = !comment.body?.trim().length

    const replyLabel = comment.reply_count === 1 ? "reply" : "replies"
    const replyButtonText = isExpanded
        ? `Hide ${comment.reply_count} ${replyLabel}`
        : `${comment.reply_count} ${replyLabel}`

    // Extract replies content
    let repliesContent
    if (isLoadingReplies) {
        repliesContent = (
            <div className="animate-pulse space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index + 1} className="ml-4 pl-3">
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 bg-secondary rounded-full" />
                            <div className="flex-1 space-y-1">
                                <div className="h-3 bg-secondary rounded w-3/4" />
                                <div className="h-3 bg-secondary rounded w-1/2" />
                                <div className="h-2 bg-secondary rounded w-1/4 mt-1" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    } else if (replies.length > 0) {
        repliesContent = replies.map((reply) => (
            <ReplyCard
                key={reply.id}
                reply={reply}
                authUsername={user?.username || ""}
                parentCommentId={comment.id}
            />
        ))
    } else {
        repliesContent = (
            <div className="ml-4 pl-3 text-muted-foreground text-sm">No replies yet.</div>
        )
    }

    return (
        <div className="group rounded-xl border border-border/30 p-5 hover:border-border transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                    <a href={comment.user.html_url} target="_blank" rel="noopener noreferrer">
                        <BlurImage
                            src={comment.user.avatar_url}
                            alt={comment.user.login}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                        />
                    </a>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <a
                                href={comment.user.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-foreground hover:text-primary text-sm transition-colors"
                            >
                                {comment.user.login}
                            </a>
                            {comment.author_association === "CONTRIBUTOR" && (
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            )}
                            {roleBadge && (
                                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                                    {roleBadge.label}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                                {getFormatDistanceToNow(new Date(comment.created_at))}
                            </p>
                            {isEdited && comment.last_edited_at && (
                                <span
                                    className="text-xs text-muted-foreground"
                                    title={`Edited ${getFormatDistanceToNow(new Date(comment.last_edited_at))}`}
                                >
                                    • Edited
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-1.5 transition-all"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        deleteComment(comment.id)
                                        setIsMenuOpen(false)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="text-foreground text-sm mb-4 leading-relaxed prose prose-sm max-w-none">
                {isDeleted ? (
                    <span className="text-muted-foreground italic">This message was deleted.</span>
                ) : (
                    <MarkdownPreview content={comment.body} />
                )}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
                <ReactionButton
                    type="up"
                    count={thumbsUpCount}
                    active={hasThumbsUp}
                    onClick={() => toggleReaction(comment.id, "+1", hasThumbsUp, undefined)}
                    disabled={isDeleted || !user}
                />
                <ReactionButton
                    type="down"
                    count={thumbsDownCount}
                    active={hasThumbsDown}
                    onClick={() => toggleReaction(comment.id, "-1", hasThumbsDown, undefined)}
                    disabled={isDeleted || !user}
                />

                <div className="flex-1" />

                {comment.reply_count > 0 && (
                    <button
                        onClick={() => toggleExpanded(comment.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-semibold text-xs">{replyButtonText}</span>
                    </button>
                )}

                <button
                    onClick={user ? () => setReplyingTo(true) : login}
                    className="flex items-center gap-1.5 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-semibold text-xs">Reply</span>
                </button>
            </div>

            {isExpanded && <div className="mt-4 pt-4 space-y-3">{repliesContent}</div>}

            {replyingTo && (
                <CommentForm parentId={comment.id} onCancel={() => setReplyingTo(false)} />
            )}
        </div>
    )
}