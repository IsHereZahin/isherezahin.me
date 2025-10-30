// src/app/api/discussions/[discussionNumber]/reactions/route.ts
import { auth } from "@/auth";
import { type NextRequest, NextResponse } from "next/server";
import { callGraphQL } from "@/lib/github/graphql";
import { REACTION_MAP_REVERSE } from "@/lib/github/reactions";

const ADD_REACTION_MUTATION = `
  mutation($subjectId: ID!, $content: ReactionContent!) {
    addReaction(input: {subjectId: $subjectId, content: $content}) {
      reaction {
        content
      }
    }
  }
`;

const REMOVE_REACTION_MUTATION = `
  mutation($subjectId: ID!, $content: ReactionContent!) {
    removeReaction(input: {subjectId: $subjectId, content: $content}) {
      reaction {
        content
      }
    }
  }
`;

interface ReactionRequestBody {
  subjectId: string;
  reaction: keyof typeof REACTION_MAP_REVERSE;
  hasReacted: boolean;
}

// POST handler for managing reactions
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectId, reaction, hasReacted } =
      (await request.json()) as ReactionRequestBody;

    const reactionContent = REACTION_MAP_REVERSE[reaction];
    if (!reactionContent) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    const mutation = hasReacted
      ? REMOVE_REACTION_MUTATION
      : ADD_REACTION_MUTATION;

    await callGraphQL(
      mutation,
      { subjectId, content: reactionContent },
      session.accessToken
    );

    return NextResponse.json({
      success: true,
      action: hasReacted ? "removed" : "added",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to manage reaction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}