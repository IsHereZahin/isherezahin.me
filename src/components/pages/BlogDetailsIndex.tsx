// Most of the design is from @nelsonlaidev
// ui concept | component - Thanks to @nelsonlaidev
// Copyright (c) 2023 Nelson Lai
// Source: https://github.com/nelsonlaidev
// Modified by: Zahin Mohammad

"use client";

import { AlignLeftIcon, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';

import ArticleContent from '@/components/content/ArticleContent';
import ArticleInfo from '@/components/content/ArticleInfo';
import TableOfContents from '@/components/content/TableOfContents';
import BlurImage from '@/components/ui/BlurImage';
import Heading from '@/components/ui/Heading';
import ImageZoom from '@/components/ui/ImageZoom';
import Section from '@/components/ui/Section';
import TextGradient from '@/components/ui/TextGradient';
import ReferralLink from '../ui/ReferralLink';

export default function BlogDetailsIndex() {
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
            <Section id="blog_header" animate className="px-6 pt-16 max-w-[1000px]">
                <div className="text-center mb-6 sm:mb-8">
                    <span className="inline-block px-4 py-1 border border-foreground/10 rounded-full text-xs tracking-wider uppercase text-foreground/70">
                        BLOG
                    </span>
                </div>
                <Heading size='lg' className="mb-4 sm:mb-6 text-center" text="Modern Architecture Buildings" />
                <TextGradient text="Nibh sed pulvinar proin gravida hendrerit lectus a. Consequat mauris nunc congue nisi vitae suscipit tellus mauris a. Cursus metus aliquam." className="max-w-2xl mx-auto text-center" />
                <ArticleInfo viewCount={1} commentCount={0} formattedDate="23 Nov 2022" />
                <ImageZoom>
                    <div className="p-2 border border-dotted border-foreground/10 rounded-2xl mt-10 sm:mt-12">
                        <BlurImage
                            src="https://images.unsplash.com/photo-1745750747043-da33e463f361?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Modern architecture buildings"
                            width={1170}
                            height={700}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </ImageZoom>
            </Section>

            {/* --- Blog Content Section --- */}
            <Section id="blog_content">
                <div className="relative flex flex-col lg:flex-row">
                    {/* --- LEFT: Social Icons (Desktop) --- */}
                    <div className="hidden lg:block absolute -left-16 xl:-left-20 top-0">
                        <div className="sticky top-24 flex flex-col gap-4">
                            <ReferralLink href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Twitter">
                                <Twitter className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                            </ReferralLink>
                            <ReferralLink href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Instagram">
                                <Instagram className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                            </ReferralLink>
                            <ReferralLink href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Facebook">
                                <Facebook className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                            </ReferralLink>
                        </div>
                    </div>

                    {/* --- MOBILE Social Icons --- */}
                    <div className="lg:hidden flex justify-center gap-4 mb-8">
                        <ReferralLink href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Twitter">
                            <Twitter className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                        </ReferralLink>
                        <ReferralLink href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Instagram">
                            <Instagram className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                        </ReferralLink>
                        <ReferralLink href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Share on Facebook">
                            <Facebook className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                        </ReferralLink>
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
