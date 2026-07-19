import BlogsIndex from "@/components/pages/BlogsIndex";
import { METADATA } from "@/config/seo.config";
import { getPublishedBlogsPage } from "@/lib/cached-queries";
import { Suspense } from "react";

export const metadata = METADATA.blogs;

export default async function BlogsPage() {
  const initialData = await getPublishedBlogsPage(5);
  // The visible loading skeleton is the route-level loading.tsx. This Suspense
  // exists only to satisfy `useSearchParams` inside BlogsIndex, so its fallback
  // is empty — otherwise a second, duplicate loader would appear.
  return (
    <Suspense fallback={null}>
      <BlogsIndex initialData={initialData} />
    </Suspense>
  );
}
