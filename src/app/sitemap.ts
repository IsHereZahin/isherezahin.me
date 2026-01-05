import { MetadataRoute } from "next";
import { getFullUrl } from "@/config/seo.config";
import dbConnect from "@/database/services/mongo";
import { BlogModel } from "@/database/models/blog-model";
import { ProjectModel } from "@/database/models/project-model";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getFullUrl(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getFullUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: getFullUrl("/blogs"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: getFullUrl("/projects"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: getFullUrl("/uses"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getFullUrl("/guestbook"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: getFullUrl("/bucket-list"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: getFullUrl("/side-quests"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: getFullUrl("/statistics"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.4,
    },
    {
      url: getFullUrl("/attribution"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: getFullUrl("/privacy-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: getFullUrl("/terms-of-service"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Fetch published blogs
  const blogs = await BlogModel.find(
    { published: true },
    { slug: 1, updatedAt: 1 }
  ).lean();

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: getFullUrl(`/blogs/${blog.slug}`),
    lastModified: blog.updatedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Fetch published projects
  const projects = await ProjectModel.find(
    { published: true },
    { slug: 1, updatedAt: 1 }
  ).lean();

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: getFullUrl(`/projects/${project.slug}`),
    lastModified: project.updatedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}
