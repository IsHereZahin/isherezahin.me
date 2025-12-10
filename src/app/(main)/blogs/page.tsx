import BlogIndex from '@/components/pages/BlogsIndex';
import { BlogsLoading, TagsLoading } from '@/components/ui';
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: `Blogs | ${MY_FULL_NAME}`,
};

function BlogsPageFallback() {
    return (
        <section className="px-6 py-16 max-w-5xl mx-auto">
            <TagsLoading />
            <div className="mt-8">
                <BlogsLoading count={5} />
            </div>
        </section>
    );
}

export default function BlogsPage() {
    return (
        <Suspense fallback={<BlogsPageFallback />}>
            <BlogIndex />
        </Suspense>
    )
}
