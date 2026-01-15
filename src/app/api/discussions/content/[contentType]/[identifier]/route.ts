// Unified Discussion API for all content types
// GET: Lookup discussion number
// POST: Create discussion if not exists
import { auth } from "@/auth";
import { BlogModel } from "@/database/models/blog-model";
import { ProjectModel } from "@/database/models/project-model";
import { SayloModel } from "@/database/models/saylo-model";
import { SiteSettingsModel } from "@/database/models/site-settings-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { BASE_DOMAIN, GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { callGraphQL } from "@/lib/github/graphql";
import { NextRequest, NextResponse } from "next/server";

const GUESTBOOK_SETTINGS_KEY = "guestbook_discussion_number";

type ContentType = "blog" | "project" | "saylo" | "guestbook";

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

// Helper to get model and find content
async function getContentAndModel(contentType: ContentType, identifier: string) {
    if (contentType === "guestbook") {
        const setting = await SiteSettingsModel.findOne({ key: GUESTBOOK_SETTINGS_KEY }).lean() as { value?: number } | null;
        return {
            model: null,
            content: setting ? { discussionNumber: setting.value } : null,
            isGuestbook: true,
        };
    }

    const Model = contentType === "blog" ? BlogModel : contentType === "project" ? ProjectModel : SayloModel;
    const content = contentType === "saylo"
        ? await Model.findById(identifier).lean() as Record<string, unknown> | null
        : await Model.findOne({ slug: identifier }).lean() as Record<string, unknown> | null;

    return { model: Model, content, isGuestbook: false };
}

// Helper to format tags
function formatTags(tags?: string[]) {
    if (!tags?.length) return "None";
    return tags.map(t => "`" + t + "`").join(", ");
}

// Helper to build discussion body
function buildDiscussionBody(contentType: ContentType, content: Record<string, unknown>, identifier: string): { title: string; body: string } {
    if (contentType === "guestbook") {
        return {
            title: "Guestbook",
            body: `📝 **Guestbook**\n\nLeave whatever you want to say - messages, appreciation, suggestions, or feedback!\n\n---\n*Please keep the conversation respectful and friendly.*`,
        };
    }

    const contentUrl = contentType === "saylo"
        ? `https://${BASE_DOMAIN}/saylo/${identifier}`
        : `https://${BASE_DOMAIN}/${contentType}s/${identifier}`;

    if (contentType === "blog") {
        const blog = content as {
            type?: string;
            title: string;
            excerpt?: string;
            tags?: string[];
            imageSrc?: string;
            content?: string;
            date?: Date;
        };

        const publishedDate = blog.date ? new Date(blog.date).toLocaleDateString() : "N/A";

        return {
            title: `[Blog] ${blog.title}`,
            body: `# ${blog.title}

## Details

| Field | Value |
|-------|-------|
| **Type** | ${blog.type || "Blog"} |
| **URL** | [View Blog](${contentUrl}) |
| **Published** | ${publishedDate} |
| **Tags** | ${formatTags(blog.tags)} |

## Excerpt

> ${blog.excerpt || "No excerpt available."}

![Cover Image](${blog.imageSrc || ""})

## Content

<details>
<summary>Click to expand full content</summary>

${blog.content || "No content available."}

</details>

---

💬 **Leave your comments below!**

*Please keep the conversation respectful and on-topic.*`,
        };
    }

    if (contentType === "project") {
        const project = content as {
            title: string;
            excerpt?: string;
            categories?: string;
            company?: string;
            duration?: string;
            status?: string;
            tags?: string[];
            imageSrc?: string;
            liveUrl?: string;
            githubUrl?: string;
            content?: string;
            date?: Date;
        };

        const publishedDate = project.date ? new Date(project.date).toLocaleDateString() : "N/A";
        const liveUrlText = project.liveUrl ? `[Visit](${project.liveUrl})` : "N/A";
        const githubUrlText = project.githubUrl ? `[Repository](${project.githubUrl})` : "N/A";

        return {
            title: `[Project] ${project.title}`,
            body: `# ${project.title}

## Details

| Field | Value |
|-------|-------|
| **Category** | ${project.categories || "Project"} |
| **Company** | ${project.company || "N/A"} |
| **Duration** | ${project.duration || "N/A"} |
| **Status** | ${project.status || "N/A"} |
| **URL** | [View Project](${contentUrl}) |
| **Live URL** | ${liveUrlText} |
| **GitHub** | ${githubUrlText} |
| **Published** | ${publishedDate} |
| **Tags** | ${formatTags(project.tags)} |

## Excerpt

> ${project.excerpt || "No excerpt available."}

![Cover Image](${project.imageSrc || ""})

## Content

<details>
<summary>Click to expand full content</summary>

${project.content || "No content available."}

</details>

---

💬 **Leave your comments below!**

*Please keep the conversation respectful and on-topic.*`,
        };
    }

    // Saylo
    const saylo = content as {
        content: string;
        category?: string;
        images?: string[];
        videos?: string[];
        createdAt?: Date;
    };

    const publishedDate = saylo.createdAt ? new Date(saylo.createdAt).toLocaleDateString() : "N/A";
    const mediaCount = (saylo.images?.length || 0) + (saylo.videos?.length || 0);
    const titlePreview = saylo.content.slice(0, 50) + (saylo.content.length > 50 ? "..." : "");

    return {
        title: `[Saylo] ${titlePreview}`,
        body: `# Saylo Post

## Details

| Field | Value |
|-------|-------|
| **Category** | ${saylo.category || "General"} |
| **URL** | [View Post](${contentUrl}) |
| **Published** | ${publishedDate} |
| **Media** | ${mediaCount > 0 ? `${mediaCount} attachment(s)` : "None"} |

## Content

${saylo.content}

---

💬 **Leave your comments below!**

*Please keep the conversation respectful and on-topic.*`,
    };
}

// GET - Lookup discussion number for any content type
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ contentType: string; identifier: string }> }
) {
    try {
        const { contentType, identifier } = await context.params;

        // Validate content type
        if (!["blog", "project", "saylo", "guestbook"].includes(contentType)) {
            return NextResponse.json(
                { error: "Invalid content type" },
                { status: 400 }
            );
        }

        await dbConnect();

        const { content } = await getContentAndModel(contentType as ContentType, identifier);

        if (!content) {
            return NextResponse.json({
                discussionNumber: null,
                exists: false,
            });
        }

        const discussionNumber = content.discussionNumber as number | null;

        return NextResponse.json({
            discussionNumber: discussionNumber || null,
            exists: !!discussionNumber,
        });
    } catch (error: unknown) {
        console.error("Error fetching discussion:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch discussion";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST - Create discussion for any content type
export async function POST(
    _req: NextRequest,
    context: { params: Promise<{ contentType: string; identifier: string }> }
) {
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

        const { contentType, identifier } = await context.params;

        // Validate content type
        if (!["blog", "project", "saylo", "guestbook"].includes(contentType)) {
            return NextResponse.json(
                { error: "Invalid content type" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user is allowed to start conversations
        const isAdmin = await checkIsAdmin();
        const setting = await SiteSettingsModel.findOne({ key: "allowAnyUserStartConversation" }).lean() as { value?: boolean } | null;
        const allowAnyUser = setting?.value ?? true;

        if (!allowAnyUser && !isAdmin) {
            return NextResponse.json(
                { error: "Only admins can start conversations" },
                { status: 403 }
            );
        }

        const { model, content, isGuestbook } = await getContentAndModel(contentType as ContentType, identifier);

        // For non-guestbook, content must exist
        if (!isGuestbook && !content) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }

        // Check if discussion already exists
        const existingDiscussionNumber = content?.discussionNumber as number | null;
        if (existingDiscussionNumber) {
            return NextResponse.json({
                discussionNumber: existingDiscussionNumber,
                alreadyExists: true,
            });
        }

        // Get repository info using user's token
        const repoInfo = await callGraphQL<RepoInfoData>(
            GET_REPO_INFO_QUERY,
            { owner: GITHUB_REPO_OWNER, name: GITHUB_REPO_NAME },
            session.accessToken
        );

        // Find the "Comments" category, or fall back to "General"
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

        // Build discussion content
        const { title, body } = buildDiscussionBody(
            contentType as ContentType,
            content || {},
            identifier
        );

        // Create the discussion
        const discussionData = await callGraphQL<CreateDiscussionData>(
            CREATE_DISCUSSION_MUTATION,
            {
                repositoryId: repoInfo.repository.id,
                categoryId: category.id,
                title,
                body,
            },
            session.accessToken
        );

        const discussionNumber = discussionData.createDiscussion.discussion.number;

        // Save discussion number to appropriate location
        if (isGuestbook) {
            await SiteSettingsModel.findOneAndUpdate(
                { key: GUESTBOOK_SETTINGS_KEY },
                {
                    key: GUESTBOOK_SETTINGS_KEY,
                    value: discussionNumber,
                    description: "Guestbook GitHub Discussion number"
                },
                { upsert: true, new: true }
            );
        } else if (model) {
            if (contentType === "saylo") {
                await model.findByIdAndUpdate(identifier, { discussionNumber }, { new: true });
            } else {
                await model.findOneAndUpdate({ slug: identifier }, { discussionNumber }, { new: true });
            }
        }

        return NextResponse.json({
            discussionNumber,
            discussionId: discussionData.createDiscussion.discussion.id,
            discussionUrl: discussionData.createDiscussion.discussion.url,
            alreadyExists: false,
        });
    } catch (error: unknown) {
        console.error("Error creating discussion:", error);
        const message = error instanceof Error ? error.message : "Failed to create discussion";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
