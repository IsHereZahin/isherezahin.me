"use client";

import Article from "@/components/Article";
import {
    BlogsLoading,
    Section,
    SectionHeader,
    SeeMore,
} from "@/components/ui";
import { getBlogs } from "@/lib/api";
import { Blog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

interface BlogsPage {
    total: number;
    page: number;
    limit: number;
    blogs: Blog[];
}

export default function Blogs({ initialData }: { readonly initialData?: BlogsPage }) {
    const page = 1;
    const limit = 2;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["blogs", page, limit],
        queryFn: () => getBlogs(page, limit),
        staleTime: 1000 * 60 * 5,
        initialData,
    });

    // Don't render anything if there's an error
    if (isError) return null;

    const hasBlogs = !isLoading && data?.blogs && data.blogs.length > 0;

    // Nothing to show once loading completes with no blogs.
    if (!isLoading && !hasBlogs) return null;

    return (
        <Section id="blogs" animate={true}>
            <SectionHeader tag="02" title="Blogs" subtitle="Thoughts on what I'm learning and building in web development" />

            {isLoading ? (
                <BlogsLoading count={2} />
            ) : (
                <>
                    <div className="space-y-6 sm:space-y-8">
                        {data.blogs.map((blog: Blog) => (
                            <Article key={blog.id} {...blog} />
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <SeeMore href="/blogs" text="See all blogs" className="mt-16" />
                    </div>
                </>
            )}
        </Section>
    );
}
