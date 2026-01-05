import BlogsIndex from "@/components/pages/BlogsIndex";
import { BlogsLoading, TagsLoading } from "@/components/ui";
import { METADATA } from "@/config/seo.config";
import { Suspense } from "react";

export const metadata = METADATA.blogs;

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
      <BlogsIndex />
    </Suspense>
  );
}
