import { auth } from "@/auth";
import { type NextRequest, NextResponse } from "next/server";

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

async function callGraphQL( query: string, variables: Record<string, unknown>, token: string ) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("GraphQL request failed:", response.status, text);
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}

// Mapping from frontend reaction to GitHub GraphQL enum
const reverseReactionMap: Record<string, string> = {
  "+1": "THUMBS_UP",
  "-1": "THUMBS_DOWN",
  laugh: "LAUGH",
  hooray: "HOORAY",
  confused: "CONFUSED",
  heart: "HEART",
  rocket: "ROCKET",
  eyes: "EYES",
};

interface ReactionRequestBody {
  subjectId: string;
  reaction: keyof typeof reverseReactionMap;
  hasReacted: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subjectId, reaction, hasReacted } = (await request.json()) as ReactionRequestBody;

    const reactionContent = reverseReactionMap[reaction];
    if (!reactionContent) return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });

    const mutation = hasReacted ? REMOVE_REACTION_MUTATION : ADD_REACTION_MUTATION;

    await callGraphQL(
      mutation,
      { subjectId, content: reactionContent },
      session.accessToken
    );

    return NextResponse.json({ success: true, action: hasReacted ? "removed" : "added" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to manage reaction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

