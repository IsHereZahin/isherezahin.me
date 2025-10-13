import { getRandomTheme } from "@/utils";
import BlurImage from "../ui/BlurImage";
import Frame from "../ui/Frame";
import StylishLink from "../ui/StylishLink";

export interface ProjectType {
    id: string;
    title: string;
    slug: string;
    status: string;
    description: string;
    image: string;
    url: string | null;
}

export default function Project(project: Readonly<ProjectType>) {
    const theme = getRandomTheme();

    return (
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
                            {project.status}
                        </span>
                    )}
                </header>

                <p className="text-font-base text-muted-foreground leading-relaxed">
                    {project.description}
                </p>

                <StylishLink
                    slug={project.slug}
                    label="View Project"
                    color={theme.lightPrimary}
                    seed={project.title}
                />
            </div>
        </article>
    );
}
