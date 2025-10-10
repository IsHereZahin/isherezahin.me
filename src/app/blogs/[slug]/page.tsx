// ui concept | component - Thanks to @nelsonlaidev
// Copyright (c) 2023 Nelson Lai
// Source: https://github.com/nelsonlaidev
//
// Modified by: Zahin Mohammad

"use client";

import Section from '@/components/ui/Section';
import { AlignLeftIcon, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';

import ArticleInfo from '@/components/content/ArticleInfo';
import BlurImage from '@/components/ui/BlurImage';
import ArticleContent from '../../../components/content/ArticleContent';
import TableOfContents from '../../../components/content/TableOfContents';

export default function BlogPostPage() {
    const [showTOC, setShowTOC] = useState(false);

    const tocItems = [
        { id: "summary", title: "Summary", indent: 0 },
        { id: "human-rights-violations", title: "Human Rights Violations", indent: 0 },
        { id: "historical-context", title: "Historical Context", indent: 0 },
        { id: "life-under-occupation", title: "Life Under Occupation", indent: 0 },
    ];

    return (
        <>
            {/* --- Blog Header Section --- */}
            <Section id="blog_header" animate>
                <div className="text-center mb-6 sm:mb-8">
                    <span className="inline-block px-4 py-1 border border-foreground/10 rounded-full text-xs tracking-wider uppercase text-foreground/70">
                        DESIGN
                    </span>
                </div>
                <h1 className='bg-linear-to-b from-foreground via-foreground/90 to-foreground/70 to-90% bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl md:leading-[64px] mb-3 sm:mb-8 px-4'>
                    The influence of modern architecture
                </h1>
                <p className="text-center text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                    Nibh sed pulvinar proin gravida hendrerit lectus a. Consequat mauris nunc congue nisi vitae suscipit tellus mauris a. Cursus metus aliquam.
                </p>
                <ArticleInfo viewCount={1} commentCount={0} formattedDate="23 Nov 2022" />
            </Section>

            {/* --- Hero Image --- */}
            <Section id="blog_Image" animate className="max-w-5xl">
                <div className="mb-12 sm:mb-16">
                    <BlurImage
                        src="https://images.unsplash.com/photo-1745750747043-da33e463f361?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Modern architecture buildings"
                        className="w-full rounded-3xl object-cover p-1 shadow-feature-card"
                    />
                </div>
            </Section>

            {/* --- Blog Content Section --- */}
            <Section id="blog_content" animate>
                <div className="relative flex flex-col lg:flex-row">
                    {/* --- LEFT: Social Icons (Desktop) --- */}
                    <div className="hidden lg:block absolute -left-16 xl:-left-20 top-0">
                        <div className="sticky top-24 flex flex-col gap-4">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Twitter">
                                <Twitter className="w-5 h-5 text-muted-foreground/80" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Instagram">
                                <Instagram className="w-5 h-5 text-muted-foreground/80" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Facebook">
                                <Facebook className="w-5 h-5 text-muted-foreground/80" />
                            </a>
                        </div>
                    </div>

                    {/* --- MOBILE Social Icons --- */}
                    <div className="lg:hidden flex justify-center gap-4 mb-8">
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Twitter">
                            <Twitter className="w-5 h-5 text-muted-foreground/80" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Instagram">
                            <Instagram className="w-5 h-5 text-muted-foreground/80" />
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Facebook">
                            <Facebook className="w-5 h-5 text-muted-foreground/80" />
                        </a>
                    </div>

                    {/* --- MAIN ARTICLE + Sidebar --- */}
                    <div className="flex flex-col lg:flex-row gap-12 w-full">
                        {/* MDX */}
                        <ArticleContent />
                        <TableOfContents tocItems={tocItems} showMobileTOC={showTOC} setShowMobileTOC={setShowTOC} />
                    </div>
                </div>
            </Section>

            {/* --- Floating TOC Button --- */}
            <button
                onClick={() => setShowTOC(true)}
                className="group rounded-xl border border-transparent bg-neutral-800/40 backdrop-blur-sm fixed z-10 bottom-5 right-5 lg:hidden py-3 px-3 flex items-center gap-2 transition-opacity duration-300 opacity-50 hover:!opacity-100 width-before-scroll-bar"
            >
                <AlignLeftIcon className="w-5 h-5" /> Table of Contents
            </button>
        </>
    );
}
