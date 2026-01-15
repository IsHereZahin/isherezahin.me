"use client";

import MarkdownTextarea from "@/components/ui/MarkdownTextarea";
import { PERSON } from "@/config/seo.config";
import { parseMarkdown } from "@/lib/markdown";
import { getDeviceId } from "@/utils";
import { cloudinary } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Globe, ImagePlus, Loader2, Lock, MessageCircle, MoreHorizontal, Pencil, Share2, Trash2, Users, Video, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { MediaItem, Reactions, ReactionType, Saylo } from "@/utils/types";
import CategorySelector from "./CategorySelector";
import ContentDiscussions from "@/components/content/discussions/ContentDiscussions";
import MediaGallery from "./MediaGallery";
import MediaModal from "./MediaModal";
import ReactionButton, { ReactionsSummary } from "./ReactionButton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { saylo as sayloApi } from "@/lib/api";

// Re-export Saylo type for backwards compatibility
export type { Saylo } from "@/utils/types";

interface SayCardProps {
    saylo: Saylo;
    isAdmin: boolean;
    isLoggedIn?: boolean;  // Deprecated: no longer used, kept for compatibility
    userId?: string;  // Deprecated: no longer used, kept for compatibility
    variant?: "list" | "detail";
    onDeleted?: () => void;
    isCommentOpen?: boolean;
    onCommentToggle?: (isOpen: boolean) => void;
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

export default function SayCard({ saylo, isAdmin, variant = "list", onDeleted, isCommentOpen, onCommentToggle }: Readonly<SayCardProps>) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Visibility options
    const visibilityOptions = [
        { value: "public", label: "Public", icon: Globe, description: "Anyone can see" },
        { value: "authenticated", label: "Signed In", icon: Users, description: "Only signed in users" },
        { value: "private", label: "Only Me", icon: Lock, description: "Only you can see" },
    ] as const;

    // UI state
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(saylo.content);
    const [editMedia, setEditMedia] = useState<MediaItem[]>([
        ...(saylo.images || []).map((url) => ({ url, type: "image" as const })),
        ...(saylo.videos || []).map((url) => ({ url, type: "video" as const })),
    ]);
    const [editVisibility, setEditVisibility] = useState<"public" | "authenticated" | "private">(
        (saylo.visibility as "public" | "authenticated" | "private") || "public"
    );
    const [editCategory, setEditCategory] = useState<string | null>(saylo.category);
    const [isUploadingEdit, setIsUploadingEdit] = useState(false);
    const [mediaModalState, setMediaModalState] = useState<{ media: MediaItem[]; index: number } | null>(null);
    const [showInlineCommentInternal, setShowInlineCommentInternal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Use controlled state if provided, otherwise use internal state
    const showInlineComment = isCommentOpen ?? showInlineCommentInternal;
    const setShowInlineComment = (value: boolean) => {
        if (onCommentToggle) {
            onCommentToggle(value);
        } else {
            setShowInlineCommentInternal(value);
        }
    };
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Fetch categories for edit mode
    const { data: categoriesData } = useQuery({
        queryKey: ["sayloCategories"],
        queryFn: () => sayloApi.getCategories(),
        enabled: isEditing,
    });

    // Reactions state
    const [reactions, setReactions] = useState<Reactions>(saylo.reactions || { like: 0, love: 0, haha: 0, fire: 0 });
    const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
    const [isReacting, setIsReacting] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    // Share state
    const [shareCount, setShareCount] = useState(0);
    const [hasShared, setHasShared] = useState(false);

    // Comment count state
    const [commentCount, setCommentCount] = useState(0);

    // Refs
    const menuRef = useRef<HTMLDivElement>(null);
    const reactionRef = useRef<HTMLDivElement>(null);

    // Fetch reaction and share status on mount
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const deviceId = getDeviceId();

                // Fetch reactions
                const reactionResponse = await fetch(`/api/saylo/${saylo.id}/reaction`, {
                    headers: { "x-device-id": deviceId },
                });
                if (reactionResponse.ok) {
                    const data = await reactionResponse.json();
                    setUserReaction(data.userReaction);
                    setReactions(data.reactions);
                }

                // Fetch share status
                const shareResponse = await fetch(`/api/saylo/${saylo.id}/share`, {
                    headers: { "x-device-id": deviceId },
                });
                if (shareResponse.ok) {
                    const data = await shareResponse.json();
                    setShareCount(data.shareCount);
                    setHasShared(data.hasShared);
                }

                // Fetch comment count if discussion exists
                if (saylo.discussionNumber) {
                    const commentsResponse = await fetch(`/api/discussions/${saylo.discussionNumber}?pageSize=1`);
                    if (commentsResponse.ok) {
                        const data = await commentsResponse.json();
                        setCommentCount(data.total || 0);
                    }
                }
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        };
        fetchStatus();
    }, [saylo.id, saylo.discussionNumber]);

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
        mutationFn: async () => {
            const response = await fetch(`/api/saylo/${saylo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: editContent,
                    category: editCategory,
                    images: editMedia.filter((m) => m.type === "image").map((m) => m.url),
                    videos: editMedia.filter((m) => m.type === "video").map((m) => m.url),
                    visibility: editVisibility,
                }),
            });
            if (!response.ok) throw new Error("Failed to update");
            return response.json();
        },
        onSuccess: () => {
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["saylos"] });
            queryClient.invalidateQueries({ queryKey: ["saylo", saylo.id] });
            queryClient.invalidateQueries({ queryKey: ["sayloCategories"] });
            toast.success("Updated successfully");
        },
        onError: () => {
            toast.error("Failed to update");
        },
    });

    const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingEdit(true);
        const newMedia: MediaItem[] = [];

        for (const file of Array.from(files)) {
            const isVideoByType = file.type.startsWith("video/") || /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name);

            try {
                const data = await cloudinary.upload(file);
                const isVideoFile = data.resource_type === "video" || data.url?.includes("/video/") || isVideoByType;
                newMedia.push({ url: data.url, type: isVideoFile ? "video" : "image" });
            } catch (err) {
                console.error("Upload error:", err);
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        setEditMedia((prev) => [...prev, ...newMedia]);
        setIsUploadingEdit(false);
        if (editFileInputRef.current) {
            editFileInputRef.current.value = "";
        }
    };

    const removeEditMedia = (index: number) => {
        setEditMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const currentEditVisibility = visibilityOptions.find((v) => v.value === editVisibility)!;

    const handleShare = async () => {
        const shareUrl = `${globalThis.location.origin}/saylo/${saylo.id}`;
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
            try {
                const deviceId = getDeviceId();
                const response = await fetch(`/api/saylo/${saylo.id}/share`, {
                    method: "POST",
                    headers: { "x-device-id": deviceId },
                });
                if (response.ok) {
                    const data = await response.json();
                    setShareCount(data.shareCount);
                    setHasShared(true);
                }
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
                                {saylo.visibility && saylo.visibility !== "public" && (
                                    <span
                                        className={`flex items-center p-1 text-xs rounded-full ${saylo.visibility === "private"
                                                ? "bg-red-500/20 text-red-600 dark:text-red-400"
                                                : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                            }`}
                                        title={saylo.visibility === "private" ? "Only you can see this" : "Only signed in users can see this"}
                                    >
                                        {saylo.visibility === "private" ? <Lock className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{timeAgo}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <FavoriteButton className={variant === "list" ? "sm:opacity-0 sm:group-hover:opacity-100" : ""} />

                        {isAdmin && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className={`p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-colors cursor-pointer ${variant === "list" ? "sm:opacity-0 sm:group-hover:opacity-100" : ""
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
                                                setShowDeleteDialog(true);
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

                        {/* Edit Media Previews */}
                        {editMedia.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {editMedia.map((item, index) => (
                                    <div key={`edit-media-${item.url}`} className="relative group/media">
                                        {item.type === "video" ? (
                                            <div className="relative w-20 h-20 bg-accent rounded-lg flex items-center justify-center overflow-hidden">
                                                <video src={item.url} className="w-full h-full object-cover" muted />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Video className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <Image
                                                src={item.url}
                                                alt={`Media ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        )}
                                        <button
                                            onClick={() => removeEditMedia(index)}
                                            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Edit Actions Row */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/20">
                            <div className="flex items-center gap-2">
                                {/* Media Upload */}
                                <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleEditFileUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => editFileInputRef.current?.click()}
                                    disabled={isUploadingEdit}
                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                                    title="Add images or videos"
                                >
                                    {isUploadingEdit ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                                </button>

                                {/* Category Selector */}
                                <CategorySelector
                                    categories={categoriesData?.categories || []}
                                    selectedCategory={editCategory}
                                    onCategoryChange={setEditCategory}
                                    allowCreate={true}
                                />

                                {/* Visibility Selector */}
                                <div className="relative group/visibility">
                                    <button
                                        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                                        title={currentEditVisibility.description}
                                    >
                                        <currentEditVisibility.icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{currentEditVisibility.label}</span>
                                    </button>
                                    <div className="absolute left-0 bottom-full mb-1 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover/visibility:opacity-100 group-hover/visibility:visible transition-all z-10 min-w-40">
                                        {visibilityOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setEditVisibility(option.value)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${editVisibility === option.value ? "text-primary bg-accent/30" : "text-foreground"}`}
                                            >
                                                <option.icon className="w-4 h-4" />
                                                <div className="text-left">
                                                    <div className="font-medium">{option.label}</div>
                                                    <div className="text-xs text-muted-foreground">{option.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditContent(saylo.content);
                                        setEditCategory(saylo.category);
                                        setEditMedia([
                                            ...(saylo.images || []).map((url) => ({ url, type: "image" as const })),
                                            ...(saylo.videos || []).map((url) => ({ url, type: "video" as const })),
                                        ]);
                                        setEditVisibility((saylo.visibility as "public" | "authenticated" | "private") || "public");
                                    }}
                                    className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateMutation.mutate()}
                                    disabled={updateMutation.isPending || !editContent.trim() || isUploadingEdit}
                                    className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    {updateMutation.isPending ? "Saving..." : "Save"}
                                </button>
                            </div>
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

                {/* Reactions, Comments & Shares Summary */}
                {(totalReactions > 0 || commentCount > 0 || shareCount > 0) && (
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        {totalReactions > 0 ? <ReactionsSummary reactions={reactions} userReaction={userReaction} /> : <div />}

                        <div className="flex items-center gap-3">
                            {commentCount > 0 && (
                                <button
                                    onClick={() => router.push(`/saylo/${saylo.id}`)}
                                    className="hover:text-foreground hover:underline transition-colors cursor-pointer"
                                >
                                    {commentCount} comment{commentCount === 1 ? "" : "s"}
                                </button>
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

                {/* Comments Section - GitHub Discussions (full list on detail page) */}
                {variant === "detail" && (
                    <div className="mt-4 pt-4 border-t border-border/20">
                        <ContentDiscussions
                            contentType="saylo"
                            identifier={saylo.id}
                            initialDiscussionNumber={saylo.discussionNumber}
                            onCommentAdded={() => setCommentCount(prev => prev + 1)}
                        />
                    </div>
                )}

                {/* Inline Comment Input (for list variant) - only shows input, not full comments */}
                {variant === "list" && showInlineComment && (
                    <div className="mt-4 pt-4 border-t border-border/20">
                        <ContentDiscussions
                            contentType="saylo"
                            identifier={saylo.id}
                            initialDiscussionNumber={saylo.discussionNumber}
                            inputOnly
                            onCommentAdded={() => setCommentCount(prev => prev + 1)}
                            seeAllLink={`/saylo/${saylo.id}`}
                            commentCount={commentCount}
                        />
                    </div>
                )}
            </article>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Saylo"
                description="Are you sure you want to delete this saylo? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                onConfirm={async () => {
                    await deleteMutation.mutateAsync();
                }}
                isLoading={deleteMutation.isPending}
            />
        </>
    );
}
