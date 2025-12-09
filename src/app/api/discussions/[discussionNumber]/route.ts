// src/app/api/discussions/[discussionNumber]/route.ts
import { auth } from "@/auth";
import { GITHUB_ACCESS_TOKEN, GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { formatComment } from "@/lib/github/formatters";
import { callGraphQL } from "@/lib/github/graphql";
import type { CommentNode } from "@/lib/github/types";
import { NextRequest, NextResponse } from "next/server";

// GraphQL Queries & Mutations
const GET_DISCUSSION_QUERY = `
  query($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      discussion(number: $number) {
        id
        comments(first: 100) {
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
            replies(first: 100) {
              totalCount
            }
          }
        }
      }
    }
  }
`;

const ADD_COMMENT_MUTATION = `
  mutation($discussionId: ID!, $body: String!) {
    addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
      comment {
        id
        body
        createdAt
      }
    }
  }
`;

const DELETE_COMMENT_MUTATION = `
  mutation($commentId: ID!) {
    deleteDiscussionComment(input: {id: $commentId}) {
      comment {
        id
      }
    }
  }
`;

interface DiscussionData {
  repository: {
    discussion: {
      id: string;
      comments: {
        nodes: CommentNode[];
      };
    };
  };
}

// GET all comments for a discussion
export async function GET(_request: NextRequest, context: { params: Promise<{ discussionNumber: string }> }) {
  try {
    const session = await auth();
    const { discussionNumber: discussionNumberStr } = await context.params;
    const discussionNumber = parseInt(discussionNumberStr);

    const data = await callGraphQL<DiscussionData>(
      GET_DISCUSSION_QUERY,
      { owner: GITHUB_REPO_OWNER, name: GITHUB_REPO_NAME, number: discussionNumber },
      GITHUB_ACCESS_TOKEN as string
    );

    if (!data.repository?.discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    const comments = data.repository.discussion.comments.nodes;
    const formattedComments = comments.map((comment) =>
      formatComment(comment, session?.user?.name ?? undefined, {
        includeReplyCount: true,
      })
    );

    return NextResponse.json({
      comments: formattedComments,
      discussionId: data.repository.discussion.id,
    });
  } catch (error: unknown) {
    console.error("Error fetching discussion comments:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch discussion comments!";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST a new comment
export async function POST(request: NextRequest, context: { params: Promise<{ discussionNumber: string }> }) {
  try {
    const session = await auth();
    if (!session?.accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only GitHub users can post comments
    if (session.user?.provider !== "github") {
      return NextResponse.json(
        { error: "GitHub authentication required" },
        { status: 403 }
      );
    }

    const { discussionNumber: discussionNumberStr } = await context.params;
    const discussionNumber = parseInt(discussionNumberStr);

    const { body, discussionId } = (await request.json()) as {
      body: string;
      discussionId?: string;
    };

    if (!body?.trim())
      return NextResponse.json(
        { error: "Comment body is required" },
        { status: 400 }
      );

    let finalDiscussionId = discussionId;
    if (!finalDiscussionId) {
      const data = await callGraphQL<DiscussionData>(
        GET_DISCUSSION_QUERY,
        { owner: GITHUB_REPO_OWNER, name: GITHUB_REPO_NAME, number: discussionNumber },
        session.accessToken
      );
      finalDiscussionId = data.repository.discussion.id;
    }

    const data = await callGraphQL<{
      addDiscussionComment: {
        comment: { id: string; body: string; createdAt: string };
      };
    }>(
      ADD_COMMENT_MUTATION,
      { discussionId: finalDiscussionId, body },
      session.accessToken
    );

    return NextResponse.json({ comment: data.addDiscussionComment.comment });
  } catch (error: unknown) {
    console.error("Error creating comment:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create comment!";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE a comment
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only GitHub users can delete comments
    if (session.user?.provider !== "github") {
      return NextResponse.json(
        { error: "GitHub authentication required" },
        { status: 403 }
      );
    }

    const { commentId } = (await request.json()) as { commentId: string };

    await callGraphQL(
      DELETE_COMMENT_MUTATION,
      { commentId },
      session.accessToken
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting comment:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete comment!";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}