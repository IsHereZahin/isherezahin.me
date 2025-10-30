// src/lib/github/reactions.ts

// Types for GitHub GraphQL reactions
export interface ReactionUser {
    login: string;
    avatarUrl: string;
    url: string;
}

export interface ReactionNode {
    content: keyof typeof REACTION_MAP;
    user: ReactionUser;
}

export interface FormattedReactionUser {
    content: string;
    user: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
}

export interface FormattedReactions {
    reactions: Record<string, number>;
    user_reaction: string | null;
    reaction_users: FormattedReactionUser[];
}

// Maps GitHub GraphQL reaction enums to frontend reaction keys
export const REACTION_MAP: Record<string, string> = {
    THUMBS_UP: "+1",
    THUMBS_DOWN: "-1",
    LAUGH: "laugh",
    HOORAY: "hooray",
    CONFUSED: "confused",
    HEART: "heart",
    ROCKET: "rocket",
    EYES: "eyes",
} as const;

// Maps frontend reaction keys to GitHub GraphQL reaction enums
export const REACTION_MAP_REVERSE: Record<string, string> = {
    "+1": "THUMBS_UP",
    "-1": "THUMBS_DOWN",
    laugh: "LAUGH",
    hooray: "HOORAY",
    confused: "CONFUSED",
    heart: "HEART",
    rocket: "ROCKET",
    eyes: "EYES",
} as const;

// Format Reactions
export function formatReactions( reactionsNodes: ReactionNode[], sessionUserLogin?: string ): FormattedReactions {
    const reactions: Record<string, number> = {
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0,
    };

    let userReaction: string | null = null;

    const reactionUsers: FormattedReactionUser[] = reactionsNodes.map((r) => ({
        content: r.content,
        user: {
            login: r.user.login,
            avatar_url: r.user.avatarUrl,
            html_url: r.user.url,
        },
    }));

    reactionsNodes.forEach((r) => {
        const mapped = REACTION_MAP[r.content];
        if (mapped) {
            reactions[mapped]++;
            if (r.user.login === sessionUserLogin) {
                userReaction = mapped;
            }
        }
    });

    return {
        reactions,
        user_reaction: userReaction,
        reaction_users: reactionUsers,
    };
}