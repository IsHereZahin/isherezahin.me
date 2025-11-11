"use client";

import Article from "@/components/Article";
import MotionWrapper from "@/components/motion/MotionWrapper";
import PageTitle from "@/components/ui/PageTitle";
import Section from "@/components/ui/Section";
import Tags from "@/components/ui/Tags";
import { getBlogs } from "@/lib/api";
import { Blog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { BlogsLoading } from "../ui/Loading";

export default function BlogIndex() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blogs", 1], // first page
        queryFn: () => getBlogs(1, 10), // fetch 10 blogs
        staleTime: 1000 * 60 * 5,
    });

    if (isError) return <div>Error: {error instanceof Error ? error.message : "Something went wrong"}</div>;

    return (
        <Section id="blogs">
            <PageTitle
                title="Ideas, insights, & inspiration"
                subtitle="Thoughts on web design, freelancing, and creative growth, shared to inform, encourage, and spark new perspectives"
            />
            <MotionWrapper direction="left" delay={0.2}>
                <Tags
                    tags={["nextjs", "react", "css", "tailwind", "javascript", "typescript", "css"]}
                    selected={["nextjs", "css", "react"]}
                    clickableTags={["nextjs", "css", "react", "tailwind"]}
                    onTagClick={(tag) => console.log("Clicked tag:", tag)}
                    className="mb-4"
                />
            </MotionWrapper>

            {isLoading ? (
                <BlogsLoading count={5} />
            ) : (
                <div className="space-y-8">
                    {data?.blogs.map((blog: Blog) => (
                        <Article key={blog.id} {...blog} />
                    ))}
                </div>
            )}
        </Section>
    );
}
