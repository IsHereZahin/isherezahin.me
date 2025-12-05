"use client";

import { getProjects } from "@/lib/api";
import { Project as ProjectType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Project from "../Project";
import { ProjectsLoading } from "../ui/Loading";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import SeeMore from "../ui/SeeMore";

export default function Projects() {
    const page = 1;
    const limit = 2;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["projects", page, limit],
        queryFn: () => getProjects(page, limit),
        staleTime: 1000 * 60 * 5,
    });

    // Don't render anything if there's an error or no projects
    if (isError) return null;

    // Don't render if loading is complete and there are no projects
    if (!isLoading && (!data?.projects || data.projects.length === 0)) {
        return null;
    }

    return (
        <Section id="projects" animate={true}>
            <SectionHeader tag="03" title="Projects" subtitle="A select few that I&apos;ve shipped in the past few months" />

            {isLoading ? (
                <ProjectsLoading count={2} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                    {data.projects.slice(0, 2).map((project: ProjectType) => (
                        <Project key={project.id} {...project} />
                    ))}
                </div>
            )}

            <div className="flex justify-center">
                <SeeMore href="/projects" text="See all projects" className="mt-16" />
            </div>
        </Section>
    );
}