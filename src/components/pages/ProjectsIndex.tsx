"use client";

import { AddProjectModal } from "@/components/admin";
import { MotionWrapper } from "@/components/motion";
import Project from "@/components/Project";
import {
    AdminAddButton,
    AdminEmptyState,
    EmptyState,
    ErrorState,
    PageTitle,
    ProjectsLoading,
    Section,
    Tags,
} from "@/components/ui";
import { getProjects } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Project as ProjectType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ProjectsIndex() {
    const { isAdmin } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["projects", 1], // first page
        queryFn: () => getProjects(1, 10), // fetch 10 projects
        staleTime: 1000 * 60 * 5,
    });

    if (isError) {
        return (
            <Section id="projects">
                <PageTitle title="Projects I've worked on" subtitle="Nothing too fancy, just solid websites that do their job." />
                <ErrorState
                    title="Failed to load projects"
                    message={error instanceof Error ? error.message : "We couldn't load the projects. Please check your connection and try again."}
                    onRetry={() => refetch()}
                />
            </Section>
        );
    }

    const hasProjects = data?.projects && data.projects.length > 0;

    return (
        <Section id="projects">
            {/* Only show PageTitle if there are projects or still loading */}
            {(isLoading || hasProjects) && (
                <PageTitle title="Projects I've worked on" subtitle="Nothing too fancy, just solid websites that do their job." />
            )}

            {isAdmin && hasProjects && (
                <AdminAddButton
                    onClick={() => setIsAddModalOpen(true)}
                    label="Add Project"
                    className="mb-4"
                />
            )}

            {/* Only show tags if there are projects */}
            {hasProjects && (
                <MotionWrapper direction="left" delay={0.2}>
                    <Tags
                        tags={["nextjs", "react", "css", "tailwind", "javascript", "typescript", "css"]}
                        selected={["nextjs", "css", "react"]}
                        clickableTags={["nextjs", "css", "react", "tailwind"]}
                        onTagClick={(tag) => console.log("Clicked tag:", tag)}
                        className="mb-4"
                    />
                </MotionWrapper>
            )}

            {isLoading ? (
                <ProjectsLoading count={4} />
            ) : hasProjects ? (
                <div className="space-y-6 sm:space-y-8 border-t border-border/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                        {data.projects.map((project: ProjectType) => (
                            <Project key={project.id} {...project} showUnpublishedBadge={isAdmin && !project.published} />
                        ))}
                    </div>
                </div>
            ) : isAdmin ? (
                <AdminEmptyState type="projects" onAdd={() => setIsAddModalOpen(true)} />
            ) : (
                <EmptyState type="projects" />
            )}

            {/* Add Project Modal */}
            <AddProjectModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        </Section>
    );
}
