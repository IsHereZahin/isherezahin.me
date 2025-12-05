"use client";

import AddBlogModal from "@/components/admin/AddBlogModal";
import Article from "@/components/Article";
import MotionWrapper from "@/components/motion/MotionWrapper";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import PageTitle from "@/components/ui/PageTitle";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/shadcn-button";
import Tags from "@/components/ui/Tags";
import { getBlogs } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Blog } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FilePlus, Plus } from "lucide-react";
import { useState } from "react";
import { BlogsLoading } from "../ui/Loading";

export default function BlogIndex() {
    const queryClient = useQueryClient();
    const { isAdmin } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["blogs", 1], // first page
        queryFn: () => getBlogs(1, 10), // fetch 10 blogs
        staleTime: 1000 * 60 * 5,
    });

    if (isError) {
        return (
            <Section id="blogs">
                <PageTitle
                    title="Ideas, insights, & inspiration"
                    subtitle="Thoughts on web design, freelancing, and creative growth, shared to inform, encourage, and spark new perspectives"
                />
                <ErrorState
                    title="Failed to load blogs"
                    message={error instanceof Error ? error.message : "We couldn't load the blog posts. Please check your connection and try again."}
                    onRetry={() => refetch()}
                />
            </Section>
        );
    }

    const hasBlogs = data?.blogs && data.blogs.length > 0;

    return (
        <Section id="blogs">
            {/* Only show PageTitle if there are blogs or still loading */}
            {(isLoading || hasBlogs) && (
                <PageTitle
                    title="Ideas, insights, & inspiration"
                    subtitle="Thoughts on web design, freelancing, and creative growth, shared to inform, encourage, and spark new perspectives"
                />
            )}

            {isAdmin && (
                <div className="flex justify-start mb-4">
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        size="sm"
                        className="shrink-0 cursor-pointer"
                    >
                        <FilePlus className="h-4 w-4 mr-1" />
                        Add Blog
                    </Button>
                </div>
            )}

            {/* Only show tags if there are blogs */}
            {hasBlogs && (
                <MotionWrapper direction="left" delay={0.2}>
                    <Tags
                        tags={["nextjs", "react", "css", "tailwind", "javascript", "typescript", "css"]}
                        selected={["nextjs", "css", "react"]}
                        clickableTags={["nextjs", "css", "react", "tailwind"]}
                        onTagClick={(tag) => console.log("Clicked tag:", tag)}
                        className="mb-4"
                    />
                </MotionWrapper>
            )}

            {isLoading ? (
                <BlogsLoading count={5} />
            ) : hasBlogs ? (
                <div className="space-y-6 sm:space-y-8">
                    {data.blogs.map((blog: Blog) => (
                        <Article key={blog.id} {...blog} showUnpublishedBadge={isAdmin && !blog.published} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    <EmptyState type="blogs" />
                    {isAdmin && (
                        <div className="flex justify-center">
                            <Button onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Your First Blog
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Add Blog Modal */}
            <AddBlogModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        </Section>
    );
}
