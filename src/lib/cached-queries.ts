// src/lib/cached-queries.ts
"use cache";

import { BlogModel } from "@/database/models/blog-model";
import { ProjectModel } from "@/database/models/project-model";
import dbConnect from "@/database/services/mongo";

interface BlogDocument {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageSrc: string;
  tags?: string[];
  views?: number;
  likes?: number;
  type?: string;
  date?: Date;
  updatedAt?: Date;
  createdAt?: Date;
  published: boolean;
}

interface ProjectDocument {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageSrc: string;
  categories?: string;
  company?: string;
  duration?: string;
  status?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  date?: Date;
  updatedAt?: Date;
  createdAt?: Date;
  published: boolean;
}

/**
 * Get a single blog post by slug
 */
export async function getCachedBlog(slug: string): Promise<BlogDocument | null> {
  await dbConnect();
  const blog = await BlogModel.findOne({
    slug,
    published: true,
  }).lean();

  return blog as BlogDocument | null;
}

/**
 * Get a single project by slug
 */
export async function getCachedProject(slug: string): Promise<ProjectDocument | null> {
  await dbConnect();
  const project = await ProjectModel.findOne({
    slug,
    published: true,
  }).lean();

  return project as ProjectDocument | null;
}

/**
 * Get all blog tags
 */
export async function getCachedBlogTags(): Promise<string[]> {
  await dbConnect();
  const blogs = await BlogModel.find({ published: true }).select("tags").lean();
  const allTags = blogs.flatMap((blog) => blog.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}

/**
 * Get all project tags
 */
export async function getCachedProjectTags(): Promise<string[]> {
  await dbConnect();
  const projects = await ProjectModel.find({ published: true }).select("tags").lean();
  const allTags = projects.flatMap((project) => project.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}

/**
 * Get recent blogs for homepage
 */
export async function getCachedRecentBlogs(limit: number = 3): Promise<BlogDocument[]> {
  await dbConnect();
  const blogs = await BlogModel.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return blogs as unknown as BlogDocument[];
}

/**
 * Get recent projects for homepage
 */
export async function getCachedRecentProjects(limit: number = 3): Promise<ProjectDocument[]> {
  await dbConnect();
  const projects = await ProjectModel.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return projects as unknown as ProjectDocument[];
}

/**
 * First page of published blogs, shaped to match `GET /api/blog` for a
 * non-admin visitor. Used to seed the homepage section and the /blogs list so
 * they render on the server instead of fetching after hydration.
 */
export async function getPublishedBlogsPage(limit = 5) {
  await dbConnect();
  const query = { published: true };
  const total = await BlogModel.countDocuments(query);
  const docs = (await BlogModel.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .lean()) as unknown as BlogDocument[];

  const blogs = docs.map((b) => ({
    id: b._id.toString(),
    date: b.date?.toString() ?? "",
    views: b.views ?? 0,
    likes: b.likes ?? 0,
    type: b.type ?? "Blog",
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    tags: b.tags ?? [],
    imageSrc: b.imageSrc,
    content: b.content,
    published: b.published ?? true,
  }));

  return { total, page: 1, limit, blogs };
}

/**
 * First page of published projects, shaped to match `GET /api/project` for a
 * non-admin visitor. Seeds the homepage section and the /projects list.
 */
export async function getPublishedProjectsPage(limit = 5) {
  await dbConnect();
  const query = { published: true };
  const total = await ProjectModel.countDocuments(query);
  const docs = (await ProjectModel.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .lean()) as unknown as ProjectDocument[];

  const projects = docs.map((p) => ({
    id: p._id.toString(),
    date: p.date?.toString() ?? "",
    views: p.views ?? 0,
    likes: p.likes ?? 0,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    categories: p.categories ?? "Project",
    company: p.company ?? "",
    duration: p.duration ?? "",
    status: p.status ?? "completed",
    tags: p.tags ?? [],
    imageSrc: p.imageSrc,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    content: p.content,
    published: p.published ?? true,
  }));

  return { total, page: 1, limit, projects };
}

/**
 * Get blog count
 */
export async function getCachedBlogCount(): Promise<number> {
  await dbConnect();
  return BlogModel.countDocuments({ published: true });
}

/**
 * Get project count
 */
export async function getCachedProjectCount(): Promise<number> {
  await dbConnect();
  return ProjectModel.countDocuments({ published: true });
}
