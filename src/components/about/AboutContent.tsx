"use client";

import BlurImage from "@/components/ui/BlurImage";
import ImageZoom from "@/components/ui/ImageZoom";
import Section from "@/components/ui/Section";
import { MY_FULL_NAME, SITE_GITHUB_URL, SITE_LINKEDIN_URL, SITE_USER_LOGO, SITE_YOUTUBE_URL } from "@/lib/constants";
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";
import MotionWrapper from "../motion/MotionWrapper";
import PageTitle from "../ui/PageTitle";
import ReferralLink from "../ui/ReferralLink";
import Signature from "../ui/Signature";

export default function AboutContent() {
    return (
        <Section id="about">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <PageTitle title="About Me" subtitle="How I explored, learned, and finally found my place in tech" />

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
                                <ImageZoom>
                                    <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-sm">
                                        <BlurImage
                                            src={SITE_USER_LOGO}
                                            alt={MY_FULL_NAME}
                                        />

                                        {/* Social Media Badges */}
                                        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                            <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
                                                <span className="text-white text-sm font-medium">23Y</span>
                                            </div>
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

                                {/* Name & Title */}
                                <div className="mt-4 sm:mt-6 text-center md:text-left">
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{MY_FULL_NAME}</h2>
                                    <p className="text-secondary-foreground text-base sm:text-lg">
                                        Software Developer | Frontend Focused
                                    </p>
                                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                                        Khulshi, Chittagong, BD (UTC+6)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Right Column - Philosophy */}
                    <div className="md:w-3/5 space-y-6 sm:space-y-8 text-sm sm:text-base md:text-lg">
                        <MotionWrapper direction="right" delay={0.2}>
                            <p className="leading-relaxed text-muted-foreground hover:text-foreground/80 transition-colors">
                                I work with the <strong className="text-foreground">React & Laravel ecosystem</strong>, building robust web applications, dashboards, and internal tools. I focus on creating intuitive user experiences, clean interfaces, and maintainable code that performs reliably in real-world scenarios.
                            </p>
                        </MotionWrapper>

                        <MotionWrapper direction="right" delay={0.2}>
                            <p className="leading-relaxed text-muted-foreground hover:text-foreground/80 transition-colors">
                                Beyond coding, I write to teach and help others rethink fundamental concepts through mental models. My goal is to simplify complex ideas, inspire new ways of thinking, and empower developers to build smarter solutions.
                            </p>
                        </MotionWrapper>

                        <MotionWrapper direction="right" delay={0.2}>
                            <p className="leading-relaxed text-muted-foreground hover:text-foreground/80 transition-colors">
                                With 2+ years of experience, I leverage tools like <strong className="text-foreground">TypeScript, Tailwind CSS, Bootstrap, Figma, Postman, Docker, and Git</strong> to deliver scalable and high-quality software. I pay attention to details because even small improvements can make a significant difference in usability and performance.
                            </p>
                        </MotionWrapper>

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
