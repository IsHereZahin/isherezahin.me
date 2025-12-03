import Project, { ProjectType } from "../Project";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import SeeMore from "../ui/SeeMore";

export interface ProjectsProps {
    projects: ProjectType[];
}

export default function Projects({ projects }: Readonly<ProjectsProps>) {
    return (
        <Section id="projects" animate={true}>
            <SectionHeader tag="03" title="Projects" subtitle="A select few that I&apos;ve shipped in the past few months" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                {projects.slice(0, 4).map((project) => (
                    <Project key={project.id} {...project} />
                ))}
            </div>
            <div className="flex justify-center">
                <SeeMore href="/projects" text="See all projects" className="mt-16" />
            </div>
        </Section>
    );
}