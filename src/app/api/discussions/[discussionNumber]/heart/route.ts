// src/app/api/discussions/[discussionNumber]/heart/route.ts
import { auth } from "@/auth";
import { GITHUB_ACCESS_TOKEN, GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { callGraphQL } from "@/lib/github/graphql";
import { type NextRequest, NextResponse } from "next/server";

const GET_DISCUSSION_QUERY = `
  query($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      discussion(number: $number) {
        id
        reactions(first: 100, content: HEART) {
          nodes {
            user {
              login
            }
          }
        }
      }
    }
  }
`;

const ADD_REACTION_MUTATION = `
  mutation($subjectId: ID!, $content: ReactionContent!) {
    addReaction(input: {subjectId: $subjectId, content: $content}) {
      reaction {
        content
      }
    }
  }
`;

interface DiscussionData {
  repository: {
    discussion: {
      id: string;
      reactions: {
        nodes: Array<{
          user: {
            login: string;
          };
        }>;
      };
    } | null;
  };
}

// POST handler for adding a heart reaction to a discussion
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ discussionNumber: string }> }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only GitHub users can add reactions
    if (session.user?.provider !== "github") {
      return NextResponse.json(
        { error: "GitHub authentication required", requiresGitHub: true },
        { status: 403 }
      );
    }

    const { discussionNumber: discussionNumberStr } = await context.params;
    const discussionNumber = parseInt(discussionNumberStr);

    if (isNaN(discussionNumber)) {
      return NextResponse.json(
        { error: "Invalid discussion number" },
        { status: 400 }
      );
    }

    // Get discussion ID and check if user already reacted
    const discussionData = await callGraphQL<DiscussionData>(
      GET_DISCUSSION_QUERY,
      { 
        owner: GITHUB_REPO_OWNER, 
        name: GITHUB_REPO_NAME, 
        number: discussionNumber 
      },
      GITHUB_ACCESS_TOKEN as string
    );

    if (!discussionData.repository?.discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    const discussionId = discussionData.repository.discussion.id;
    const userLogin = session.user?.name;

    // Check if user already reacted with HEART
    const hasReacted = discussionData.repository.discussion.reactions.nodes.some(
      (node) => node.user.login === userLogin
    );

    if (hasReacted) {
      return NextResponse.json({
        success: true,
        alreadyReacted: true,
        message: "You've already added a heart reaction to this discussion",
      });
    }

    // Add HEART reaction
    await callGraphQL(
      ADD_REACTION_MUTATION,
      { subjectId: discussionId, content: "HEART" },
      session.accessToken
    );

    return NextResponse.json({
      success: true,
      alreadyReacted: false,
      message: "Heart reaction added to discussion",
    });
  } catch (err: unknown) {
    console.error("Error adding heart reaction:", err);
    const message =
      err instanceof Error ? err.message : "Failed to add heart reaction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
