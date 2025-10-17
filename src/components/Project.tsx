import { getRandomTheme } from "@/utils";
import MotionWrapper from "./motion/MotionWrapper";
import BlurImage from "./ui/BlurImage";
import Frame from "./ui/Frame";
import StylishLink from "./ui/StylishLink";

export interface ProjectType {
    id: number;
    date: string;
    title: string;
    slug: string;
    status: boolean;
    shortDescription: string;
    image: string;
    url: string;
    categories: string;
    tags: string[];
}

export default function Project(project: Readonly<ProjectType>) {
    const theme = getRandomTheme();

    return (
        <MotionWrapper direction="bottom" delay={0.2}>
            <article className="space-y-4 group relative rounded-lg overflow-hidden p-6">
                {/* Image Wrapper */}
                <Frame>
                    <BlurImage
                        src={project.image}
                        alt={project.title}
                        className="object-cover"
                    />
                </Frame>

                {/* Content */}
                <div>
                    <header className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                        {project.status && (
                            <span className="text-base text-secondary-foreground">
                                {project.status ? "In Progress" : ""}
                            </span>
                        )}
                    </header>

                    <p className="text-font-base leading-relaxed text-secondary-foreground">
                        {project.shortDescription}
                    </p>

                    <StylishLink
                        slug={`/projects/${project.slug}`}
                        label="View Project"
                        color={theme.lightPrimary}
                        seed={project.title}
                    />
                </div>
            </article>
        </MotionWrapper>
    );
}
