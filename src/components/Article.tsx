import BlurImage from "@/components/ui/BlurImage";
import { truncateWords } from "@/utils";
import { Clock, Eye } from "lucide-react";
import Link from "next/link";
import MotionWrapper from "./motion/MotionWrapper";

export interface Blog {
    id: number;
    date: string;
    readTime: number;
    views: number;
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    imageSrc: string;
    alt: string;
}

export default function Article({ date, readTime, views, title, slug, excerpt, imageSrc, alt, tags }: Readonly<Blog>) {
    const truncatedExcerpt = truncateWords(excerpt, 35);

    return (
        <MotionWrapper direction="bottom" delay={0.1}>
            <article className="group/article relative py-8 border-t border-border/30 last:border-b-0 transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-accent/30">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    {/* Content Section - Below image on xs screens, left on sm and up */}
                    <div className="flex-1 min-w-0 order-2 sm:order-none">
                        {/* Date */}
                        <time className="text-sm text-muted-foreground mb-3 block">
                            {date}
                        </time>

                        {/* Title with link */}
                        <Link href={`/blogs/${slug}`} className="group/link block mb-3">
                            <h3 className="text-xl font-semibold text-foreground group-hover/link:text-primary transition-colors duration-300">
                                {title}
                            </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-secondary-foreground mb-6 leading-relaxed text-base">
                            {truncatedExcerpt}
                        </p>
                    </div>

                    {/* Image Section - Top on xs screens, right on sm and up, responsive sizing */}
                    <div className="relative flex-shrink-0 w-full sm:w-48 lg:w-56 xl:w-64 h-48 sm:h-32 lg:h-40 xl:h-48 rounded-lg overflow-hidden transition-all duration-300 ease-out group-hover/article:scale-105 order-first sm:order-none">
                        <BlurImage
                            src={imageSrc}
                            alt={alt}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Metadata Row - Read time, Views, and Tags */}
                <div className="flex w-full flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-4">
                    <div className="flex items-center gap-3 sm:gap-6 flex-1">
                        {/* Read Time */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={16} className="text-primary/60" />
                            <span>{readTime} min read</span>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye size={16} className="text-primary/60" />
                            <span>{views.toLocaleString()} views</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 sm:ml-auto mt-2 sm:mt-0">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-sm lowercase px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground/80 hover:bg-muted/40 hover:text-muted-foreground transition-colors duration-200 cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        </MotionWrapper>
    );
}