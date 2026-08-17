"use client";

import Project from "@/components/Project";
import {
    ProjectsLoading,
    Section,
    SectionHeader,
    SeeMore,
} from "@/components/ui";
import type { HomeContent } from "@/data/pages/home";
import { getProjects } from "@/lib/api";
import { Project as ProjectType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

interface ProjectsPage {
    total: number;
    page: number;
    limit: number;
    projects: ProjectType[];
}

export default function Projects({
    initialData,
    heading,
}: {
    readonly initialData?: ProjectsPage;
    readonly heading: HomeContent["projects"];
}) {
    const page = 1;
    const limit = 2;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["projects", page, limit],
        queryFn: () => getProjects(page, limit),
        staleTime: 1000 * 60 * 5,
        initialData,
    });

    // Don't render anything if there's an error
    if (isError) return null;

    const hasProjects = !isLoading && data?.projects && data.projects.length > 0;

    // Nothing to show once loading completes with no projects.
    if (!isLoading && !hasProjects) return null;

    return (
        <Section id="projects" animate={true}>
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />

            {isLoading ? (
                <ProjectsLoading count={2} />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                        {data.projects.slice(0, 2).map((project: ProjectType) => (
                            <Project key={project.id} {...project} />
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <SeeMore href="/projects" text={heading.seeAll} className="mt-16" />
                    </div>
                </>
            )}
        </Section>
    );
}
