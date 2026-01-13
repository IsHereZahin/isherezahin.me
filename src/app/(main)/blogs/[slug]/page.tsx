// src/app/(main)/blogs/[slug]/page.tsx
import BlogDetailsIndex from "@/components/pages/BlogDetailsIndex";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCachedBlog } from "@/lib/cached-queries";
import { PERSON, TWITTER, getFullUrl, getBreadcrumbs } from "@/config/seo.config";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getCachedBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  const title = blog.title;
  const description = blog.excerpt;
  const url = getFullUrl(`/blogs/${slug}`);

  return {
    title,
    description,
    keywords: blog.tags,
    authors: [{ name: PERSON.name.full, url: getFullUrl() }],
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: blog.date?.toISOString(),
      modifiedTime: blog.updatedAt?.toISOString(),
      authors: [PERSON.name.full],
      tags: blog.tags,
      images: [
        {
          url: blog.imageSrc,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER.site,
      creator: TWITTER.creator,
      title,
      description,
      images: [blog.imageSrc],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({
  params,
}: Readonly<BlogPostPageProps>) {
  const { slug } = await params;
  const blog = await getCachedBlog(slug);

  return (
    <>
      {blog && (
        <>
          <BlogJsonLd
            title={blog.title}
            description={blog.excerpt}
            image={blog.imageSrc}
            datePublished={blog.date?.toISOString() || new Date().toISOString()}
            dateModified={blog.updatedAt?.toISOString()}
            slug={slug}
            tags={blog.tags}
          />
          <BreadcrumbJsonLd
            items={getBreadcrumbs([
              { name: "Blog", path: "/blogs" },
              { name: blog.title, path: `/blogs/${slug}` },
            ])}
          />
        </>
      )}
      <BlogDetailsIndex slug={slug} />
    </>
  );
}
