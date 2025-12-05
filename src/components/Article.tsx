import { MotionWrapper } from "@/components/motion";
import { BlurImage } from "@/components/ui";
import { getFormattedDate, getReadTime, truncateWords } from "@/utils";
import { Blog } from "@/utils/types";
import { Clock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ArticleProps extends Blog {
    showUnpublishedBadge?: boolean;
}

export default function Article({ date, views, title, slug, excerpt, imageSrc, content, tags, showUnpublishedBadge }: Readonly<ArticleProps>) {
    const truncatedExcerpt = truncateWords(excerpt, 35);

    return (
        <MotionWrapper direction="bottom" delay={0.2}>
            <article className="group/article relative py-6 sm:py-8 border-t border-border/30 last:border-b-0 transition-all duration-500 ease-out hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                    {/* Content Section - Below image on xs screens, left on sm and up */}
                    <div className="flex-1 min-w-0 order-2 sm:order-none">
                        {/* Date */}
                        <time className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 block">
                            {getFormattedDate(date)}
                        </time>

                        {/* Title with link */}
                        <Link href={`/blogs/${slug}`} className="group/link block mb-2 sm:mb-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover/link:text-primary transition-colors duration-300 flex items-center gap-2">
                                {title}
                                {showUnpublishedBadge && (
                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                                        <EyeOff size={12} />
                                        Draft
                                    </span>
                                )}
                            </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-muted-foreground group-hover/article:text-foreground/80 transition-colors mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                            {truncatedExcerpt}
                        </p>
                    </div>

                    {/* Image Section - Top on xs screens, right on sm and up, responsive sizing */}
                    <div className="relative flex-shrink-0 w-full sm:w-48 lg:w-56 xl:w-64 h-40 sm:h-32 lg:h-40 xl:h-48 rounded-lg overflow-hidden transition-all duration-300 ease-out group-hover/article:scale-105 order-first sm:order-none">
                        <BlurImage
                            src={imageSrc}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Metadata Row - Read time, Views, and Tags */}
                <div className="flex w-full flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-3 sm:pt-4">
                    <div className="flex items-center gap-3 sm:gap-6 flex-1">
                        {/* Read Time */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Clock size={14} className="sm:w-4 sm:h-4 text-primary/60" />
                            <span>{getReadTime(content)} min read</span>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Eye size={14} className="sm:w-4 sm:h-4 text-primary/60" />
                            <span>{views.toLocaleString()} views</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 sm:ml-auto mt-2 sm:mt-0">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs sm:text-sm lowercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-muted/50 text-muted-foreground/80 hover:bg-muted/40 hover:text-muted-foreground transition-colors duration-200 cursor-default"
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