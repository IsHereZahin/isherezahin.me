"use client";

import { AddProjectModal } from "@/components/admin";
import {
    AdminEmptyState,
    ProjectsLoading,
    Section,
    SectionHeader,
    SeeMore,
} from "@/components/ui";
import { getProjects } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Project as ProjectType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Project } from "@/components";

export default function Projects() {
    const { isAdmin } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const page = 1;
    const limit = 2;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["projects", page, limit],
        queryFn: () => getProjects(page, limit),
        staleTime: 1000 * 60 * 5,
    });

    // Don't render anything if there's an error
    if (isError) return null;

    const hasProjects = !isLoading && data?.projects && data.projects.length > 0;

    // Don't render if loading is complete and there are no projects (for non-admins)
    if (!isLoading && !hasProjects && !isAdmin) {
        return null;
    }

    return (
        <Section id="projects" animate={true}>
            <SectionHeader tag="03" title="Projects" subtitle="A select few that I&apos;ve shipped in the past few months" />

            {isLoading ? (
                <ProjectsLoading count={2} />
            ) : hasProjects ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                        {data.projects.slice(0, 2).map((project: ProjectType) => (
                            <Project key={project.id} {...project} />
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <SeeMore href="/projects" text="See all projects" className="mt-16" />
                    </div>
                </>
            ) : isAdmin ? (
                <AdminEmptyState type="projects" onAdd={() => setIsAddModalOpen(true)} />
            ) : null}

            {/* Add Project Modal */}
            <AddProjectModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        </Section>
    );
}