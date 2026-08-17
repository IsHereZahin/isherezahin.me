import { BlogsLoading, Section, SectionHeader } from "@/components/ui";
import type { HomeContent } from "@/data/pages/home";
import { getPublishedBlogsPage } from "@/lib/cached-queries";
import Blogs from "./Blogs";

/** Skeleton shown while the blog strip streams in. Keeps the header so the page does not shift. */
export function BlogsSectionFallback({ heading }: { readonly heading: HomeContent["blogs"] }) {
    return (
        <Section id="blogs">
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <BlogsLoading count={2} />
        </Section>
    );
}

/**
 * Server half of the home page blog strip. The database read is isolated here
 * so `<Suspense>` can stream it in after the rest of the page has rendered,
 * rather than holding the whole route on Mongo.
 */
export default async function BlogsSection({ heading }: { readonly heading: HomeContent["blogs"] }) {
    const initialData = await getPublishedBlogsPage(2);
    return <Blogs initialData={initialData} heading={heading} />;
}
