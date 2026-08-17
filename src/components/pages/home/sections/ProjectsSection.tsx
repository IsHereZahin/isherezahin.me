import { ProjectsLoading, Section, SectionHeader } from "@/components/ui";
import type { HomeContent } from "@/data/pages/home";
import { getPublishedProjectsPage } from "@/lib/cached-queries";
import Projects from "./Projects";

/** Skeleton shown while the project strip streams in. */
export function ProjectsSectionFallback({ heading }: { readonly heading: HomeContent["projects"] }) {
    return (
        <Section id="projects">
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <ProjectsLoading count={2} />
        </Section>
    );
}

/** Server half of the home page project strip — see `BlogsSection`. */
export default async function ProjectsSection({ heading }: { readonly heading: HomeContent["projects"] }) {
    const initialData = await getPublishedProjectsPage(2);
    return <Projects initialData={initialData} heading={heading} />;
}
