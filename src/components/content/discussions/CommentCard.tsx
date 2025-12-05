"use client";

import type { Comment } from "@/lib/github/types";
import { MessageCircle, MoreVertical } from "lucide-react";
import { useState } from "react";

import { getReactionCount, isCommentDeleted, isCommentEdited } from "@/lib/github/helpers";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDiscussion } from "@/lib/hooks/useDiscussion";
import { getFormatDistanceToNow, getRoleBadge } from "@/utils";

import {
    BlurImage,
    ConfirmDialog,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    SingleCommentLoading,
} from "@/components/ui";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import MarkdownPreview from "./MarkdownPreview";
import ReactionButton from "./ReactionButton";
import ReplyCard from "./ReplyCard";

interface CommentCardProps {
    comment: Comment;
}

export default function CommentCard({ comment }: Readonly<CommentCardProps>) {
    const { user, login } = useAuth();
    const {
        deleteComment,
        toggleReaction,
        toggleExpanded,
        expandedCommentId,
        loadedReplies,
        loadedRepliesLoading,
        hasUserReacted,
    } = useDiscussion();

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const isOwner = user?.username === comment.user.login;
    const roleBadge = getRoleBadge(comment.author_association, comment.is_owner);
    const thumbsUpCount = getReactionCount(comment.reactions, "+1");
    const thumbsDownCount = getReactionCount(comment.reactions, "-1");
    const hasThumbsUp = hasUserReacted(comment.reaction_users, "THUMBS_UP");
    const hasThumbsDown = hasUserReacted(comment.reaction_users, "THUMBS_DOWN");
    const isEdited = isCommentEdited(comment);
    const isExpanded = expandedCommentId === comment.id;
    const replies = loadedReplies[comment.id] || [];
    const isLoadingReplies = loadedRepliesLoading[comment.id] || false;
    const isDeleted = isCommentDeleted(comment);

    const replyLabel = comment.reply_count === 1 ? "reply" : "replies";
    const replyButtonText = isExpanded
        ? `Hide ${comment.reply_count} ${replyLabel}`
        : `${comment.reply_count} ${replyLabel}`;

    const renderRepliesContent = () => {
        if (isLoadingReplies) {
            return (
                <div className="gap-4 flex flex-col">
                    {[...Array(2)].map((_, idx) => (
                        <SingleCommentLoading key={idx + 1} />
                    ))}
                </div>
            );
        }

        if (replies.length > 0) {
            return replies.map((reply) => (
                <ReplyCard
                    key={reply.id}
                    reply={reply}
                    authUsername={user?.username || ""}
                    parentCommentId={comment.id}
                />
            ));
        }

        return <div className="ml-4 pl-3 text-muted-foreground text-sm sm:text-base">No replies yet.</div>;
    };

    // Confirm delete handler
    const handleConfirmDelete = () => {
        deleteComment(comment.id);
        setShowDeleteDialog(false);
    };

    // handle reply
    const handleReply = () => {
        if (user) {
            setReplyingTo(comment.id);
        } else {
            toast.error("You must be logged in to reply to a comment.");
        }
    };

    return (
        <div className="group rounded-xl border border-border/30 p-5 hover:border-border transition-all duration-200">
            {/* Header */}
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
                                    title={`Edited ${getFormatDistanceToNow(
                                        new Date(comment.last_edited_at)
                                    )}`}
                                >
                                    • Edited
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu */}
                {isOwner && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-1.5 transition-all">
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

            {/* Body */}
            <div className="text-sm sm:text-base mb-4 leading-relaxed prose prose-sm max-w-none text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {isDeleted ? (
                    <span className="italic">This message was deleted.</span>
                ) : (
                    <MarkdownPreview content={comment.body} />
                )}
            </div>

            {/* Actions */}
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
                    onClick={handleReply}
                    className="flex items-center gap-1.5 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-semibold text-xs">Reply</span>
                </button>
            </div>

            {/* Replies */}
            {isExpanded && <div className="mt-4 pt-4 space-y-3">{renderRepliesContent()}</div>}

            {/* Reply Form */}
            {replyingTo && (
                <CommentForm parentId={comment.id} onCancel={() => setReplyingTo(null)} />
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Comment?"
                description="Are you sure you want to delete this comment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}