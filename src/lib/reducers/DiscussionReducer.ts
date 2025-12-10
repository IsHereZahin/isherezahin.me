// src/lib/reducers/discussionReducer.ts

import { removeItemById, replaceItemById, updateItemById, updateReaction } from "@/lib/github/helpers";
import type { Comment, ReactionKey, Reply } from "@/lib/github/types";

export interface DiscussionState {
    comments: Comment[];
    discussionId: string;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    sortBy: "newest" | "oldest" | "popular";
    loadedReplies: Record<string, Reply[]>;
    loadedRepliesLoading: Record<string, boolean>;
    expandedCommentId: string | null;
    authUsername: string | null;
    // Pagination
    total: number;
    hasNextPage: boolean;
    endCursor: string | null;
};

export type DiscussionAction =
    | { type: "SET_COMMENTS"; payload: Comment[] }
    | { type: "APPEND_COMMENTS"; payload: Comment[] }
    | { type: "SET_DISCUSSION_ID"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_LOADING_MORE"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SORT"; payload: "newest" | "oldest" | "popular" }
    | { type: "TOGGLE_EXPANDED"; payload: string }
    | { type: "SET_AUTH_USERNAME"; payload: string | null }
    | { type: "SET_LOADED_REPLIES"; payload: { commentId: string; replies: Reply[] } }
    | { type: "SET_LOADED_REPLIES_LOADING"; payload: { commentId: string; loading: boolean } }
    | { type: "UPDATE_COMMENT"; payload: { id: string; updates: Partial<Comment> } }
    | { type: "UPDATE_REPLY"; payload: { commentId: string; replyId: string; updates: Partial<Reply> } }
    | { type: "ADD_COMMENT"; payload: Comment }
    | { type: "REPLACE_COMMENT"; payload: { tempId: string; comment: Comment } }
    | { type: "ADD_REPLY"; payload: { commentId: string; reply: Reply } }
    | { type: "REPLACE_REPLY"; payload: { commentId: string; tempId: string; reply: Reply } }
    | { type: "DELETE_COMMENT"; payload: string }
    | { type: "DELETE_REPLY"; payload: { commentId: string; replyId: string } }
    | { type: "SET_PAGINATION"; payload: { total: number; hasNextPage: boolean; endCursor: string | null } }
    | {
        type: "OPTIMISTIC_TOGGLE_REACTION";
        payload: {
            targetId: string;
            reactionType: ReactionKey;
            isReply: boolean;
            commentId?: string;
            add: boolean;
            username: string;
        };
    };

export const initialDiscussionState: DiscussionState = {
    comments: [],
    discussionId: "",
    loading: true,
    loadingMore: false,
    error: null,
    sortBy: "newest",
    loadedReplies: {},
    loadedRepliesLoading: {},
    expandedCommentId: null,
    authUsername: null,
    total: 0,
    hasNextPage: false,
    endCursor: null,
};

export function discussionReducer(state: DiscussionState,action: DiscussionAction): DiscussionState {
    switch (action.type) {
        case "SET_COMMENTS":
            return { ...state, comments: action.payload };

        case "APPEND_COMMENTS":
            return { ...state, comments: [...state.comments, ...action.payload] };

        case "SET_DISCUSSION_ID":
            return { ...state, discussionId: action.payload };

        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_LOADING_MORE":
            return { ...state, loadingMore: action.payload };

        case "SET_PAGINATION":
            return {
                ...state,
                total: action.payload.total,
                hasNextPage: action.payload.hasNextPage,
                endCursor: action.payload.endCursor,
            };

        case "SET_ERROR":
            return { ...state, error: action.payload };

        case "SET_SORT":
            return { ...state, sortBy: action.payload };

        case "SET_AUTH_USERNAME":
            return { ...state, authUsername: action.payload };

        case "SET_LOADED_REPLIES":
            return {
                ...state,
                loadedReplies: {
                    ...state.loadedReplies,
                    [action.payload.commentId]: action.payload.replies,
                },
            };

        case "SET_LOADED_REPLIES_LOADING":
            return {
                ...state,
                loadedRepliesLoading: {
                    ...state.loadedRepliesLoading,
                    [action.payload.commentId]: action.payload.loading,
                },
            };

        case "UPDATE_COMMENT":
            return {
                ...state,
                comments: updateItemById(state.comments, action.payload.id, action.payload.updates),
            };

        case "UPDATE_REPLY":
            return {
                ...state,
                loadedReplies: {
                    ...state.loadedReplies,
                    [action.payload.commentId]: updateItemById(
                        state.loadedReplies[action.payload.commentId] || [],
                        action.payload.replyId,
                        action.payload.updates
                    ),
                },
            };

        case "ADD_COMMENT":
            return { ...state, comments: [action.payload, ...state.comments] };

        case "REPLACE_COMMENT":
            return {
                ...state,
                comments: replaceItemById(state.comments, action.payload.tempId, action.payload.comment),
            };

        case "ADD_REPLY":
            return {
                ...state,
                loadedReplies: {
                    ...state.loadedReplies,
                    [action.payload.commentId]: [
                        ...(state.loadedReplies[action.payload.commentId] || []),
                        action.payload.reply,
                    ],
                },
            };

        case "REPLACE_REPLY":
            return {
                ...state,
                loadedReplies: {
                    ...state.loadedReplies,
                    [action.payload.commentId]: replaceItemById(
                        state.loadedReplies[action.payload.commentId] || [],
                        action.payload.tempId,
                        action.payload.reply
                    ),
                },
            };

        case "DELETE_COMMENT": {
            const remainingReplies = { ...state.loadedReplies };
            delete remainingReplies[action.payload];
            return {
                ...state,
                comments: removeItemById(state.comments, action.payload),
                loadedReplies: remainingReplies,
            };
        }

        case "DELETE_REPLY":
            return {
                ...state,
                loadedReplies: {
                    ...state.loadedReplies,
                    [action.payload.commentId]: removeItemById(
                        state.loadedReplies[action.payload.commentId] || [],
                        action.payload.replyId
                    ),
                },
                comments: state.comments.map((c) =>
                    c.id === action.payload.commentId
                        ? { ...c, reply_count: Math.max(0, c.reply_count - 1) }
                        : c
                ),
            };

        case "TOGGLE_EXPANDED":
            return {
                ...state,
                expandedCommentId: state.expandedCommentId === action.payload ? null : action.payload,
            };

        case "OPTIMISTIC_TOGGLE_REACTION": {
            const { targetId, reactionType, isReply, commentId, add, username } = action.payload;

            if (isReply && commentId) {
                return {
                    ...state,
                    loadedReplies: {
                        ...state.loadedReplies,
                        [commentId]: (state.loadedReplies[commentId] || []).map((r) =>
                            r.id === targetId ? updateReaction(r, reactionType, add, username) : r
                        ),
                    },
                };
            }

            return {
                ...state,
                comments: state.comments.map((c) =>
                    c.id === targetId ? updateReaction(c, reactionType, add, username) : c
                ),
            };
        }

        default:
            return state;
    }
}