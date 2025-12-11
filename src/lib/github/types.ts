// src/lib/github/types.ts

import type { ReactionNode } from "./reactions";

export interface Author {
    login?: string;
    avatarUrl?: string;
    url?: string;
}

export interface CommentNode {
    id: string;
    body?: string;
    createdAt: string;
    updatedAt: string;
    lastEditedAt?: string;
    authorAssociation?: string;
    author?: Author;
    reactions: {
        nodes: ReactionNode[];
    };
    replies?: {
        totalCount: number;
    };
}

export interface FormattedComment {
    id: string;
    user: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
    body: string;
    created_at: string;
    updated_at: string;
    last_edited_at?: string;
    reactions: Record<string, number>;
    user_reaction: string | null;
    reaction_users: Array<{
        content: string;
        user: {
            login: string;
            avatar_url: string;
            html_url: string;
        };
    }>;
    author_association: string;
    is_owner: boolean;
    is_contributor?: boolean;
    replies?: unknown[];
    reply_count?: number;
}

export interface ReactionUser {
    content: string;
    user: {
        login: string;
        username?: string;
        avatar_url: string;
        html_url: string;
    };
}

export type ReactionKey =
    | "+1"
    | "-1"
    | "laugh"
    | "hooray"
    | "confused"
    | "heart"
    | "rocket"
    | "eyes"
    | "THUMBS_UP"
    | "THUMBS_DOWN"
    | "LAUGH"
    | "HOORAY"
    | "CONFUSED"
    | "HEART"
    | "ROCKET"
    | "EYES";

export interface Reactions {
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
    THUMBS_UP: number;
    THUMBS_DOWN: number;
    LAUGH: number;
    HOORAY: number;
    CONFUSED: number;
    HEART: number;
    ROCKET: number;
    EYES: number;
}

export interface Comment {
    id: string;
    user: User;
    body: string;
    created_at: string;
    updated_at: string;
    last_edited_at?: string | null;
    reactions: Reactions;
    user_reaction?: string | null;
    reaction_users: ReactionUser[];
    author_association: string;
    is_owner: boolean;
    replies?: Reply[];
    reply_count: number;
}

export interface Reply {
    id: string;
    user: User;
    body: string;
    created_at: string;
    updated_at: string;
    last_edited_at?: string | null;
    reactions: Reactions;
    user_reaction?: string | null;
    reaction_users: ReactionUser[];
    author_association: string;
    is_owner: boolean;
    is_contributor: boolean;
}

export interface DiscussionContextType {
    comments: Comment[];
    discussionId: string;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    sortBy: "newest" | "oldest" | "popular";
    expandedComments: Set<string>;
    loadedReplies: Record<string, Reply[]>;
    loadedRepliesLoading: Record<string, boolean>;
    expandedCommentId: string | null;
    // Pagination
    total: number;
    hasNextPage: boolean;

    // Actions
    setSortBy: (sortBy: "newest" | "oldest" | "popular") => void;
    fetchComments: () => Promise<void>;
    fetchMoreComments: () => Promise<void>;
    fetchReplies: (commentId: string) => Promise<void>;
    addComment: (body: string, userAvatar?: string) => Promise<void>;
    editComment: (commentId: string, body: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    addReply: (commentId: string, body: string, userAvatar?: string) => Promise<void>;
    editReply: (commentId: string, replyId: string, body: string) => Promise<void>;
    deleteReply: (commentId: string, replyId: string) => Promise<void>;
    toggleReaction: (
        targetId: string,
        reaction: ReactionKey,
        hasReacted: boolean,
        isReply?: boolean,
        parentCommentId?: string,
        hasOppositeReaction?: boolean
    ) => Promise<void>;
    toggleExpanded: (commentId: string) => void;
    hasUserReacted: (reactionUsers: ReactionUser[], reactionType: ReactionKey) => boolean;
    updateCommentOptimistic: (commentId: string, updates: Partial<Comment>) => void;
    updateReplyOptimistic: (commentId: string, replyId: string, updates: Partial<Reply>) => void;
}


// -------------------- User interface --------------------
export interface User {
    login: string;
    avatar_url: string;
    html_url: string;
}

export interface AuthUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatar_url?: string | null;
    username?: string | null;
    provider?: "github" | "google";
    bio?: string | null;
}

export interface AuthContextType {
    user: AuthUser | null;
    status: "loading" | "authenticated" | "unauthenticated";
    login: () => void;
    loginWithProvider: (provider: "github" | "google") => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isGitHubUser: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    isLoginModalOpen: boolean;
}