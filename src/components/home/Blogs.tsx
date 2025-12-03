"use client";

import { getBlogs } from "@/lib/api";
import { Blog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Article from "../Article";
import { BlogsLoading } from "../ui/Loading";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import SeeMore from "../ui/SeeMore";

export default function Blogs() {
    const page = 1;
    const limit = 2;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blogs", page, limit],
        queryFn: () => getBlogs(page, limit),
        staleTime: 1000 * 60 * 5,
    });

    // Don't render anything if there's an error or no blogs
    if (isError) return null;

    // Don't render if loading is complete and there are no blogs
    if (!isLoading && (!data?.blogs || data.blogs.length === 0)) {
        return null;
    }

    return (
        <Section id="blogs" animate={true}>
            <SectionHeader tag="02" title="Blogs" subtitle="Thoughts on what I'm learning and building in web development" />

            {isLoading ? (
                <BlogsLoading count={2} />
            ) : (
                <div className="space-y-6 sm:space-y-8">
                    {data.blogs.map((blog: Blog) => (
                        <Article key={blog.id} {...blog} />
                    ))}
                </div>
            )}
            <div className="flex justify-center">
                <SeeMore href="/blogs" text="See all blogs" className="mt-16" />
            </div>
        </Section>
    );
}