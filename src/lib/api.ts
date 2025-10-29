// src/lib/api.ts

export const discussionApi = {
    async fetchComments(discussionNumber: number) {
        const response = await fetch(`/api/comments/${discussionNumber}`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        return await response.json();
    },

    async fetchReplies(discussionNumber: number, commentId: string) {
        const response = await fetch(
            `/api/comments/${discussionNumber}/replies/${commentId}`
        );
        if (!response.ok) throw new Error("Failed to fetch replies");
        return await response.json();
    },

    async addComment(
        discussionNumber: number,
        body: string,
        discussionId: string
    ) {
        const response = await fetch(`/api/comments/${discussionNumber}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body, discussionId }),
        });
        if (!response.ok) throw new Error("Failed to post comment");
        return await response.json();
    },

    async addReply(
        discussionNumber: number,
        commentId: string,
        body: string,
        discussionId: string
    ) {
        const response = await fetch(
            `/api/comments/${discussionNumber}/replies/${commentId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body, discussionId, replyToId: commentId }),
            }
        );
        if (!response.ok) throw new Error("Failed to post reply");
        return await response.json();
    },

    async deleteComment(discussionNumber: number, commentId: string) {
        const response = await fetch(`/api/comments/${discussionNumber}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId }),
        });
        if (!response.ok) throw new Error("Failed to delete comment");
        return await response.json();
    },

    async toggleReaction(
        discussionNumber: number,
        subjectId: string,
        reaction: string,
        hasReacted: boolean
    ) {
        const endpoint = `/api/comments/${discussionNumber}/reactions`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subjectId, reaction, hasReacted }),
        });

        if (!response.ok) throw new Error("Failed to toggle reaction");
        return await response.json();
    },
};