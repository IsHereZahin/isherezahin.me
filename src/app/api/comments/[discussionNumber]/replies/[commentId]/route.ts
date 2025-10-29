// src/app/api/comments/[discussionNumber]/replies/[commentId]/route.ts
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

if (!GITHUB_ACCESS_TOKEN) throw new Error("Server configuration error: Missing GitHub token");

const GET_REPLIES_QUERY = `
  query($commentId: ID!) {
    node(id: $commentId) {
      ... on DiscussionComment {
        replies(first: 100) {
          nodes {
            id
            body
            createdAt
            updatedAt
            lastEditedAt
            authorAssociation
            author {
              login
              avatarUrl
              url
            }
            reactions(first: 100) {
              nodes {
                content
                user {
                  login
                  avatarUrl
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_SINGLE_COMMENT_QUERY = `
  query($commentId: ID!) {
    node(id: $commentId) {
      ... on DiscussionComment {
        id
        body
        createdAt
        updatedAt
        lastEditedAt
        authorAssociation
        author {
          login
          avatarUrl
          url
        }
        reactions(first: 100) {
          nodes {
            content
            user {
              login
              avatarUrl
              url
            }
          }
        }
      }
    }
  }
`;

const ADD_REPLY_MUTATION = `
  mutation($discussionId: ID!, $replyToId: ID!, $body: String!) {
    addDiscussionComment(input: { discussionId: $discussionId, replyToId: $replyToId, body: $body }) {
      comment {
        id
      }
    }
  }
`;

async function callGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    console.error("GraphQL error:", result.errors || result);
    throw new Error(result.errors ? JSON.stringify(result.errors) : response.statusText);
  }

  return result.data;
}

// TYPES
interface Author {
  login?: string;
  avatarUrl?: string;
  url?: string;
}

interface ReactionUser {
  login: string;
  avatarUrl: string;
  url: string;
}

interface ReactionNode {
  content: keyof typeof reactionMap;
  user: ReactionUser;
}

interface ReplyNode {
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
}

const reactionMap: Record<string, string> = {
  THUMBS_UP: "+1",
  THUMBS_DOWN: "-1",
  LAUGH: "laugh",
  HOORAY: "hooray",
  CONFUSED: "confused",
  HEART: "heart",
  ROCKET: "rocket",
  EYES: "eyes",
};

function formatReactions(reactionsNodes: ReactionNode[], sessionUserLogin?: string) {
  const reactions = {
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

  const reactionUsers = reactionsNodes.map((r) => ({
    content: r.content,
    user: {
      login: r.user.login,
      avatar_url: r.user.avatarUrl,
      html_url: r.user.url,
    },
  }));

  reactionsNodes.forEach((r) => {
    const mapped = reactionMap[r.content];
    if (mapped) {
      reactions[mapped as keyof typeof reactions]++;
      if (r.user.login === sessionUserLogin) {
        userReaction = mapped;
      }
    }
  });

  return { reactions, user_reaction: userReaction, reaction_users: reactionUsers };
}

// GET handler
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ discussionNumber: string; commentId: string }> }
) {
  try {
    const session = await auth();
    const { commentId } = await context.params;

    const data = await callGraphQL<{ node?: { replies?: { nodes: ReplyNode[] } } }>(
      GET_REPLIES_QUERY,
      { commentId },
      GITHUB_ACCESS_TOKEN as string
    );

    const replies = data.node?.replies?.nodes ?? [];

    const formattedReplies = replies.map((reply) => {
      const { reactions, user_reaction, reaction_users } = formatReactions(
        reply.reactions.nodes,
        session?.user?.name ?? undefined
      );

      return {
        id: reply.id,
        user: {
          login: reply.author?.login || "ghost",
          avatar_url: reply.author?.avatarUrl || "",
          html_url: reply.author?.url || "",
        },
        body: reply.body || "",
        created_at: reply.createdAt,
        updated_at: reply.updatedAt,
        last_edited_at: reply.lastEditedAt,
        reactions,
        user_reaction,
        reaction_users,
        author_association: reply.authorAssociation || "NONE",
        is_owner: reply.author?.login === REPO_OWNER,
        is_contributor: reply.authorAssociation === "CONTRIBUTOR",
      };
    });

    return NextResponse.json({ replies: formattedReplies });
  } catch (error: unknown) {
    console.error("Error fetching replies:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch replies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST handler
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ discussionNumber: string; commentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await context.params;
    const { body, discussionId } = (await request.json()) as { body: string; discussionId: string };

    if (!body?.trim()) throw new Error("Reply body is required");
    if (!discussionId) throw new Error("Discussion ID is required");

    // Create reply
    const createData = await callGraphQL<{ addDiscussionComment: { comment: { id: string } } }>(
      ADD_REPLY_MUTATION,
      { discussionId, replyToId: commentId, body },
      session.accessToken
    );

    const newCommentId = createData.addDiscussionComment.comment.id;

    // Fetch full data for new reply
    const fullData = await callGraphQL<{ node: ReplyNode }>(
      GET_SINGLE_COMMENT_QUERY,
      { commentId: newCommentId },
      session.accessToken
    );

    const reply = fullData.node;
    const { reactions, user_reaction, reaction_users } = formatReactions(reply.reactions.nodes, session?.user?.name ?? undefined);

    const formatted = {
      id: reply.id,
      user: {
        login: reply.author?.login || "ghost",
        avatar_url: reply.author?.avatarUrl || "",
        html_url: reply.author?.url || "",
      },
      body: reply.body || "",
      created_at: reply.createdAt,
      updated_at: reply.updatedAt,
      last_edited_at: reply.lastEditedAt,
      reactions,
      user_reaction,
      reaction_users,
      author_association: reply.authorAssociation || "NONE",
      is_owner: reply.author?.login === REPO_OWNER,
      is_contributor: reply.authorAssociation === "CONTRIBUTOR",
    };

    return NextResponse.json({ reply: formatted });
  } catch (error: unknown) {
    console.error("Error creating reply:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create reply";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}