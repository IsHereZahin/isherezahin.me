import { Section, SectionHeader } from "@/components/ui";
import { BlogsLoading } from "@/components/ui";
import { getPublishedBlogsPage } from "@/lib/cached-queries";
import Blogs from "./Blogs";

const HEADING = {
    tag: "02",
    title: "Blogs",
    subtitle: "Thoughts on what I'm learning and building in web development",
};

/**
 * Skeleton shown while the blog strip streams in. It keeps the section header
 * so the page does not shift once the posts arrive.
 */
export function BlogsSectionFallback() {
    return (
        <Section id="blogs">
            <SectionHeader {...HEADING} />
            <BlogsLoading count={2} />
        </Section>
    );
}

/**
 * Server half of the home page blog strip.
 *
 * The database read lives here — and only here — so `<Suspense>` can stream it
 * in *after* the rest of the home page has already rendered. Awaiting it in the
 * page component instead would hold the whole route (hero included) until Mongo
 * answers, which is what made navigating to `/` feel like it hung.
 */
export default async function BlogsSection() {
    const initialData = await getPublishedBlogsPage(2);
    return <Blogs initialData={initialData} />;
}
