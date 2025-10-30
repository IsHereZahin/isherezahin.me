// src/lib/helpers/comments.ts

import type { Comment, Reactions, ReactionUser, Reply, ReactionKey } from "@/lib/github/types";

// Creates a temporary comment for optimistic UI updates
export function createTempComment(body: string, username: string, userAvatar?: string): Comment {
    return {
        id: `temp-${Date.now()}`,
        body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_edited_at: null,
        user: {
            login: username || "You",
            avatar_url: userAvatar || "",
            html_url: "",
        },
        author_association: "OWNER",
        is_owner: true,
        reactions: createEmptyReactions(),
        reaction_users: [],
        reply_count: 0,
    };
}

// Creates a temporary reply for optimistic UI updates
export function createTempReply(body: string, username: string, userAvatar?: string): Reply {
    return {
        id: `temp-${Date.now()}`,
        body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_edited_at: null,
        user: {
            login: username || "You",
            avatar_url: userAvatar || "",
            html_url: "",
        },
        author_association: "OWNER",
        is_owner: true,
        is_contributor: false,
        reactions: createEmptyReactions(),
        reaction_users: [],
    };
}

// Formats a comment response
export function formatCommentResponse(comment: Comment, username: string, userAvatar?: string ): Comment {
    return {
        ...comment,
        user: {
            login: username || "You",
            avatar_url: userAvatar || "",
            html_url: "",
        },
        reactions: comment.reactions || createEmptyReactions(),
        reaction_users: comment.reaction_users || [],
        author_association: comment.author_association || "OWNER",
        is_owner: comment.is_owner ?? true,
        reply_count: comment.reply_count || 0,
    };
}


// Checks if a comment was deleted
export function isCommentDeleted(comment: Comment | Reply): boolean {
    return !comment.body?.trim().length;
}

// Checks if a comment was edited
export function isCommentEdited(comment: Comment | Reply): boolean {
    return !!comment.last_edited_at;
}

// update an item by ID
export function updateItemById<T extends { id: string }>(
    items: T[],
    id: string,
    updates: Partial<T>
): T[] {
    return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

// replace an item by ID
export function replaceItemById<T extends { id: string }>(
    items: T[],
    oldId: string,
    newItem: T
): T[] {
    return items.map((item) => (item.id === oldId ? newItem : item));
}

// remove an item by ID
export function removeItemById<T extends { id: string }>(items: T[], id: string): T[] {
    return items.filter((item) => item.id !== id);
}

// helper for reactions

// check if user has reacted
export function hasUserReacted(reactionUsers: ReactionUser[], username: string, reactionType: ReactionKey): boolean {
    if (!username) return false;

    const normalizedType = normalizeReactionType(reactionType);

    return reactionUsers.some(
        (ru) =>
            ru.user.login === username &&
            normalizeReactionType(ru.content as ReactionKey) === normalizedType
    );
}

// normalize reaction type
function normalizeReactionType(type: ReactionKey): string {
    const map: Record<string, string> = {
        "+1": "THUMBS_UP",
        "-1": "THUMBS_DOWN",
        laugh: "LAUGH",
        hooray: "HOORAY",
        confused: "CONFUSED",
        heart: "HEART",
        rocket: "ROCKET",
        eyes: "EYES",
    };

    return map[type] || type;
}

// add or remove a reaction
export function updateReaction<T extends { reactions: Reactions; reaction_users: ReactionUser[] }>(
    item: T,
    reactionType: ReactionKey,
    add: boolean,
    username: string
): T {
    const newReactions = { ...item.reactions };
    newReactions[reactionType] = Math.max(0, (newReactions[reactionType] || 0) + (add ? 1 : -1));

    const reactionContent = normalizeReactionType(reactionType);

    const newReactionUsers = add
        ? [
            ...item.reaction_users,
            {
                content: reactionContent,
                user: { login: username, avatar_url: "", html_url: "" },
            },
        ]
        : item.reaction_users.filter(
            (ru) =>
                !(ru.user.login === username && normalizeReactionType(ru.content as ReactionKey) === reactionContent)
        );

    return { ...item, reactions: newReactions, reaction_users: newReactionUsers } as T;
}

// create empty reaction object
export function createEmptyReactions(): Reactions {
    return {
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
        THUMBS_UP: 0,
        THUMBS_DOWN: 0,
        LAUGH: 0,
        HOORAY: 0,
        CONFUSED: 0,
        HEART: 0,
        ROCKET: 0,
        EYES: 0,
    };
}

// get specific reaction count
export function getReactionCount(reactions: Reactions, type: ReactionKey): number {
    return reactions[type] || 0;
}