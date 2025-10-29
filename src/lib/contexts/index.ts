// src/lib/contexts/index.ts
import { createContext } from "react";

interface AuthContextType {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        username?: string | null;
    } | null;
    status: "loading" | "authenticated" | "unauthenticated";
    login: () => void;
    logout: () => void;
}

interface ReactionUser {
    content: string;
    user: {
        login: string;
        username: string;
        avatar_url: string;
        html_url: string;
    };
}

type ReactionKey =
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

interface Reactions {
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

interface Comment {
    id: string;
    user: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
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

interface Reply {
    id: string;
    user: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
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

interface DiscussionContextType {
    comments: Comment[];
    discussionId: string;
    loading: boolean;
    error: string | null;
    sortBy: "newest" | "oldest" | "popular";
    expandedComments: Set<string>;
    loadedReplies: Record<string, Reply[]>;
    loadedRepliesLoading: Record<string, boolean>;

    // Actions
    setSortBy: (sortBy: "newest" | "oldest" | "popular") => void;
    fetchComments: () => Promise<void>;
    fetchReplies: (commentId: string) => Promise<void>;
    addComment: (body: string, userAvatar?: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    addReply: (commentId: string, body: string) => Promise<void>;
    deleteReply: (commentId: string, replyId: string) => Promise<void>;
    toggleReaction: (
        targetId: string,
        reaction: ReactionKey,
        hasReacted: boolean,
        isReply?: boolean,
        parentCommentId?: string
    ) => Promise<void>;
    toggleExpanded: (commentId: string) => void;
    expandedCommentId: string | null;
    hasUserReacted: (
        reactionUsers: ReactionUser[],
        reactionType: ReactionKey
    ) => boolean;
    updateCommentOptimistic: (
        commentId: string,
        updates: Partial<Comment>
    ) => void;
    updateReplyOptimistic: (
        commentId: string,
        replyId: string,
        updates: Partial<Reply>
    ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);

export { AuthContext, DiscussionContext };
export type {
    AuthContextType,
    Comment,
    DiscussionContextType,
    ReactionUser,
    Reply,
    Reactions,
    ReactionKey,
};
