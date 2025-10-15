"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import Project from "@/components/Project";
import PageTitle from "@/components/ui/PageTitle";
import Section from "@/components/ui/Section";
import Tags from "@/components/ui/Tags";
import { projects } from "@/data";

export default function ProjectsIndex() {
    return (
        <Section id="projects">
            <MotionWrapper direction="left" distance={20}>
                <PageTitle title="The Projects" subtitle="These projects showcase my journey as a developer, blending innovative ideas with practical implementation using modern technologies." />
                <Tags
                    tags={["nextjs", "react", "css", "tailwind", "javascript", "typescript", "css"]}
                    selected={["nextjs", "css", "react"]}
                    clickableTags={["nextjs", "css", "react", "tailwind"]}
                    onTagClick={(tag) => console.log("Clicked tag:", tag)}
                    className="mb-4"
                />
            </MotionWrapper>
            <div className="space-y-8 border-t border-border/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {projects.map((project) => (
                        <Project key={project.id} {...project} />
                    ))}
                </div>
            </div>
        </Section>
    )
}