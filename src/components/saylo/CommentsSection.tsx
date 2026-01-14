"use client";

import { Comment } from "@/utils/types";
import { Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import CommentItem, { CommentPreview } from "./CommentItem";

interface CommentsSectionProps {
    sayloId: string;
    comments: Comment[];
    isLoadingComments: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
    userId?: string;
    onCommentAdded: (comment: Comment) => void;
    onCommentUpdated: (commentId: string, content: string) => void;
    onCommentDeleted: (commentId: string) => void;
    variant?: "full" | "preview";
    commentCount?: number;
    inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export default function CommentsSection({
    sayloId,
    comments,
    isLoadingComments,
    isLoggedIn,
    isAdmin,
    userId,
    onCommentAdded,
    onCommentUpdated,
    onCommentDeleted,
    variant = "full",
    commentCount = 0,
    inputRef,
}: Readonly<CommentsSectionProps>) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const submitComment = async () => {
        if (!newComment.trim() || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/saylo/${sayloId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment.trim() }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to add comment");
            }

            const data = await response.json();
            onCommentAdded(data);
            setNewComment("");
            toast.success("Comment added");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateComment = async () => {
        if (!editingCommentId || !editingContent.trim() || isUpdating) return;
        setIsUpdating(true);

        try {
            const response = await fetch(`/api/saylo/${sayloId}/comments`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commentId: editingCommentId,
                    content: editingContent.trim(),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update comment");
            }

            const updatedComment = await response.json();
            onCommentUpdated(editingCommentId, updatedComment.content);
            setEditingCommentId(null);
            setEditingContent("");
            toast.success("Comment updated");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update comment");
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`/api/saylo/${sayloId}/comments?commentId=${commentId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete comment");

            onCommentDeleted(commentId);
            toast.success("Comment deleted");
        } catch {
            toast.error("Failed to delete comment");
        }
    };

    const startEditing = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    // Preview variant for list view
    if (variant === "preview") {
        return (
            <div className="space-y-4">
                {/* Quick Comment Input */}
                {isLoggedIn ? (
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <textarea
                                ref={inputRef}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                rows={2}
                                className="w-full bg-accent/30 border border-border/50 rounded-xl p-3 text-foreground text-sm resize-none outline-none focus:border-primary/50 transition-colors"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey && newComment.trim()) {
                                        e.preventDefault();
                                        submitComment();
                                    }
                                }}
                            />
                            <div className="flex items-center justify-between mt-2">
                                {commentCount > 2 ? (
                                    <Link
                                        href={`/saylo/${sayloId}`}
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        View all comments
                                    </Link>
                                ) : (
                                    <span />
                                )}
                                <button
                                    onClick={submitComment}
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>{" "}
                        to comment
                    </p>
                )}

                {/* Recent Comments Preview */}
                {isLoadingComments ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    comments.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {comments.slice(0, 2).map((comment) => (
                                <CommentPreview key={comment.id} comment={comment} />
                            ))}
                            {comments.length > 2 && (
                                <Link href={`/saylo/${sayloId}`} className="block text-center text-sm text-primary hover:underline py-2">
                                    View all {commentCount} comments
                                </Link>
                            )}
                        </div>
                    )
                )}
            </div>
        );
    }

    // Full variant for detail view
    return (
        <div className="space-y-4">
            {/* Comment Input */}
            {isLoggedIn ? (
                <div className="flex gap-3">
                    <div className="flex-1">
                        <textarea
                            ref={inputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={2}
                            className="w-full bg-accent/30 border border-border/50 rounded-xl p-3 text-foreground text-sm resize-none outline-none focus:border-primary/50 transition-colors"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={submitComment}
                                disabled={!newComment.trim() || isSubmitting}
                                className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-2">Sign in to comment</p>
            )}

            {/* Comments List */}
            {isLoadingComments ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            isAdmin={isAdmin}
                            userId={userId}
                            isEditing={editingCommentId === comment.id}
                            editContent={editingContent}
                            isUpdating={isUpdating}
                            onEditContentChange={setEditingContent}
                            onStartEdit={() => startEditing(comment)}
                            onCancelEdit={cancelEditing}
                            onSaveEdit={updateComment}
                            onDelete={() => deleteComment(comment.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
}
