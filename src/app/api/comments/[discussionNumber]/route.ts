// src/app/api/comments/[discussionNumber]/route.ts
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const REPO_NAME = process.env.GITHUB_REPO_NAME!;
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

if (!GITHUB_ACCESS_TOKEN) throw new Error("Missing GitHub access token");

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

interface CommentNode {
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
    replies: {
        totalCount: number;
    };
}

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

// Reaction mapping
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

// GraphQL Helper
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

// Format Reactions
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

    const reaction_users = reactionsNodes.map((r) => ({
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
            if (r.user.login === sessionUserLogin) userReaction = mapped;
        }
    });

    return { reactions, user_reaction: userReaction, reaction_users };
}

// GET Handler
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ discussionNumber: string }> }
) {
    try {
        const session = await auth();
        const { discussionNumber: discussionNumberStr } = await context.params;
        const discussionNumber = parseInt(discussionNumberStr);

        const data = await callGraphQL<DiscussionData>(
            GET_DISCUSSION_QUERY,
            { owner: REPO_OWNER, name: REPO_NAME, number: discussionNumber },
            GITHUB_ACCESS_TOKEN as string
        );

        if (!data.repository?.discussion) {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
        }

        const comments = data.repository.discussion.comments.nodes;

        const formattedComments = comments.map((comment) => {
            const { reactions, user_reaction, reaction_users } = formatReactions(
                comment.reactions.nodes,
                session?.user?.name ?? undefined
            );

            return {
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
                is_owner: (comment.author?.login ?? "").toLowerCase() === REPO_OWNER.toLowerCase(),
                replies: [],
                reply_count: comment.replies.totalCount,
            };
        });

        return NextResponse.json({
            comments: formattedComments,
            discussionId: data.repository.discussion.id,
        });
    } catch (error: unknown) {
        console.error("Error fetching discussion comments:", error);
        const message =
            error instanceof Error ? error.message : "Failed to fetch discussion comments!";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST Handler
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ discussionNumber: string }> }
) {
    try {
        const session = await auth();
        if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { discussionNumber: discussionNumberStr } = await context.params;
        const discussionNumber = parseInt(discussionNumberStr);

        const { body, discussionId } = (await request.json()) as { body: string; discussionId?: string };

        if (!body?.trim()) return NextResponse.json({ error: "Comment body is required" }, { status: 400 });

        let finalDiscussionId = discussionId;
        if (!finalDiscussionId) {
            const data = await callGraphQL<DiscussionData>(
                GET_DISCUSSION_QUERY,
                { owner: REPO_OWNER, name: REPO_NAME, number: discussionNumber },
                session.accessToken
            );
            finalDiscussionId = data.repository.discussion.id;
        }

        const data = await callGraphQL<{ addDiscussionComment: { comment: { id: string; body: string; createdAt: string } } }>(
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

// DELETE Handler
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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