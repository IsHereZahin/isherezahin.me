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
