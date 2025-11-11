// src/app/(main)/blogs/[slug]/page.tsx
import BlogDetailsIndex from "@/components/pages/BlogDetailsIndex"

interface BlogPostPageProps {
    params: { slug: string }
}

export default async function BlogPostPage({ params }: Readonly<BlogPostPageProps>) {
    const { slug } = await params

    return <BlogDetailsIndex slug={slug} />
}