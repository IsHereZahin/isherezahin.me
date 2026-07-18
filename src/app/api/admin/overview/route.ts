import { BlogModel } from "@/database/models/blog-model";
import { ContactMessageModel } from "@/database/models/contact-message-model";
import { ProjectModel } from "@/database/models/project-model";
import { SubscriberModel } from "@/database/models/subscriber-model";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

interface SumRow {
    views?: number;
    likes?: number;
}

interface TopDoc {
    title: string;
    slug: string;
    views?: number;
    likes?: number;
}

const sumOf = (rows: SumRow[], key: "views" | "likes") => rows[0]?.[key] ?? 0;

/**
 * Consolidated business/application metrics for the admin dashboard. Admin-only.
 * Kept separate from `/api/statistics` (visitor analytics) so the two data
 * sources load and fail independently on the client.
 */
export async function GET() {
    try {
        await dbConnect();

        if (!(await checkIsAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const [
            usersTotal,
            usersBanned,
            usersNewThisWeek,
            usersGithub,
            usersGoogle,
            subsTotal,
            subsActive,
            subsNewThisWeek,
            blogsTotal,
            blogsPublished,
            projectsTotal,
            projectsPublished,
            blogSums,
            projectSums,
            topBlogs,
            topProjects,
            messagesTotal,
            messagesUnread,
        ] = await Promise.all([
            UserModel.countDocuments({}),
            UserModel.countDocuments({ isBanned: true }),
            UserModel.countDocuments({ createdAt: { $gte: weekAgo } }),
            UserModel.countDocuments({ provider: "github" }),
            UserModel.countDocuments({ provider: "google" }),
            SubscriberModel.countDocuments({}),
            SubscriberModel.countDocuments({ isActive: true }),
            SubscriberModel.countDocuments({ subscribedAt: { $gte: weekAgo } }),
            BlogModel.countDocuments({}),
            BlogModel.countDocuments({ published: true }),
            ProjectModel.countDocuments({}),
            ProjectModel.countDocuments({ published: true }),
            BlogModel.aggregate<SumRow>([
                { $group: { _id: null, views: { $sum: "$views" }, likes: { $sum: "$likes" } } },
            ]),
            ProjectModel.aggregate<SumRow>([
                { $group: { _id: null, views: { $sum: "$views" }, likes: { $sum: "$likes" } } },
            ]),
            BlogModel.find({}).sort({ views: -1 }).limit(5).select("title slug views likes").lean<TopDoc[]>(),
            ProjectModel.find({}).sort({ views: -1 }).limit(5).select("title slug views likes").lean<TopDoc[]>(),
            ContactMessageModel.countDocuments({}),
            ContactMessageModel.countDocuments({ isRead: false }),
        ]);

        const blogViews = sumOf(blogSums, "views");
        const projectViews = sumOf(projectSums, "views");
        const blogLikes = sumOf(blogSums, "likes");
        const projectLikes = sumOf(projectSums, "likes");

        const top = [
            ...topBlogs.map((b) => ({ title: b.title, slug: b.slug, type: "Blog" as const, views: b.views ?? 0, likes: b.likes ?? 0 })),
            ...topProjects.map((p) => ({ title: p.title, slug: p.slug, type: "Project" as const, views: p.views ?? 0, likes: p.likes ?? 0 })),
        ]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

        return NextResponse.json({
            users: {
                total: usersTotal,
                active: usersTotal - usersBanned,
                banned: usersBanned,
                newThisWeek: usersNewThisWeek,
                github: usersGithub,
                google: usersGoogle,
            },
            subscribers: {
                total: subsTotal,
                active: subsActive,
                inactive: subsTotal - subsActive,
                newThisWeek: subsNewThisWeek,
            },
            content: {
                blogs: { total: blogsTotal, published: blogsPublished, draft: blogsTotal - blogsPublished },
                projects: { total: projectsTotal, published: projectsPublished, draft: projectsTotal - projectsPublished },
                totalViews: blogViews + projectViews,
                totalLikes: blogLikes + projectLikes,
                top,
            },
            messages: {
                total: messagesTotal,
                unread: messagesUnread,
            },
        });
    } catch (error) {
        console.error("Error fetching admin overview:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
