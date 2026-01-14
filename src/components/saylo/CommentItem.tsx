"use client";

import { Comment } from "@/utils/types";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface CommentItemProps {
    comment: Comment;
    isAdmin: boolean;
    userId?: string;
    isEditing: boolean;
    editContent: string;
    isUpdating: boolean;
    onEditContentChange: (content: string) => void;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    onDelete: () => void;
}

export default function CommentItem({
    comment,
    isAdmin,
    userId,
    isEditing,
    editContent,
    isUpdating,
    onEditContentChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
}: Readonly<CommentItemProps>) {
    const isOwnComment = userId && comment.authorId === userId;

    return (
        <div className="flex gap-3 group/comment">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center overflow-hidden shrink-0">
                {comment.authorImage ? (
                    <Image
                        src={comment.authorImage}
                        alt={comment.authorName}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                        {comment.authorName.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => onEditContentChange(e.target.value)}
                            className="w-full bg-accent/30 border border-border/50 rounded-xl p-3 text-foreground text-sm resize-none outline-none focus:border-primary/50 transition-colors"
                            rows={2}
                            autoFocus
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onSaveEdit}
                                disabled={!editContent.trim() || isUpdating}
                                className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                {isUpdating && <Loader2 className="w-3 h-3 animate-spin" />}
                                Save
                            </button>
                            <button
                                onClick={onCancelEdit}
                                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-accent/30 rounded-xl px-3 py-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground">{comment.authorName}</span>
                                {comment.isAdmin && (
                                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">Author</span>
                                )}
                            </div>
                            <p className="text-sm text-foreground mt-0.5">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 px-2">
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                            {isOwnComment && (
                                <button
                                    onClick={onStartEdit}
                                    className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover/comment:opacity-100 transition-opacity hover:underline cursor-pointer"
                                >
                                    Edit
                                </button>
                            )}
                            {(isAdmin || isOwnComment) && (
                                <button
                                    onClick={onDelete}
                                    className="text-xs text-destructive opacity-0 group-hover/comment:opacity-100 transition-opacity hover:underline cursor-pointer"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Preview version for list variant
interface CommentPreviewProps {
    comment: Comment;
}

export function CommentPreview({ comment }: Readonly<CommentPreviewProps>) {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center overflow-hidden shrink-0">
                {comment.authorImage ? (
                    <Image
                        src={comment.authorImage}
                        alt={comment.authorName}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                        {comment.authorName.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-accent/30 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{comment.authorName}</span>
                        {comment.isAdmin && (
                            <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">Author</span>
                        )}
                    </div>
                    <p className="text-sm text-foreground mt-0.5 line-clamp-2">{comment.content}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-2">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
            </div>
        </div>
    );
}
