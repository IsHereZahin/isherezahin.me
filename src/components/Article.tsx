import { Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Blog {
    id: number;
    date: string;
    readTime: number;
    views: number;
    title: string;
    href: string;
    excerpt: string;
    tags: string[];
    imageSrc: string;
    alt: string;
};

export default function Article({ date, readTime, views, title, href, excerpt, imageSrc, alt }: Readonly<Blog>) {
    return (
        <article className="group/article relative rounded-lg p-6 transition-colors duration-200 shadow-feature-card overflow-hidden">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-1">
                <Link
                    href={href}
                    className="text-md sm:text-xl text-foreground font-semibold group-hover/article:text-primary transition-colors"
                >
                    {title}
                </Link>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                        <Clock size={16} /> {readTime} min read
                    </div>
                    <div className="text-xs text-muted-foreground/70 flex items-center gap-1">
                        <Eye size={16} /> {views} views
                    </div>
                </div>
            </header>
            <p className="text-sm text-muted-foreground mb-2">
                {date}
            </p>
            <div className="space-y-4 relative z-10">
                <p className="text-base text-muted-foreground leading-relaxed">
                    {excerpt}
                </p>
            </div>
            <div className="absolute -right-4 bottom-1 w-48 h-48 opacity-0 group-hover/article:opacity-100 transition-all duration-500 ease-out group-hover/article:translate-x-0 group-hover/article:scale-100 transform -translate-x-12 -rotate-12 z-0">
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    sizes="192px"
                    className="object-cover rounded-lg shadow-lg"
                />
            </div>
        </article>
    );
}