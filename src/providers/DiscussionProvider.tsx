"use client"

import { discussionApi } from "@/lib/api"
import { Comment, DiscussionContext, DiscussionContextType, ReactionKey, ReactionUser, Reply } from "@/lib/contexts"
import { discussionReducer, initialDiscussionState } from "@/lib/reducers/DiscussionReducer"
import { hasUserReacted } from "@/utils"
import React, { useCallback, useEffect, useMemo, useReducer } from "react"

interface DiscussionProviderProps {
    children: React.ReactNode
    discussionNumber?: number
    authUsername?: string | null
}

export function DiscussionProvider({ children, discussionNumber = 1, authUsername = null}: Readonly<DiscussionProviderProps>) {
    const [state, dispatch] = useReducer(discussionReducer, {
        ...initialDiscussionState,
        authUsername,
    })

    useEffect(() => {
        dispatch({ type: "SET_AUTH_USERNAME", payload: authUsername })
    }, [authUsername])

    // Fetch comments for the discussion
    const fetchComments = useCallback(async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })
            const data = await discussionApi.fetchComments(discussionNumber)
            dispatch({ type: "SET_COMMENTS", payload: data.comments })
            dispatch({ type: "SET_DISCUSSION_ID", payload: data.discussionId })
            dispatch({ type: "SET_ERROR", payload: null })
        } catch (err) {
            console.error(err)
            dispatch({ type: "SET_ERROR", payload: "Failed to load comments" })
        } finally {
            dispatch({ type: "SET_LOADING", payload: false })
        }
    }, [discussionNumber])

    // Fetch replies for a comment
    const fetchReplies = useCallback(
        async (commentId: string) => {
            try {
                dispatch({
                    type: "SET_LOADED_REPLIES_LOADING",
                    payload: { commentId, loading: true },
                })
                const data = await discussionApi.fetchReplies(discussionNumber, commentId)
                dispatch({
                    type: "SET_LOADED_REPLIES",
                    payload: { commentId, replies: data.replies },
                })
            } catch (err) {
                console.error("Failed to fetch replies:", err)
                dispatch({ type: "SET_ERROR", payload: "Failed to load replies" })
            } finally {
                dispatch({
                    type: "SET_LOADED_REPLIES_LOADING",
                    payload: { commentId, loading: false },
                })
            }
        },
        [discussionNumber]
    )

    // Add new comment
    const addComment = useCallback(
        async (body: string, userAvatar?: string) => {
            try {
                const tempComment = {
                    id: `temp-${Date.now()}`,
                    body,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    last_edited_at: null,
                    user: {
                        login: state.authUsername || "You",
                        avatar_url: userAvatar || "",
                        html_url: ""
                    },
                    author_association: "OWNER",
                    is_owner: true,
                    reactions: { "+1": 0, "-1": 0, laugh: 0, hooray: 0, confused: 0, heart: 0, rocket: 0, eyes: 0, THUMBS_UP: 0, THUMBS_DOWN: 0, LAUGH: 0, HOORAY: 0, CONFUSED: 0, HEART: 0, ROCKET: 0, EYES: 0 },
                    reaction_users: [],
                    reply_count: 0,
                }

                dispatch({ type: "ADD_COMMENT", payload: tempComment })
                const result = await discussionApi.addComment(discussionNumber, body, state.discussionId)

                // Format the new comment properly
                const formattedComment = {
                    ...result.comment,
                    user: {
                        login: state.authUsername || "You",
                        avatar_url: userAvatar || "",
                        html_url: ""
                    },
                    reactions: { "+1": 0, "-1": 0, laugh: 0, hooray: 0, confused: 0, heart: 0, rocket: 0, eyes: 0, THUMBS_UP: 0, THUMBS_DOWN: 0, LAUGH: 0, HOORAY: 0, CONFUSED: 0, HEART: 0, ROCKET: 0, EYES: 0 },
                    reaction_users: [],
                    author_association: "OWNER",
                    is_owner: true,
                    reply_count: 0,
                }

                dispatch({ type: "REPLACE_COMMENT", payload: { tempId: tempComment.id, comment: formattedComment } })
            } catch (err) {
                console.error(err)
                dispatch({ type: "SET_ERROR", payload: "Failed to post comment" })
                throw err
            }
        },
        [discussionNumber, state.discussionId, state.authUsername]
    )

    // Add new reply to a comment
    const addReply = useCallback(
        async (commentId: string, body: string, userAvatar?: string) => {
            try {
                const tempReply = {
                    id: `temp-${Date.now()}`,
                    body,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    last_edited_at: null,
                    user: {
                        login: state.authUsername || "You",
                        avatar_url: userAvatar || "",
                        html_url: ""
                    },
                    author_association: "OWNER",
                    is_owner: true,
                    is_contributor: false,
                    reactions: { "+1": 0, "-1": 0, laugh: 0, hooray: 0, confused: 0, heart: 0, rocket: 0, eyes: 0, THUMBS_UP: 0, THUMBS_DOWN: 0, LAUGH: 0, HOORAY: 0, CONFUSED: 0, HEART: 0, ROCKET: 0, EYES: 0 },
                    reaction_users: [],
                }

                dispatch({ type: "ADD_REPLY", payload: { commentId, reply: tempReply } })
                const result = await discussionApi.addReply(discussionNumber, commentId, body, state.discussionId)
                dispatch({
                    type: "REPLACE_REPLY",
                    payload: { commentId, tempId: tempReply.id, reply: result.reply },
                })

                dispatch({
                    type: "UPDATE_COMMENT",
                    payload: {
                        id: commentId,
                        updates: {
                            reply_count: (state.comments.find((c) => c.id === commentId)?.reply_count ?? 0) + 1,
                        },
                    },
                })
            } catch (err) {
                console.error(err)
                dispatch({ type: "SET_ERROR", payload: "Failed to post reply" })
                throw err
            }
        },
        [discussionNumber, state.discussionId, state.comments, state.authUsername]
    )

    // Delete comment
    const deleteComment = useCallback(
        async (commentId: string) => {
            if (!confirm("Are you sure you want to delete this comment?")) return
            const previous = [...state.comments]
            dispatch({ type: "DELETE_COMMENT", payload: commentId })

            try {
                await discussionApi.deleteComment(discussionNumber, commentId)
            } catch (err) {
                console.error(err)
                dispatch({ type: "SET_COMMENTS", payload: previous })
                dispatch({ type: "SET_ERROR", payload: "Failed to delete comment" })
            }
        },
        [discussionNumber, state.comments]
    )

    // Delete reply
    const deleteReply = useCallback(
        async (commentId: string, replyId: string) => {
            if (!confirm("Are you sure you want to delete this reply?")) return
            const previousReplies = state.loadedReplies[commentId]
            dispatch({ type: "DELETE_REPLY", payload: { commentId, replyId } })

            try {
                await discussionApi.deleteComment(discussionNumber, replyId)
            } catch (err) {
                console.error(err)
                dispatch({
                    type: "SET_LOADED_REPLIES",
                    payload: { commentId, replies: previousReplies },
                })
                dispatch({ type: "SET_ERROR", payload: "Failed to delete reply" })
            }
        },
        [discussionNumber, state.loadedReplies]
    )

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

            const target = isReply && parentCommentId
                ? state.loadedReplies[parentCommentId]?.find(r => r.id === targetId)
                : state.comments.find(c => c.id === targetId);

            if (!target) return;

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
                await discussionApi.toggleReaction(
                    discussionNumber,
                    targetId,
                    reaction,
                    hasReacted
                );
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
        [discussionNumber, state.comments, state.loadedReplies, state.authUsername]
    );

    // Toggle expanded replies
    const toggleExpanded = useCallback(
        (commentId: string) => {
            const isExpanded = state.expandedCommentId === commentId
            dispatch({ type: "TOGGLE_EXPANDED", payload: commentId })
            if (!isExpanded && !state.loadedReplies[commentId]) {
                fetchReplies(commentId)
            }
        },
        [state.expandedCommentId, state.loadedReplies, fetchReplies]
    )

    // Initial fetch of comments
    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    // Memoized context value
    const value = useMemo<DiscussionContextType>(() => ({
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
            dispatch({
                type: "UPDATE_COMMENT",
                payload: { id: commentId, updates } as {
                    id: string;
                    updates: Partial<Comment>;
                },
            });
        },
        updateReplyOptimistic: (commentId: string, replyId: string, updates: Partial<Reply>) => {
            dispatch({
                type: "UPDATE_REPLY",
                payload: { commentId, replyId, updates } as {
                    commentId: string;
                    replyId: string;
                    updates: Partial<Reply>;
                },
            });
        },
    }), [
        state,
        fetchComments,
        fetchReplies,
        addComment,
        addReply,
        deleteComment,
        deleteReply,
        toggleReaction,
        toggleExpanded
    ]);

    return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>
}