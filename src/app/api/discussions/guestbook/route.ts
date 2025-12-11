// src/app/api/discussions/guestbook/route.ts
import { auth } from "@/auth";
import { SiteSettingsModel } from "@/database/models/site-settings-model";
import dbConnect from "@/database/services/mongo";
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { callGraphQL } from "@/lib/github/graphql";
import { NextRequest, NextResponse } from "next/server";

const GUESTBOOK_SETTINGS_KEY = "guestbook_discussion_number";

// Query to get repository ID and discussion category ID
const GET_REPO_INFO_QUERY = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      discussionCategories(first: 10) {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;

// Mutation to create a new discussion
const CREATE_DISCUSSION_MUTATION = `
  mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
    createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) {
      discussion {
        id
        number
        url
      }
    }
  }
`;

interface RepoInfoData {
    repository: {
        id: string;
        discussionCategories: {
            nodes: Array<{
                id: string;
                name: string;
                slug: string;
            }>;
        };
    };
}

interface CreateDiscussionData {
    createDiscussion: {
        discussion: {
            id: string;
            number: number;
            url: string;
        };
    };
}

// GET - Get the guestbook discussion number
export async function GET() {
    try {
        await dbConnect();

        const setting = await SiteSettingsModel.findOne({ key: GUESTBOOK_SETTINGS_KEY }).lean() as { value?: number } | null;

        if (setting?.value) {
            return NextResponse.json({
                discussionNumber: setting.value,
                exists: true,
            });
        }

        return NextResponse.json({
            discussionNumber: null,
            exists: false,
        });
    } catch (error: unknown) {
        console.error("Error fetching guestbook discussion:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch guestbook discussion";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST - Create the guestbook discussion
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only GitHub users can create discussions
        if (session.user?.provider !== "github") {
            return NextResponse.json(
                { error: "GitHub authentication required" },
                { status: 403 }
            );
        }

        await dbConnect();

        // Check if discussion already exists
        const existingSetting = await SiteSettingsModel.findOne({ key: GUESTBOOK_SETTINGS_KEY }).lean() as { value?: number } | null;

        if (existingSetting?.value) {
            return NextResponse.json({
                discussionNumber: existingSetting.value,
                alreadyExists: true,
            });
        }

        // Get repository info using user's token
        const repoInfo = await callGraphQL<RepoInfoData>(
            GET_REPO_INFO_QUERY,
            { owner: GITHUB_REPO_OWNER, name: GITHUB_REPO_NAME },
            session.accessToken
        );

        // Find the "Comments" or "General" category
        const categories = repoInfo.repository.discussionCategories.nodes;
        let category = categories.find(
            (c) => c.slug === "comments" || c.name.toLowerCase() === "comments"
        );
        if (!category) {
            category = categories.find(
                (c) => c.slug === "general" || c.name.toLowerCase() === "general"
            );
        }
        if (!category) {
            category = categories[0];
        }

        if (!category) {
            return NextResponse.json(
                { error: "No discussion category found in repository" },
                { status: 500 }
            );
        }

        // Create the guestbook discussion
        const discussionBody = `📝 **Guestbook**\n\nLeave whatever you want to say - messages, appreciation, suggestions, or feedback!\n\n---\n*Please keep the conversation respectful and friendly.*`;

        const discussionData = await callGraphQL<CreateDiscussionData>(
            CREATE_DISCUSSION_MUTATION,
            {
                repositoryId: repoInfo.repository.id,
                categoryId: category.id,
                title: "Guestbook",
                body: discussionBody,
            },
            session.accessToken
        );

        const discussionNumber = discussionData.createDiscussion.discussion.number;

        // Save the discussion number to database
        await SiteSettingsModel.findOneAndUpdate(
            { key: GUESTBOOK_SETTINGS_KEY },
            { 
                key: GUESTBOOK_SETTINGS_KEY, 
                value: discussionNumber,
                description: "Guestbook GitHub Discussion number"
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            discussionNumber,
            discussionId: discussionData.createDiscussion.discussion.id,
            discussionUrl: discussionData.createDiscussion.discussion.url,
            alreadyExists: false,
        });
    } catch (error: unknown) {
        console.error("Error creating guestbook discussion:", error);
        const message = error instanceof Error ? error.message : "Failed to create guestbook discussion";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
