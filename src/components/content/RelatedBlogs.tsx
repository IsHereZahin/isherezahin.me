"use client";

import Article from "@/components/Article";
import { getBlogs } from "@/lib/api";
import { Blog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "../ui";

interface RelatedBlogsProps {
    currentSlug: string;
    currentTags: string[];
    currentType: string;
}

export default function RelatedBlogs({ currentSlug, currentTags, currentType }: RelatedBlogsProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["blogs", "related"],
        queryFn: () => getBlogs(1, 20),
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <div className="mt-16">
                <h3 className="text-xl md:text-2xl font-semibold mb-6">
                    Other blogs you might like 💕
                </h3>
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse py-6 border-t border-border/30">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                <div className="flex-1">
                                    <div className="bg-neutral-800 rounded h-4 w-24 mb-3" />
                                    <div className="bg-neutral-800 rounded h-6 w-3/4 mb-3" />
                                    <div className="bg-neutral-800 rounded h-4 w-full mb-2" />
                                    <div className="bg-neutral-800 rounded h-4 w-2/3" />
                                </div>
                                <div className="bg-neutral-800 rounded-lg w-full sm:w-48 h-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data?.blogs) return null;

    // Filter related blogs based on matching tags or type, excluding current blog
    const relatedBlogs = (data.blogs as Blog[])
        .filter((blog) => blog.slug !== currentSlug && blog.published)
        .map((blog) => {
            // Calculate relevance score based on matching tags
            const matchingTags = blog.tags.filter((tag) =>
                currentTags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
            );
            const typeMatch = currentType ? 1 : 0;
            return {
                ...blog,
                score: matchingTags.length * 2 + typeMatch,
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

    if (relatedBlogs.length === 0) return null;

    return (
        <div className="mt-16">
            <SectionHeader 
                tag="3" 
                title="Related Blog Posts" 
                subtitle="Explore more articles on similar topics" 
            />
            <div>
                {relatedBlogs.map((blog) => (
                    <Article key={blog.id} {...blog} />
                ))}
            </div>
        </div>
    );
}
