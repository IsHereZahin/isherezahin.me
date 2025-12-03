import { getRandomTheme } from "@/utils";
import { Project as ProjectType } from "@/utils/types";
import MotionWrapper from "./motion/MotionWrapper";
import BlurImage from "./ui/BlurImage";
import Frame from "./ui/Frame";
import StylishLink from "./ui/StylishLink";

export default function Project(project: Readonly<ProjectType>) {
    const theme = getRandomTheme();

    return (
        <MotionWrapper direction="bottom" delay={0.2}>
            <article className="space-y-3 sm:space-y-4 group relative rounded-lg overflow-hidden p-4 sm:p-6">
                {/* Image Wrapper */}
                <Frame>
                    <BlurImage
                        src={project.imageSrc}
                        alt={project.title}
                        className="object-cover"
                    />
                </Frame>

                {/* Content */}
                <div>
                    <header className="flex items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">{project.title}</h3>
                        {project.status === "in-progress" && (
                            <span className="text-xs sm:text-sm text-muted-foreground">
                                In Progress
                            </span>
                        )}
                    </header>

                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        {project.excerpt}
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
