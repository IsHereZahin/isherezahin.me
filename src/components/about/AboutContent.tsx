"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import {
    BlurImage,
    ImageZoom,
    PageTitle,
    ReferralLink,
    Section,
    Signature,
} from "@/components/ui";
import { MY_FULL_NAME, SITE_GITHUB_URL, SITE_LINKEDIN_URL, SITE_USER_LOGO, SITE_YOUTUBE_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";

interface AboutHeroData {
    _id?: string;
    name: string;
    title: string;
    location: string;
    age?: string;
    imageSrc: string;
    paragraphs: string[];
    pageTitle?: string;
    pageSubtitle?: string;
}

function parseMarkdownParagraph(text: string): string {
    let html = text;
    // Bold: **text** -> <strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
    // Italic: *text* -> <em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code: `code` -> <code>
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
    // Links: [text](url) -> <a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    return html;
}

const defaultAboutData: AboutHeroData = {
    name: MY_FULL_NAME,
    title: "Software Developer | Frontend Focused",
    location: "Khulshi, Chittagong, BD (UTC+6)",
    age: "23Y",
    imageSrc: SITE_USER_LOGO,
    paragraphs: [
        'I work with the <strong class="text-foreground">React & Laravel ecosystem</strong>, building robust web applications, dashboards, and internal tools. I focus on creating intuitive user experiences, clean interfaces, and maintainable code that performs reliably in real-world scenarios.',
        'Beyond coding, I write to teach and help others rethink fundamental concepts through mental models. My goal is to simplify complex ideas, inspire new ways of thinking, and empower developers to build smarter solutions.',
        'With 2+ years of experience, I leverage tools like <strong class="text-foreground">TypeScript, Tailwind CSS, Bootstrap, Figma, Postman, Docker, and Git</strong> to deliver scalable and high-quality software. I pay attention to details because even small improvements can make a significant difference in usability and performance.',
    ],
    pageTitle: "About Me",
    pageSubtitle: "How I explored, learned, and finally found my place in tech",
};

async function fetchAboutHero(): Promise<AboutHeroData | null> {
    const response = await fetch('/api/admin/about');
    if (!response.ok) return null;
    return response.json();
}

export default function AboutContent() {
    const { data: aboutData } = useQuery({
        queryKey: ["about-hero"],
        queryFn: fetchAboutHero,
    });

    const data = aboutData || defaultAboutData;
    const profileImage = data.imageSrc || SITE_USER_LOGO || null;
    const profileName = data.name || MY_FULL_NAME;

    return (
        <Section id="about">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <PageTitle
                    title={data.pageTitle || "About Me"}
                    subtitle={data.pageSubtitle || "How I explored, learned, and finally found my place in tech"}
                />

                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Left Column - Profile */}
                    <MotionWrapper
                        delay={0.2}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="md:w-2/5 flex justify-center md:justify-start"
                    >
                        <div className="space-y-8">
                            {/* Profile Card */}
                            <div className="relative">
                                {profileImage ? (
                                    <ImageZoom>
                                        <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-sm">
                                            <BlurImage
                                                src={profileImage}
                                                alt={profileName}
                                            />

                                            {/* Social Media Badges */}
                                            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                                {data.age && (
                                                    <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
                                                        <span className="text-white text-sm font-medium">{data.age}</span>
                                                    </div>
                                                )}
                                                <ReferralLink
                                                    href={SITE_LINKEDIN_URL}
                                                    className="bg-black/50 backdrop-blur-md rounded-full p-2"
                                                >
                                                    <LinkedinIcon className="w-5 h-5 text-white" />
                                                </ReferralLink>
                                                <ReferralLink
                                                    href={SITE_GITHUB_URL}
                                                    className="bg-black/50 backdrop-blur-md rounded-full p-2"
                                                >
                                                    <GithubIcon className="w-5 h-5 text-white" />
                                                </ReferralLink>
                                                <ReferralLink
                                                    href={SITE_YOUTUBE_URL}
                                                    className="bg-black/50 backdrop-blur-md rounded-full p-2"
                                                >
                                                    <YoutubeIcon className="w-5 h-5 text-white" />
                                                </ReferralLink>
                                            </div>
                                        </div>
                                    </ImageZoom>
                                ) : (
                                    <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-sm bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground">No image</span>
                                    </div>
                                )}

                                {/* Name & Title */}
                                <div className="mt-4 sm:mt-6 text-center md:text-left">
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{profileName}</h2>
                                    <p className="text-secondary-foreground text-base sm:text-lg">
                                        {data.title || "Software Developer | Frontend Focused"}
                                    </p>
                                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                                        {data.location || "Khulshi, Chittagong, BD (UTC+6)"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Right Column - Philosophy */}
                    <div className="md:w-3/5 space-y-6 sm:space-y-8 text-base">
                        {data.paragraphs?.map((paragraph, index) => (
                            <MotionWrapper key={index} direction="right" delay={0.2}>
                                <p
                                    className="leading-relaxed text-muted-foreground hover:text-foreground/80 transition-colors"
                                    dangerouslySetInnerHTML={{ __html: parseMarkdownParagraph(paragraph) }}
                                />
                            </MotionWrapper>
                        ))}

                        <MotionWrapper direction="right" delay={0.2}>
                            {/* Signature */}
                            <div className="mt-[-40px]">
                                <Signature />
                            </div>
                        </MotionWrapper>
                    </div>
                </div>
            </div>
        </Section>
    );
}
