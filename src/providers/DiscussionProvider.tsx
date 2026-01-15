"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { DiscussionContext } from "@/lib/contexts";
import { discussionApi } from "@/lib/github/api";
import {
    createTempComment,
    createTempReply,
    formatCommentResponse,
    hasUserReacted,
    updateReaction,
} from "@/lib/github/helpers";
import type { Comment, DiscussionContextType, ReactionKey, ReactionUser, Reply } from "@/lib/github/types";
import { useAuth } from "@/lib/hooks/useAuth";

interface DiscussionProviderProps {
    children: React.ReactNode;
    discussionNumber?: number;
    authUsername?: string | null;
    inputOnly?: boolean;  // Skip fetching comments if true
}

interface CommentsPage {
    comments: Comment[];
    discussionId: string;
    total: number;
    hasNextPage: boolean;
    endCursor: string | null;
}

export function DiscussionProvider({ children, discussionNumber = 1, authUsername = null, inputOnly = false }: Readonly<DiscussionProviderProps>) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const avatarUrl = useMemo(() => user?.image ?? undefined, [user?.image]);

    // Local state for UI-specific things
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
    const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);
    const [loadedReplies, setLoadedReplies] = useState<Record<string, Reply[]>>({});
    const [loadedRepliesLoading, setLoadedRepliesLoading] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    // Query key for comments
    const commentsQueryKey = useMemo(() => ["discussion-comments", discussionNumber, sortBy], [discussionNumber, sortBy]);

    // Fetch comments using useInfiniteQuery
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery<CommentsPage>({
        queryKey: commentsQueryKey,
        queryFn: async ({ pageParam }) => {
            const result = await discussionApi.fetchComments(
                discussionNumber,
                10,
                pageParam as string | undefined,
                sortBy
            );
            return result;
        },
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.endCursor : undefined,
        initialPageParam: undefined as string | undefined,
        enabled: !inputOnly,
        placeholderData: (previousData) => previousData,
    });

    // Flatten all comments from pages
    const comments = useMemo(() => {
        return data?.pages.flatMap((page) => page.comments) || [];
    }, [data]);

    // Get discussion ID and total from first page
    const discussionId = data?.pages[0]?.discussionId || "";
    const total = data?.pages[0]?.total || 0;

    // Handle sort change - React Query will refetch automatically due to queryKey change
    const handleSetSortBy = useCallback((sort: "newest" | "oldest" | "popular") => {
        if (sort === sortBy) return;
        setSortBy(sort);
    }, [sortBy]);

    // Fetch more comments (pagination)
    const fetchMoreComments = useCallback(async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        await fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Fetch replies for a comment
    const fetchReplies = useCallback(
        async (commentId: string) => {
            try {
                setLoadedRepliesLoading((prev) => ({ ...prev, [commentId]: true }));
                const result = await discussionApi.fetchReplies(discussionNumber, commentId);
                setLoadedReplies((prev) => ({ ...prev, [commentId]: result.replies }));
            } catch (err) {
                console.error("Failed to fetch replies:", err);
                toast.error("Failed to load replies");
            } finally {
                setLoadedRepliesLoading((prev) => ({ ...prev, [commentId]: false }));
            }
        },
        [discussionNumber]
    );

    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: async (body: string) => {
            return await discussionApi.addComment(discussionNumber, body, discussionId);
        },
        onMutate: async (body) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: commentsQueryKey });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<{ pages: CommentsPage[] }>(commentsQueryKey);

            // Optimistically add the new comment
            const tempComment = createTempComment(body, authUsername || "You", avatarUrl);

            queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                if (!old) return old;
                const newPages = [...old.pages];
                if (newPages[0]) {
                    newPages[0] = {
                        ...newPages[0],
                        comments: [tempComment, ...newPages[0].comments],
                        total: newPages[0].total + 1,
                    };
                }
                return { ...old, pages: newPages };
            });

            return { previousData, tempComment };
        },
        onError: (_err, _body, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(commentsQueryKey, context.previousData);
            }
            toast.error("Failed to post comment");
        },
        onSuccess: (result, _body, context) => {
            // Replace temp comment with real one
            const formattedComment = formatCommentResponse(
                result.comment,
                authUsername || "You",
                avatarUrl
            );

            queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                if (!old) return old;
                const newPages = old.pages.map((page, index) => {
                    if (index === 0) {
                        return {
                            ...page,
                            comments: page.comments.map((c) =>
                                c.id === context?.tempComment.id ? formattedComment : c
                            ),
                        };
                    }
                    return page;
                });
                return { ...old, pages: newPages };
            });

            toast.success("Comment posted successfully");
        },
    });

    // Edit comment mutation
    const editCommentMutation = useMutation({
        mutationFn: async ({ commentId, body }: { commentId: string; body: string }) => {
            return await discussionApi.editComment(discussionNumber, commentId, body);
        },
        onMutate: async ({ commentId, body }) => {
            await queryClient.cancelQueries({ queryKey: commentsQueryKey });
            const previousData = queryClient.getQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey);

            // Optimistic update
            queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        comments: page.comments.map((c) =>
                            c.id === commentId
                                ? { ...c, body, last_edited_at: new Date().toISOString() }
                                : c
                        ),
                    })),
                };
            });

            return { previousData };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(commentsQueryKey, context.previousData);
            }
            toast.error("Failed to update comment");
        },
        onSuccess: () => {
            toast.success("Comment updated successfully");
        },
    });

    // Delete comment mutation
    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId: string) => {
            return await discussionApi.deleteComment(discussionNumber, commentId);
        },
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({ queryKey: commentsQueryKey });
            const previousData = queryClient.getQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey);

            // Optimistic delete
            queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        comments: page.comments.filter((c) => c.id !== commentId),
                        total: Math.max(0, page.total - 1),
                    })),
                };
            });

            // Also remove loaded replies
            setLoadedReplies((prev) => {
                const next = { ...prev };
                delete next[commentId];
                return next;
            });

            return { previousData };
        },
        onError: (_err, _commentId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(commentsQueryKey, context.previousData);
            }
            toast.error("Failed to delete comment");
        },
        onSuccess: () => {
            toast.success("Comment deleted successfully");
        },
    });

    // Add reply
    const addReply = useCallback(
        async (commentId: string, body: string) => {
            try {
                const tempReply = createTempReply(body, authUsername || "You", avatarUrl);

                // Optimistically add reply
                setLoadedReplies((prev) => ({
                    ...prev,
                    [commentId]: [...(prev[commentId] || []), tempReply],
                }));

                // If first reply, expand
                const comment = comments.find((c) => c.id === commentId);
                if (comment && comment.reply_count === 0) {
                    setExpandedCommentId(commentId);
                }

                const result = await discussionApi.addReply(
                    discussionNumber,
                    commentId,
                    body,
                    discussionId
                );

                // Replace temp reply with real one
                setLoadedReplies((prev) => ({
                    ...prev,
                    [commentId]: (prev[commentId] || []).map((r) =>
                        r.id === tempReply.id ? result.reply : r
                    ),
                }));

                // Update reply count in cache
                queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            comments: page.comments.map((c) =>
                                c.id === commentId
                                    ? { ...c, reply_count: (c.reply_count || 0) + 1 }
                                    : c
                            ),
                        })),
                    };
                });

                toast.success("Reply posted successfully");
            } catch (err) {
                console.error(err);
                toast.error("Failed to post reply");
                throw err;
            }
        },
        [discussionNumber, discussionId, comments, authUsername, avatarUrl, queryClient, commentsQueryKey]
    );

    // Edit reply
    const editReply = useCallback(
        async (commentId: string, replyId: string, body: string) => {
            const previousReplies = loadedReplies[commentId];

            // Optimistic update
            setLoadedReplies((prev) => ({
                ...prev,
                [commentId]: (prev[commentId] || []).map((r) =>
                    r.id === replyId
                        ? { ...r, body, last_edited_at: new Date().toISOString() }
                        : r
                ),
            }));

            try {
                await discussionApi.editComment(discussionNumber, replyId, body);
                toast.success("Reply updated successfully");
            } catch (err) {
                console.error(err);
                // Revert on error
                if (previousReplies) {
                    setLoadedReplies((prev) => ({ ...prev, [commentId]: previousReplies }));
                }
                toast.error("Failed to update reply");
                throw err;
            }
        },
        [discussionNumber, loadedReplies]
    );

    // Delete reply
    const deleteReply = useCallback(
        async (commentId: string, replyId: string) => {
            const previousReplies = loadedReplies[commentId];

            // Optimistic delete
            setLoadedReplies((prev) => ({
                ...prev,
                [commentId]: (prev[commentId] || []).filter((r) => r.id !== replyId),
            }));

            // Update reply count
            queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        comments: page.comments.map((c) =>
                            c.id === commentId
                                ? { ...c, reply_count: Math.max(0, (c.reply_count || 0) - 1) }
                                : c
                        ),
                    })),
                };
            });

            try {
                await discussionApi.deleteComment(discussionNumber, replyId);
                toast.success("Reply deleted successfully");
            } catch (err) {
                console.error(err);
                // Revert on error
                if (previousReplies) {
                    setLoadedReplies((prev) => ({ ...prev, [commentId]: previousReplies }));
                }
                toast.error("Failed to delete reply");
            }
        },
        [discussionNumber, loadedReplies, queryClient, commentsQueryKey]
    );

    // Toggle reaction (mutually exclusive - like/unlike can't both be active)
    const toggleReaction = useCallback(
        async (
            targetId: string,
            reaction: ReactionKey,
            hasReacted: boolean,
            isReply = false,
            parentCommentId?: string,
            hasOppositeReaction = false
        ) => {
            if (!authUsername) return;

            const oppositeReaction: ReactionKey = reaction === "+1" ? "-1" : "+1";

            // Optimistic updates
            if (isReply && parentCommentId) {
                setLoadedReplies((prev) => {
                    const replies = prev[parentCommentId] || [];
                    let updated = replies;

                    if (hasOppositeReaction) {
                        updated = updated.map((r) =>
                            r.id === targetId ? updateReaction(r, oppositeReaction, false, authUsername) : r
                        );
                    }
                    updated = updated.map((r) =>
                        r.id === targetId ? updateReaction(r, reaction, !hasReacted, authUsername) : r
                    );

                    return { ...prev, [parentCommentId]: updated };
                });
            } else {
                queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            comments: page.comments.map((c) => {
                                if (c.id !== targetId) return c;
                                let updated = c;
                                if (hasOppositeReaction) {
                                    updated = updateReaction(updated, oppositeReaction, false, authUsername);
                                }
                                return updateReaction(updated, reaction, !hasReacted, authUsername);
                            }),
                        })),
                    };
                });
            }

            // API calls in background
            try {
                const promises: Promise<unknown>[] = [];

                if (hasOppositeReaction) {
                    promises.push(discussionApi.toggleReaction(discussionNumber, targetId, oppositeReaction, true));
                }
                promises.push(discussionApi.toggleReaction(discussionNumber, targetId, reaction, hasReacted));

                await Promise.all(promises);
            } catch (err) {
                console.error("Failed to toggle reaction", err);
                toast.error("Failed to update reaction");

                // Revert optimistic updates on error (refetch would be cleaner)
                queryClient.invalidateQueries({ queryKey: commentsQueryKey });
            }
        },
        [discussionNumber, authUsername, queryClient, commentsQueryKey]
    );

    // Toggle expanded replies
    const toggleExpanded = useCallback(
        (commentId: string) => {
            const isExpanded = expandedCommentId === commentId;
            setExpandedCommentId(isExpanded ? null : commentId);
            if (!isExpanded && !loadedReplies[commentId]) {
                fetchReplies(commentId);
            }
        },
        [expandedCommentId, loadedReplies, fetchReplies]
    );

    // Wrapper functions for mutations
    const addComment = useCallback(
        async (body: string) => {
            await addCommentMutation.mutateAsync(body);
        },
        [addCommentMutation]
    );

    const editComment = useCallback(
        async (commentId: string, body: string) => {
            await editCommentMutation.mutateAsync({ commentId, body });
        },
        [editCommentMutation]
    );

    const deleteComment = useCallback(
        async (commentId: string) => {
            await deleteCommentMutation.mutateAsync(commentId);
        },
        [deleteCommentMutation]
    );

    // Optimistic update helpers (for external use if needed)
    const updateCommentOptimistic = useCallback(
        (commentId: string, updates: Partial<Comment>) => {
            queryClient.setQueryData<{ pages: CommentsPage[]; pageParams: unknown[] }>(commentsQueryKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        comments: page.comments.map((c) =>
                            c.id === commentId ? { ...c, ...updates } : c
                        ),
                    })),
                };
            });
        },
        [queryClient, commentsQueryKey]
    );

    const updateReplyOptimistic = useCallback(
        (commentId: string, replyId: string, updates: Partial<Reply>) => {
            setLoadedReplies((prev) => ({
                ...prev,
                [commentId]: (prev[commentId] || []).map((r) =>
                    r.id === replyId ? { ...r, ...updates } : r
                ),
            }));
        },
        []
    );

    // Dummy fetchComments for interface compatibility (React Query handles this)
    const fetchComments = useCallback(async () => {
        queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    }, [queryClient, commentsQueryKey]);

    // Set error from React Query
    useEffect(() => {
        if (isError) {
            setError("Failed to load comments");
        } else {
            setError(null);
        }
    }, [isError]);

    // Memoized context value
    const value = useMemo<DiscussionContextType>(
        () => ({
            // State values
            comments,
            discussionId,
            loading: isLoading,
            loadingMore: isFetchingNextPage,
            error,
            sortBy,
            expandedComments: new Set<string>(),
            loadedReplies,
            loadedRepliesLoading,
            expandedCommentId,
            // Pagination
            total,
            hasNextPage: hasNextPage || false,

            // Actions
            setSortBy: handleSetSortBy,
            fetchComments,
            fetchMoreComments,
            fetchReplies,
            addComment,
            editComment,
            addReply,
            editReply,
            deleteComment,
            deleteReply,
            toggleReaction,
            toggleExpanded,
            hasUserReacted: (reactionUsers: ReactionUser[], reactionType: ReactionKey) =>
                hasUserReacted(reactionUsers, authUsername || "", reactionType),
            updateCommentOptimistic,
            updateReplyOptimistic,
        }),
        [
            comments,
            discussionId,
            isLoading,
            isFetchingNextPage,
            error,
            sortBy,
            loadedReplies,
            loadedRepliesLoading,
            expandedCommentId,
            total,
            hasNextPage,
            handleSetSortBy,
            fetchComments,
            fetchMoreComments,
            fetchReplies,
            addComment,
            editComment,
            addReply,
            editReply,
            deleteComment,
            deleteReply,
            toggleReaction,
            toggleExpanded,
            authUsername,
            updateCommentOptimistic,
            updateReplyOptimistic,
        ]
    );

    return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>;
}