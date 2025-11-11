"use client";

import { getBlogs } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Article, { Blog } from "../Article";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import SeeMore from "../ui/SeeMore";

export default function Blogs() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blogs", 1], // page 1
        queryFn: () => getBlogs(1, 2), // latest 2 blogs
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error instanceof Error ? error.message : "Something went wrong"}</div>;

    return (
        <Section id="blogs" animate={true}>
            <SectionHeader title="Blogs" subtitle="Thoughts on what I'm learning and building in web development" />
            <div className="space-y-8">
                {data.blogs.map((blog: Blog) => (
                    <Article key={blog.id} {...blog} />
                ))}
            </div>
            <div className="flex justify-center">
                <SeeMore href="/blogs" text="See all blogs" className="mt-16" />
            </div>
        </Section>
    );
}