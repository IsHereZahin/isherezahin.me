// src/app/api/discussions/create/route.ts
import { auth } from "@/auth";
import { BlogModel } from "@/database/models/blog-model";
import { ProjectModel } from "@/database/models/project-model";
import { SiteSettingsModel } from "@/database/models/site-settings-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { BASE_DOMAIN, GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { callGraphQL } from "@/lib/github/graphql";
import { NextRequest, NextResponse } from "next/server";

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

    const { contentType, slug, title } = (await request.json()) as {
      contentType: "blog" | "project";
      slug: string;
      title: string;
    };

    if (!contentType || !slug || !title) {
      return NextResponse.json(
        { error: "contentType, slug, and title are required" },
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

    // Check if discussion already exists and get full content data
    const Model = contentType === "blog" ? BlogModel : ProjectModel;
    const content = await Model.findOne({ slug }).lean() as Record<string, unknown> | null;

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    if (content.discussionNumber) {
      return NextResponse.json({
        discussionNumber: content.discussionNumber,
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
      category = categories[0]; // Fall back to first category
    }

    if (!category) {
      return NextResponse.json(
        { error: "No discussion category found in repository" },
        { status: 500 }
      );
    }

    // Create the discussion using user's OAuth token
    const contentUrl = `https://${BASE_DOMAIN}/${contentType}s/${slug}`;
    
    // Helper to format tags
    const formatTags = (tags?: string[]) => {
      if (!tags?.length) return "None";
      return tags.map(t => "`" + t + "`").join(", ");
    };
    
    // Build discussion body with all important content data
    let discussionBody = "";
    
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
      
      discussionBody = `# ${blog.title}

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

*Please keep the conversation respectful and on-topic.*`;
    } else {
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
      
      discussionBody = `# ${project.title}

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

##  Content

<details>
<summary>Click to expand full content</summary>

${project.content || "No content available."}

</details>

---

💬 **Leave your comments below!**

*Please keep the conversation respectful and on-topic.*`;
    }

    const discussionData = await callGraphQL<CreateDiscussionData>(
      CREATE_DISCUSSION_MUTATION,
      {
        repositoryId: repoInfo.repository.id,
        categoryId: category.id,
        title: `[${contentType === "blog" ? "Blog" : "Project"}] ${title}`,
        body: discussionBody,
      },
      session.accessToken
    );

    const discussionNumber = discussionData.createDiscussion.discussion.number;

    // Update the content with the discussion number
    await Model.findOneAndUpdate(
      { slug },
      { discussionNumber },
      { new: true }
    );

    return NextResponse.json({
      discussionNumber,
      discussionId: discussionData.createDiscussion.discussion.id,
      discussionUrl: discussionData.createDiscussion.discussion.url,
      alreadyExists: false,
    });
  } catch (error: unknown) {
    console.error("Error creating discussion:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create discussion";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
