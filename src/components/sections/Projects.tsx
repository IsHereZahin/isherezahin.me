import { ProjectsProps } from "@/utils/types";
import Project from "../Project";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

export default function Projects({ projects }: Readonly<ProjectsProps>) {
    return (
        <Section id="projects">
            <SectionHeader title="Projects" subtitle="A select few that I&apos;ve shipped in the past few months" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projects.map((project) => (
                    <Project key={project.id} project={project} />
                ))}
            </div>
        </Section>
    );
}