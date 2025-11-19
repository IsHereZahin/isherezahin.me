"use client";

import { ApiError, blogViews, getBlog } from "@/lib/api";
import { extractTocItems, getFormattedDate } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlignLeftIcon, Facebook, Instagram, Twitter } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

import ArticleInfo from "@/components/content/ArticleInfo";
import MarkdownPreview from "@/components/content/discussions/MarkdownPreview";
import TableOfContents from "@/components/content/TableOfContents";
import BlurImage from "@/components/ui/BlurImage";
import Heading from "@/components/ui/Heading";
import ImageZoom from "@/components/ui/ImageZoom";
import { BlogDetailsLoading } from "@/components/ui/Loading";
import ReferralLink from "@/components/ui/ReferralLink";
import Section from "@/components/ui/Section";
import TextGradient from "@/components/ui/TextGradient";
import { toast } from "sonner";
import LikeButton from "../ui/LikeButton";

export default function BlogDetailsIndex({ slug }: { readonly slug: string }) {
    const [showTOC, setShowTOC] = useState(false);
    const [viewCount, setViewCount] = useState(0);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => getBlog.getBlog(slug),
        staleTime: 1000 * 60 * 5,
    });

    // Mutation to increment view
    const viewMutation = useMutation({
        mutationFn: () => blogViews.incrementView(slug),
        onSuccess: (data) => {
            setViewCount(data.views);
            toast(
                <div className="flex items-center gap-3">
                    <span className="text-xl">📘</span>
                    <span className="font-medium">Thanks for reading. Appreciate your visit.</span>
                </div>
            )
        },
    });

    // Update view count
    useEffect(() => {
        if (data) {
            setViewCount(data.views);
            viewMutation.mutate();
        }
    }, [data]);


    if (isLoading) {
        return <BlogDetailsLoading />;
    }

    // Handle errors
    if (isError) {
        const err = error as ApiError;
        if (err.status === 404) notFound();
        return <p className="text-red-500">{err.message}</p>;
    }

    if (!data) return notFound();
    const toc = extractTocItems(data.content);

    return (
        <>
            {/* Blog Header Section */}
            <Section id="blog_header" animate className="px-6 pt-16 max-w-[1000px]">
                <div className="text-center mb-6 sm:mb-8">
                    <span className="inline-block px-4 py-1 border border-foreground/10 rounded-full text-xs tracking-wider uppercase text-foreground/70">
                        {data.type}
                    </span>
                </div>
                <Heading size="lg" className="mb-4 sm:mb-6 text-center" text={data.title} />
                <TextGradient text={data.excerpt} className="max-w-2xl mx-auto text-center" />
                <ArticleInfo
                    viewCount={viewCount || 0}
                    commentCount={0}
                    formattedDate={getFormattedDate(data.date)}
                />
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

            {/* Blog Content Section */}
            <Section id="blog_content">
                <div className="relative flex flex-col lg:flex-row">
                    {/* Social Icons */}
                    <div className="hidden lg:block absolute -left-16 xl:-left-20 top-0">
                        <div className="sticky top-24 flex flex-col gap-4">
                            {[Twitter, Instagram, Facebook].map((Icon, i) => (
                                <ReferralLink
                                    key={i + 1}
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                                >
                                    <Icon className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                                </ReferralLink>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Icons */}
                    <div className="lg:hidden flex justify-center gap-4 mb-4">
                        {[Twitter, Instagram, Facebook].map((Icon, i) => (
                            <ReferralLink
                                key={i + 1}
                                href="#"
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                            >
                                <Icon className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                            </ReferralLink>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-12 w-full">
                        <MarkdownPreview content={data.content} />
                        <TableOfContents
                            tocItems={toc}
                            showMobileTOC={showTOC}
                            setShowMobileTOC={setShowTOC}
                            slug={slug}
                        />
                    </div>
                </div>
                <div className="block lg:hidden">
                    <LikeButton slug={slug} />
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
