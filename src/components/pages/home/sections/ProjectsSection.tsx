import { ProjectsLoading, Section, SectionHeader } from "@/components/ui";
import { getPublishedProjectsPage } from "@/lib/cached-queries";
import Projects from "./Projects";

const HEADING = {
    tag: "03",
    title: "Projects",
    subtitle: "A select few that I've shipped in the past few months",
};

/** Skeleton shown while the project strip streams in. */
export function ProjectsSectionFallback() {
    return (
        <Section id="projects">
            <SectionHeader {...HEADING} />
            <ProjectsLoading count={2} />
        </Section>
    );
}

/** Server half of the home page project strip — see `BlogsSection`. */
export default async function ProjectsSection() {
    const initialData = await getPublishedProjectsPage(2);
    return <Projects initialData={initialData} />;
}
