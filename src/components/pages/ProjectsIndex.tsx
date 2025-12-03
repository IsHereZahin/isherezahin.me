"use client";

import Project from "@/components/Project";
import PageTitle from "@/components/ui/PageTitle";
import Section from "@/components/ui/Section";
import Tags from "@/components/ui/Tags";
import { projects } from "@/data";
import MotionWrapper from "../motion/MotionWrapper";

export default function ProjectsIndex() {
    return (
        <Section id="projects">
            <PageTitle title="Projects I've worked on" subtitle="Nothing too fancy, just solid websites that do their job." />
            <MotionWrapper direction="left" delay={0.2}>
                <Tags
                    tags={["nextjs", "react", "css", "tailwind", "javascript", "typescript", "css"]}
                    selected={["nextjs", "css", "react"]}
                    clickableTags={["nextjs", "css", "react", "tailwind"]}
                    onTagClick={(tag) => console.log("Clicked tag:", tag)}
                    className="mb-4"
                />
            </MotionWrapper>
            <div className="space-y-6 sm:space-y-8 border-t border-border/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                    {projects.map((project) => (
                        <Project key={project.id} {...project} />
                    ))}
                </div>
            </div>
        </Section>
    )
}