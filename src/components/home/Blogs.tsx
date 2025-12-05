"use client";

import { AddBlogModal } from "@/components/admin";
import {
    AdminEmptyState,
    BlogsLoading,
    Section,
    SectionHeader,
    SeeMore,
} from "@/components/ui";
import { getBlogs } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Blog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Article } from "@/components";

export default function Blogs() {
    const { isAdmin } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const page = 1;
    const limit = 2;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["blogs", page, limit],
        queryFn: () => getBlogs(page, limit),
        staleTime: 1000 * 60 * 5,
    });

    // Don't render anything if there's an error
    if (isError) return null;

    const hasBlogs = !isLoading && data?.blogs && data.blogs.length > 0;

    // Don't render if loading is complete and there are no blogs (for non-admins)
    if (!isLoading && !hasBlogs && !isAdmin) {
        return null;
    }

    return (
        <Section id="blogs" animate={true}>
            <SectionHeader tag="02" title="Blogs" subtitle="Thoughts on what I'm learning and building in web development" />

            {isLoading ? (
                <BlogsLoading count={2} />
            ) : hasBlogs ? (
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
            ) : isAdmin ? (
                <AdminEmptyState type="blogs" onAdd={() => setIsAddModalOpen(true)} />
            ) : null}

            {/* Add Blog Modal */}
            <AddBlogModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        </Section>
    );
}