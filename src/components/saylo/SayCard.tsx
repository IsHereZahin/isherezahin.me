"use client";

import MarkdownTextarea from "@/components/ui/MarkdownTextarea";
import { PERSON } from "@/config/seo.config";
import { parseMarkdown } from "@/lib/markdown";
import { getDeviceId } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, MessageCircle, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Comment, MediaItem, Reactions, ReactionType, Saylo } from "@/utils/types";
import CommentsSection from "./CommentsSection";
import MediaGallery from "./MediaGallery";
import MediaModal from "./MediaModal";
import ReactionButton, { ReactionsSummary } from "./ReactionButton";

// Re-export Saylo type for backwards compatibility
export type { Saylo } from "@/utils/types";

interface SayCardProps {
    saylo: Saylo;
    isAdmin: boolean;
    isLoggedIn: boolean;
    userId?: string;
    variant?: "list" | "detail";
    onDeleted?: () => void;
}

// FavoriteButton Component
function FavoriteButton({ className }: { readonly className?: string }) {
    const handleClick = () => {
        toast.info("This feature is coming soon...");
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-colors cursor-pointer ${className || ""}`}
            title="Save for later"
        >
            <Bookmark className="w-5 h-5" />
        </button>
    );
}

export default function SayCard({ saylo, isAdmin, isLoggedIn, userId, variant = "list", onDeleted }: Readonly<SayCardProps>) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // UI state
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(saylo.content);
    const [mediaModalState, setMediaModalState] = useState<{ media: MediaItem[]; index: number } | null>(null);
    const [showInlineComment, setShowInlineComment] = useState(false);

    // Reactions state
    const [reactions, setReactions] = useState<Reactions>(saylo.reactions || { like: 0, love: 0, haha: 0, fire: 0 });
    const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
    const [isReacting, setIsReacting] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    // Comments state
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentCount, setCommentCount] = useState(saylo.commentCount || 0);
    const [shareCount, setShareCount] = useState(saylo.shareCount || 0);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    // Refs
    const menuRef = useRef<HTMLDivElement>(null);
    const reactionRef = useRef<HTMLDivElement>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    // Fetch reaction status on mount
    useEffect(() => {
        const fetchReactionStatus = async () => {
            try {
                const deviceId = getDeviceId();
                const response = await fetch(`/api/saylo/${saylo.id}/reaction`, {
                    headers: { "x-device-id": deviceId },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserReaction(data.userReaction);
                    setReactions(data.reactions);
                }
            } catch (error) {
                console.error("Error fetching reaction status:", error);
            }
        };
        fetchReactionStatus();
    }, [saylo.id]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
            if (reactionRef.current && !reactionRef.current.contains(e.target as Node)) {
                setShowReactionPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load comments when needed
    useEffect(() => {
        if ((showInlineComment || variant === "detail") && comments.length === 0) {
            loadComments();
        }
    }, [showInlineComment, variant]);

    // Focus comment input when opened
    useEffect(() => {
        if (showInlineComment && commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }, [showInlineComment]);

    const handleReaction = async (type: ReactionType) => {
        if (isReacting) return;
        setIsReacting(true);
        setShowReactionPicker(false);

        const prevReactions = { ...reactions };
        const prevUserReaction = userReaction;

        if (userReaction === type) {
            setUserReaction(null);
            setReactions((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
        } else {
            if (userReaction) {
                setReactions((prev) => ({ ...prev, [userReaction]: Math.max(0, prev[userReaction] - 1) }));
            }
            setUserReaction(type);
            setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
        }

        try {
            const deviceId = getDeviceId();
            const response = await fetch(`/api/saylo/${saylo.id}/reaction`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-device-id": deviceId },
                body: JSON.stringify({ type }),
            });

            if (!response.ok) throw new Error("Failed to toggle reaction");

            const data = await response.json();
            setReactions(data.reactions);
            setUserReaction(data.userReaction);
        } catch {
            setReactions(prevReactions);
            setUserReaction(prevUserReaction);
            toast.error("Failed to update reaction");
        } finally {
            setIsReacting(false);
        }
    };

    const loadComments = async () => {
        if (isLoadingComments) return;
        setIsLoadingComments(true);

        try {
            const response = await fetch(`/api/saylo/${saylo.id}/comments?limit=100`);
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments);
                setCommentCount(data.total);
            }
        } catch {
            toast.error("Failed to load comments");
        } finally {
            setIsLoadingComments(false);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/saylo/${saylo.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saylos"] });
            queryClient.invalidateQueries({ queryKey: ["saylo", saylo.id] });
            toast.success("Deleted successfully");
            setShowInlineComment(false);
            if (variant === "detail") {
                router.push("/saylo");
            }
            onDeleted?.();
        },
        onError: () => {
            toast.error("Failed to delete");
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (content: string) => {
            const response = await fetch(`/api/saylo/${saylo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (!response.ok) throw new Error("Failed to update");
            return response.json();
        },
        onSuccess: () => {
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["saylos"] });
            queryClient.invalidateQueries({ queryKey: ["saylo", saylo.id] });
            toast.success("Updated successfully");
        },
        onError: () => {
            toast.error("Failed to update");
        },
    });

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/saylo/${saylo.id}`;
        const shareTitle = "Saylo";
        const shareText = saylo.content.length > 100 ? saylo.content.substring(0, 100) + "..." : saylo.content;

        let shared = false;

        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
                shared = true;
                toast.success("Shared successfully!");
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied to clipboard");
                    shared = true;
                }
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard");
            shared = true;
        }

        if (shared) {
            setShareCount((prev) => prev + 1);
            try {
                await fetch(`/api/saylo/${saylo.id}/share`, { method: "POST" });
            } catch {
                // Silent fail
            }
        }
    };

    const timeAgo = formatDistanceToNow(new Date(saylo.createdAt), { addSuffix: true });
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

    return (
        <>
            <article
                className={`group bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-5 transition-all duration-300 ${variant === "list" ? "hover:bg-card/50 hover:border-border/50" : ""
                    }`}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center overflow-hidden shrink-0">
                            {saylo.authorImage || PERSON.image.url ? (
                                <Image
                                    src={saylo.authorImage || PERSON.image.url}
                                    alt={saylo.authorName || PERSON.name.full}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-medium text-muted-foreground">
                                    {(saylo.authorName || PERSON.name.first).charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground text-sm">
                                    {saylo.authorName || PERSON.name.first}
                                </span>
                                {saylo.category && (
                                    <span className="px-2 py-0.5 bg-accent/50 text-muted-foreground text-xs rounded-full">
                                        {saylo.category}
                                    </span>
                                )}
                                {!saylo.published && (
                                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">
                                        Draft
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{timeAgo}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <FavoriteButton className={variant === "list" ? "opacity-0 group-hover:opacity-100" : ""} />

                        {isAdmin && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className={`p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-colors cursor-pointer ${variant === "list" ? "opacity-0 group-hover:opacity-100" : ""
                                        }`}
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this?")) {
                                                    deleteMutation.mutate();
                                                }
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="space-y-3">
                        <MarkdownTextarea value={editContent} onChange={setEditContent} rows={4} />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(saylo.content);
                                }}
                                className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateMutation.mutate(editContent)}
                                disabled={updateMutation.isPending || !editContent.trim()}
                                className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {updateMutation.isPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="text-foreground text-[15px] leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(saylo.content) }}
                    />
                )}

                {/* Media Gallery */}
                <MediaGallery
                    images={saylo.images || []}
                    videos={saylo.videos || []}
                    onMediaClick={(index, media) => setMediaModalState({ index, media })}
                />

                {/* Media Modal */}
                {mediaModalState && (
                    <MediaModal
                        media={mediaModalState.media}
                        initialIndex={mediaModalState.index}
                        onClose={() => setMediaModalState(null)}
                    />
                )}

                {/* Reactions & Comments Summary */}
                {(totalReactions > 0 || commentCount > 0 || shareCount > 0) && (
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        {totalReactions > 0 ? <ReactionsSummary reactions={reactions} userReaction={userReaction} /> : <div />}

                        <div className="flex items-center gap-3">
                            {commentCount > 0 && (
                                <Link href={`/saylo/${saylo.id}`} className="hover:underline">
                                    {commentCount} comment{commentCount === 1 ? "" : "s"}
                                </Link>
                            )}
                            {shareCount > 0 && (
                                <span>
                                    {shareCount} share{shareCount === 1 ? "" : "s"}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions bar */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                    <ReactionButton
                        userReaction={userReaction}
                        isReacting={isReacting}
                        onReaction={handleReaction}
                        showPicker={showReactionPicker}
                        onShowPickerChange={setShowReactionPicker}
                        pickerRef={reactionRef}
                    />

                    <button
                        onClick={() => variant === "list" && setShowInlineComment(!showInlineComment)}
                        className={`flex items-center justify-center gap-2 flex-1 py-2 text-sm rounded-lg transition-all hover:bg-accent/50 cursor-pointer ${showInlineComment ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <MessageCircle className={`w-5 h-5 ${showInlineComment ? "fill-primary/20" : ""}`} />
                        <span>Comment</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 flex-1 py-2 text-sm rounded-lg transition-all hover:bg-accent/50 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                    </button>
                </div>

                {/* Comments Section */}
                {variant === "detail" && (
                    <div className="mt-4 pt-4 border-t border-border/20">
                        <CommentsSection
                            sayloId={saylo.id}
                            comments={comments}
                            isLoadingComments={isLoadingComments}
                            isLoggedIn={isLoggedIn}
                            isAdmin={isAdmin}
                            userId={userId}
                            onCommentAdded={(comment) => {
                                setComments((prev) => [comment, ...prev]);
                                setCommentCount((prev) => prev + 1);
                            }}
                            onCommentUpdated={(commentId, content) => {
                                setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, content } : c)));
                            }}
                            onCommentDeleted={(commentId) => {
                                setComments((prev) => prev.filter((c) => c.id !== commentId));
                                setCommentCount((prev) => prev - 1);
                            }}
                            variant="full"
                        />
                    </div>
                )}

                {/* Inline Comments (for list variant) */}
                {variant === "list" && showInlineComment && (
                    <div className="mt-4 pt-4 border-t border-border/20">
                        <CommentsSection
                            sayloId={saylo.id}
                            comments={comments}
                            isLoadingComments={isLoadingComments}
                            isLoggedIn={isLoggedIn}
                            isAdmin={isAdmin}
                            userId={userId}
                            onCommentAdded={(comment) => {
                                setComments((prev) => [comment, ...prev]);
                                setCommentCount((prev) => prev + 1);
                            }}
                            onCommentUpdated={(commentId, content) => {
                                setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, content } : c)));
                            }}
                            onCommentDeleted={(commentId) => {
                                setComments((prev) => prev.filter((c) => c.id !== commentId));
                                setCommentCount((prev) => prev - 1);
                            }}
                            variant="preview"
                            commentCount={commentCount}
                            inputRef={commentInputRef}
                        />
                    </div>
                )}
            </article>
        </>
    );
}
