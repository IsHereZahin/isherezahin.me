// src/app/api/discussions/[discussionNumber]/replies/[commentId]/route.ts
import { auth } from "@/auth";
import { GITHUB_ACCESS_TOKEN } from "@/lib/constants";
import { formatComment } from "@/lib/github/formatters";
import { callGraphQL } from "@/lib/github/graphql";
import type { CommentNode } from "@/lib/github/types";
import { NextRequest, NextResponse } from "next/server";

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

// GET handler
export async function GET(_request: NextRequest, context: {params: Promise<{ discussionNumber: string; commentId: string }>}) {
  try {
    const session = await auth();
    const { commentId } = await context.params;

    const data = await callGraphQL<{
      node?: { replies?: { nodes: CommentNode[] } };
    }>(GET_REPLIES_QUERY, { commentId }, GITHUB_ACCESS_TOKEN as string);

    const replies = data.node?.replies?.nodes ?? [];
    const formattedReplies = replies.map((reply) =>
      formatComment(reply, session?.user?.name ?? undefined)
    );

    return NextResponse.json({ replies: formattedReplies });
  } catch (error: unknown) {
    console.error("Error fetching replies:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch replies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST handler
export async function POST(request: NextRequest, context: {params: Promise<{ discussionNumber: string; commentId: string }>}) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only GitHub users can post replies
    if (session.user?.provider !== "github") {
      return NextResponse.json(
        { error: "GitHub authentication required" },
        { status: 403 }
      );
    }

    const { commentId } = await context.params;
    const { body, discussionId } = (await request.json()) as {
      body: string;
      discussionId: string;
    };

    if (!body?.trim()) throw new Error("Reply body is required");
    if (!discussionId) throw new Error("Discussion ID is required");

    // Create reply
    const createData = await callGraphQL<{
      addDiscussionComment: { comment: { id: string } };
    }>(
      ADD_REPLY_MUTATION,
      { discussionId, replyToId: commentId, body },
      session.accessToken
    );

    const newCommentId = createData.addDiscussionComment.comment.id;

    // Fetch full data for new reply
    const fullData = await callGraphQL<{ node: CommentNode }>(
      GET_SINGLE_COMMENT_QUERY,
      { commentId: newCommentId },
      session.accessToken
    );

    const formatted = formatComment(
      fullData.node,
      session?.user?.name ?? undefined
    );

    return NextResponse.json({ reply: formatted });
  } catch (error: unknown) {
    console.error("Error creating reply:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create reply";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}