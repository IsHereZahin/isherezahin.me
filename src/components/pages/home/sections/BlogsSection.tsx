import { Section, SectionHeader } from "@/components/ui";
import { BlogsLoading } from "@/components/ui";
import { getPublishedBlogsPage } from "@/lib/cached-queries";
import Blogs from "./Blogs";

const HEADING = {
    tag: "02",
    title: "Blogs",
    subtitle: "Thoughts on what I'm learning and building in web development",
};

/** Skeleton shown while the blog strip streams in. Keeps the header so the page does not shift. */
export function BlogsSectionFallback() {
    return (
        <Section id="blogs">
            <SectionHeader {...HEADING} />
            <BlogsLoading count={2} />
        </Section>
    );
}

/**
 * Server half of the home page blog strip. The database read is isolated here
 * so `<Suspense>` can stream it in after the rest of the page has rendered,
 * rather than holding the whole route on Mongo.
 */
export default async function BlogsSection() {
    const initialData = await getPublishedBlogsPage(2);
    return <Blogs initialData={initialData} />;
}
