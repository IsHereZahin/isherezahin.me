// src/lib/github/api.ts

export const discussionApi = {
  async fetchComments(
    discussionNumber: number, 
    pageSize = 10, 
    cursor?: string,
    sort: "newest" | "oldest" | "popular" = "newest"
  ) {
    const params = new URLSearchParams({ 
      pageSize: String(pageSize),
      sort,
    });
    if (cursor) params.set("cursor", cursor);
    
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

  async editComment(discussionNumber: number, commentId: string, body: string) {
    const response = await fetch(`/api/discussions/${discussionNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, body }),
    });
    if (!response.ok) throw new Error("Failed to edit comment");
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

  async addHeartReaction(discussionNumber: number) {
    const response = await fetch(`/api/discussions/${discussionNumber}/heart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      if (data.requiresGitHub) {
        throw new Error("GitHub authentication required");
      }
      throw new Error(data.error || "Failed to add heart reaction");
    }
    return await response.json();
  },
};
