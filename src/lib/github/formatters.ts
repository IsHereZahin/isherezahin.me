// src/lib/github/formatters.ts

import { GITHUB_REPO_OWNER } from "../constants";
import { formatReactions } from "./reactions";
import type { CommentNode, FormattedComment } from "./types";

// Format Comment
export function formatComment( comment: CommentNode, sessionUserLogin?: string, options: { includeReplyCount?: boolean } = {} ): FormattedComment {
    const { reactions, user_reaction, reaction_users } = formatReactions(
        comment.reactions.nodes,
        sessionUserLogin
    );

    const formatted: FormattedComment = {
        id: comment.id,
        user: {
            login: comment.author?.login || "ghost",
            avatar_url: comment.author?.avatarUrl || "",
            html_url: comment.author?.url || "",
        },
        body: comment.body || "",
        created_at: comment.createdAt,
        updated_at: comment.updatedAt,
        last_edited_at: comment.lastEditedAt,
        reactions,
        user_reaction,
        reaction_users,
        author_association: comment.authorAssociation || "NONE",
        is_owner:
            (comment.author?.login ?? "").toLowerCase() === GITHUB_REPO_OWNER.toLowerCase(),
        is_contributor: comment.authorAssociation === "CONTRIBUTOR",
    };

    if (options.includeReplyCount && comment.replies) {
        formatted.replies = [];
        formatted.reply_count = comment.replies.totalCount;
    }

    return formatted;
}