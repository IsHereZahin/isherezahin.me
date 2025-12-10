import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, Frame, StylishLink } from "@/components/ui";
import { getRandomTheme } from "@/utils";
import { Project as ProjectType } from "@/utils/types";
import { EyeOff } from "lucide-react";

interface ProjectProps extends ProjectType {
    showUnpublishedBadge?: boolean;
    disableAnimation?: boolean;
}

export default function Project({ showUnpublishedBadge, disableAnimation, ...project }: Readonly<ProjectProps>) {
    const theme = getRandomTheme();

    const projectContent = (
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
                <header className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{project.title}</h3>
                    {showUnpublishedBadge && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                            <EyeOff size={12} />
                            Draft
                        </span>
                    )}
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
    );

    if (disableAnimation) {
        return (
            <div className="animate-fade-in">
                {projectContent}
            </div>
        );
    }

    return (
        <MotionWrapper direction="bottom" delay={0.2}>
            {projectContent}
        </MotionWrapper>
    );
}
