"use client";

import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import { DiscussionContext } from "@/lib/contexts";
import { discussionApi } from "@/lib/github/api";
import { createTempComment, createTempReply, formatCommentResponse, hasUserReacted } from "@/lib/github/helpers";
import type { Comment, DiscussionContextType, ReactionKey, ReactionUser, Reply } from "@/lib/github/types";
import { discussionReducer, initialDiscussionState } from "@/lib/reducers/DiscussionReducer";

interface DiscussionProviderProps {
    children: React.ReactNode;
    discussionNumber?: number;
    authUsername?: string | null;
}

export function DiscussionProvider({ children, discussionNumber = 1, authUsername = null }: Readonly<DiscussionProviderProps>) {
    const [state, dispatch] = useReducer(discussionReducer, {
        ...initialDiscussionState,
        authUsername,
    });

    // Sync auth username
    useEffect(() => {
        dispatch({ type: "SET_AUTH_USERNAME", payload: authUsername });
    }, [authUsername]);

    // Fetch comments for the discussion
    const fetchComments = useCallback(async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            const data = await discussionApi.fetchComments(discussionNumber);
            dispatch({ type: "SET_COMMENTS", payload: data.comments });
            dispatch({ type: "SET_DISCUSSION_ID", payload: data.discussionId });
            dispatch({ type: "SET_ERROR", payload: null });
        } catch (err) {
            console.error(err);
            dispatch({ type: "SET_ERROR", payload: "Failed to load comments" });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [discussionNumber]);

    // Fetch replies for a comment
    const fetchReplies = useCallback(
        async (commentId: string) => {
            try {
                dispatch({
                    type: "SET_LOADED_REPLIES_LOADING",
                    payload: { commentId, loading: true },
                });
                const data = await discussionApi.fetchReplies(discussionNumber, commentId);
                dispatch({
                    type: "SET_LOADED_REPLIES",
                    payload: { commentId, replies: data.replies },
                });
            } catch (err) {
                console.error("Failed to fetch replies:", err);
                dispatch({ type: "SET_ERROR", payload: "Failed to load replies" });
            } finally {
                dispatch({
                    type: "SET_LOADED_REPLIES_LOADING",
                    payload: { commentId, loading: false },
                });
            }
        },
        [discussionNumber]
    );

    // Add new comment
    const addComment = useCallback(
        async (body: string, userAvatar?: string) => {
            try {
                const tempComment = createTempComment(body, state.authUsername || "You", userAvatar);

                dispatch({ type: "ADD_COMMENT", payload: tempComment });
                const result = await discussionApi.addComment(discussionNumber, body, state.discussionId);

                const formattedComment = formatCommentResponse(
                    result.comment,
                    state.authUsername || "You",
                    userAvatar
                );

                dispatch({
                    type: "REPLACE_COMMENT",
                    payload: { tempId: tempComment.id, comment: formattedComment },
                });
            } catch (err) {
                console.error(err);
                dispatch({ type: "SET_ERROR", payload: "Failed to post comment" });
                throw err;
            }
        },
        [discussionNumber, state.discussionId, state.authUsername]
    );

    // Add new reply to a comment
    const addReply = useCallback(
        async (commentId: string, body: string, userAvatar?: string) => {
            try {
                const tempReply = createTempReply(body, state.authUsername || "You", userAvatar);

                dispatch({ type: "ADD_REPLY", payload: { commentId, reply: tempReply } });
                const result = await discussionApi.addReply(
                    discussionNumber,
                    commentId,
                    body,
                    state.discussionId
                );
                dispatch({
                    type: "REPLACE_REPLY",
                    payload: { commentId, tempId: tempReply.id, reply: result.reply },
                });

                dispatch({
                    type: "UPDATE_COMMENT",
                    payload: {
                        id: commentId,
                        updates: {
                            reply_count: (state.comments.find((c) => c.id === commentId)?.reply_count ?? 0) + 1,
                        },
                    },
                });
            } catch (err) {
                console.error(err);
                dispatch({ type: "SET_ERROR", payload: "Failed to post reply" });
                throw err;
            }
        },
        [discussionNumber, state.discussionId, state.comments, state.authUsername]
    );

    // Delete comment
    const deleteComment = useCallback(
        async (commentId: string) => {
            if (!confirm("Are you sure you want to delete this comment?")) return;
            const previous = [...state.comments];
            dispatch({ type: "DELETE_COMMENT", payload: commentId });

            try {
                await discussionApi.deleteComment(discussionNumber, commentId);
            } catch (err) {
                console.error(err);
                dispatch({ type: "SET_COMMENTS", payload: previous });
                dispatch({ type: "SET_ERROR", payload: "Failed to delete comment" });
            }
        },
        [discussionNumber, state.comments]
    );

    // Delete reply
    const deleteReply = useCallback(
        async (commentId: string, replyId: string) => {
            if (!confirm("Are you sure you want to delete this reply?")) return;
            const previousReplies = state.loadedReplies[commentId];
            dispatch({ type: "DELETE_REPLY", payload: { commentId, replyId } });

            try {
                await discussionApi.deleteComment(discussionNumber, replyId);
            } catch (err) {
                console.error(err);
                dispatch({
                    type: "SET_LOADED_REPLIES",
                    payload: { commentId, replies: previousReplies },
                });
                dispatch({ type: "SET_ERROR", payload: "Failed to delete reply" });
            }
        },
        [discussionNumber, state.loadedReplies]
    );

    // Toggle reaction
    const toggleReaction = useCallback(
        async (
            targetId: string,
            reaction: ReactionKey,
            hasReacted: boolean,
            isReply = false,
            parentCommentId?: string
        ) => {
            if (!state.authUsername) return;

            // Optimistic update
            dispatch({
                type: "OPTIMISTIC_TOGGLE_REACTION",
                payload: {
                    targetId,
                    reactionType: reaction,
                    isReply,
                    commentId: parentCommentId,
                    add: !hasReacted,
                    username: state.authUsername,
                },
            });

            // API call
            try {
                await discussionApi.toggleReaction(discussionNumber, targetId, reaction, hasReacted);
            } catch (err) {
                console.error("Failed to toggle reaction", err);
                // Revert optimistic update
                dispatch({
                    type: "OPTIMISTIC_TOGGLE_REACTION",
                    payload: {
                        targetId,
                        reactionType: reaction,
                        isReply,
                        commentId: parentCommentId,
                        add: hasReacted,
                        username: state.authUsername,
                    },
                });
            }
        },
        [discussionNumber, state.authUsername]
    );

    // Toggle expanded replies
    const toggleExpanded = useCallback(
        (commentId: string) => {
            const isExpanded = state.expandedCommentId === commentId;
            dispatch({ type: "TOGGLE_EXPANDED", payload: commentId });
            if (!isExpanded && !state.loadedReplies[commentId]) {
                fetchReplies(commentId);
            }
        },
        [state.expandedCommentId, state.loadedReplies, fetchReplies]
    );

    // Initial fetch of comments
    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    // Memoized context value
    const value = useMemo<DiscussionContextType>(
        () => ({
            // State values
            comments: state.comments,
            discussionId: state.discussionId,
            loading: state.loading,
            error: state.error,
            sortBy: state.sortBy,
            expandedComments: new Set<string>(),
            loadedReplies: state.loadedReplies,
            loadedRepliesLoading: state.loadedRepliesLoading,
            expandedCommentId: state.expandedCommentId,

            // Actions
            setSortBy: (sort: "newest" | "oldest" | "popular") =>
                dispatch({ type: "SET_SORT", payload: sort }),
            fetchComments,
            fetchReplies,
            addComment,
            addReply,
            deleteComment,
            deleteReply,
            toggleReaction,
            toggleExpanded,
            hasUserReacted: (reactionUsers: ReactionUser[], reactionType: ReactionKey) =>
                hasUserReacted(reactionUsers, state.authUsername || "", reactionType),
            updateCommentOptimistic: (commentId: string, updates: Partial<Comment>) => {
                dispatch({ type: "UPDATE_COMMENT", payload: { id: commentId, updates } });
            },
            updateReplyOptimistic: (commentId: string, replyId: string, updates: Partial<Reply>) => {
                dispatch({ type: "UPDATE_REPLY", payload: { commentId, replyId, updates } });
            },
        }),
        [
            state,
            fetchComments,
            fetchReplies,
            addComment,
            addReply,
            deleteComment,
            deleteReply,
            toggleReaction,
            toggleExpanded,
        ]
    );

    return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>;
}