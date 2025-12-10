// src/lib/github/api.ts

export const discussionApi = {
  async fetchComments(discussionNumber: number, last = 10, before?: string) {
    const params = new URLSearchParams({ last: String(last) });
    if (before) params.set("before", before);
    
    const response = await fetch(`/api/discussions/${discussionNumber}?${params}`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    return await response.json();
  },

  async fetchReplies(discussionNumber: number, commentId: string) {
    const response = await fetch(
      `/api/discussions/${discussionNumber}/replies/${commentId}`
    );
    if (!response.ok) throw new Error("Failed to fetch replies");
    return await response.json();
  },

  async addComment(discussionNumber: number, body: string, discussionId: string) {
    const response = await fetch(`/api/discussions/${discussionNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, discussionId }),
    });
    if (!response.ok) throw new Error("Failed to post comment");
    return await response.json();
  },

  async addReply(discussionNumber: number, commentId: string, body: string, discussionId: string) {
    const response = await fetch(
      `/api/discussions/${discussionNumber}/replies/${commentId}`,
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
    const response = await fetch(`/api/discussions/${discussionNumber}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    if (!response.ok) throw new Error("Failed to delete comment");
    return await response.json();
  },

  async toggleReaction(discussionNumber: number, subjectId: string, reaction: string, hasReacted: boolean) {
    const endpoint = `/api/discussions/${discussionNumber}/reactions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, reaction, hasReacted }),
    });

    if (!response.ok) throw new Error("Failed to toggle reaction");
    return await response.json();
  },
};
