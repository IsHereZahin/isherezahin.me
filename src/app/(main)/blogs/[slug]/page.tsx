// src/app/(main)/blogs/[slug]/page.tsx
import BlogDetailsIndex from "@/components/pages/BlogDetailsIndex";
import { BlogModel } from "@/database/models/blog-model";
import dbConnect from "@/database/services/mongo";
import { BASE_DOMAIN, MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

interface BlogPostPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const blog = await BlogModel.findOne({ slug, published: true }).lean();

    if (!blog) {
        return {
            title: "Blog Not Found",
        };
    }

    const title = `${blog.title} | ${MY_FULL_NAME}`;
    const description = blog.excerpt;
    const url = `https://${BASE_DOMAIN}/blogs/${slug}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            type: "article",
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
            title,
            description,
            images: [blog.imageSrc],
        },
    };
}

export default async function BlogPostPage({ params }: Readonly<BlogPostPageProps>) {
    const { slug } = await params;

    return <BlogDetailsIndex slug={slug} />;
}