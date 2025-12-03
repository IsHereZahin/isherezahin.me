"use client";

import { AlignLeftIcon, Building2, Calendar, Clock, ExternalLink, Eye, Github, Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import BlurImage from "@/components/ui/BlurImage";
import Heading from "@/components/ui/Heading";
import ImageZoom from "@/components/ui/ImageZoom";
import Section from "@/components/ui/Section";
import TextGradient from "@/components/ui/TextGradient";
import { ApiError, getProject, projectViews } from "@/lib/api";
import { extractTocItems, getFormattedDate } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import MarkdownPreview from "../content/discussions/MarkdownPreview";
import TableOfContents from "../content/TableOfContents";
import LikeButton from "../ui/LikeButton";
import { ProjectDetailsLoading } from "../ui/Loading";
import ReferralLink from "../ui/ReferralLink";
import AnimatedNumber from "../ui/AnimatedNumber";

export default function ProjectDetailsIndex({ slug }: { readonly slug: string }) {
    const [showTOC, setShowTOC] = useState(false);
    const [viewCount, setViewCount] = useState(0);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["project", slug],
        queryFn: () => getProject.getProject(slug),
        staleTime: 1000 * 60 * 5,
    });

    // Mutation to increment view
    const viewMutation = useMutation({
        mutationFn: () => projectViews.incrementView(slug),
        onSuccess: (data) => {
            setViewCount(data.views);
        },
    });

    // Scroll to top when project slug changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [slug]);

    // Update view count
    useEffect(() => {
        if (data) {
            setViewCount(data.views);
            viewMutation.mutate();
        }
    }, [data]);

    if (isLoading) {
        return <ProjectDetailsLoading />;
    }

    // Handle errors
    if (isError) {
        const err = error as ApiError;
        if (err.status === 404) notFound();
        return <p className="text-red-500">{err.message}</p>;
    }

    if (!data) return notFound();

    const tocItems = extractTocItems(data.content);

    return (
        <>
            {/* Project Header Section */}
            <Section id="project_header" animate className="px-6 pt-16 max-w-[1000px]">
                <div className="text-center mb-6 sm:mb-8">
                    <span className="inline-block px-4 py-1 border border-foreground/10 rounded-full text-xs tracking-wider uppercase text-foreground/70">
                        {data.categories || "Project"}
                    </span>
                </div>

                <Heading size="lg" className="mb-4 sm:mb-6 text-center" text={data.title} />
                <TextGradient text={data.excerpt} className="max-w-2xl mx-auto text-center" />

                {/* Project Meta Info */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-sm sm:text-base text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{data.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{data.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{getFormattedDate(data.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="flex items-center gap-1">
                            {(viewCount ?? 0) > 0 ? (
                                <AnimatedNumber value={viewCount} />
                            ) : (
                                <span className="tabular-nums">--</span>
                            )} views
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${data.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className={data.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}>
                            {data.status}
                        </span>
                    </div>

                </div>

                {/* Project Image */}
                <ImageZoom>
                    <div className="p-2 border border-dotted border-foreground/10 rounded-2xl mt-10 sm:mt-12">
                        <BlurImage
                            src={data.imageSrc}
                            alt={data.title}
                            width={1170}
                            height={700}
                            lazy={false}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </ImageZoom>
            </Section>

            {/* Project Content Section */}
            <Section id="project_content">
                <div className="relative flex flex-col lg:flex-row">
                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-12 w-full">
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-3 mb-8">
                                {/* Visit Website Button */}
                                {data.liveUrl && (
                                    <ReferralLink href={data.liveUrl}>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-primary-foreground hover:bg-foreground/80 transition-colors font-medium cursor-pointer">
                                            <Globe className="w-4 h-4" />
                                            <span>Visit Website</span>
                                            <ExternalLink className="w-3 h-3 opacity-80" />
                                        </div>
                                    </ReferralLink>
                                )}

                                {/* GitHub Button */}
                                {data.githubUrl && (
                                    <ReferralLink href={data.githubUrl}>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium cursor-pointer">
                                            <Github className="w-4 h-4" />
                                            <span>Source Code</span>
                                            <ExternalLink className="w-3 h-3 opacity-80" />
                                        </div>
                                    </ReferralLink>
                                )}
                            </div>

                            {/* Tech Stack Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {data.tags.map((tech: string, index: number) => (
                                    <Badge key={index + 1} variant="secondary" className="text-xs sm:text-sm">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>

                            {/* Project Content */}
                            <MarkdownPreview content={data.content} />
                        </div>

                        {/* Table of Contents */}
                        <TableOfContents
                            tocItems={tocItems}
                            showMobileTOC={showTOC}
                            setShowMobileTOC={setShowTOC}
                            slug={slug}
                            title={data.title}
                            type="project"
                        />
                    </div>
                </div>
                <div className="block lg:hidden">
                    <LikeButton slug={slug} type="project" />
                </div>
            </Section>

            {/* Floating TOC Button */}
            <button
                onClick={() => setShowTOC(true)}
                className="group rounded-xl border border-transparent bg-neutral-800/40 backdrop-blur-sm fixed z-10 bottom-5 right-5 lg:hidden py-3 px-3 flex items-center gap-2 transition-opacity duration-300 opacity-50 hover:!opacity-100"
            >
                <AlignLeftIcon className="w-5 h-5" /> Table of Contents
            </button>
        </>
    );
}