"use client";

import BlurImage from "@/components/ui/BlurImage";
import ImageZoom from "@/components/ui/ImageZoom";
import Section from "@/components/ui/Section";
import { MY_FULL_NAME, SITE_GITHUB_URL, SITE_LINKEDIN_URL, SITE_YOUTUBE_URL } from "@/lib/constants";
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";
import profileImage from "../../../public/assets/profile.png";
import MotionWrapper from "../motion/MotionWrapper";
import ReferralLink from "../ui/ReferralLink";
import Signature from "../ui/Signature";

export default function AboutContent() {
    return (
        <Section id="about">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <MotionWrapper direction="top" distance={50} duration={0.6} delay={0.1}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16">
                        <span className="text-secondary-foreground">Building creative</span>
                        <br />
                        <span className="text-foreground">and user-friendly solutions.</span>
                    </h1>
                </MotionWrapper>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Left Column - Profile */}
                    <MotionWrapper direction="left" distance={50} duration={0.6} delay={0.2} className="md:w-2/5 flex justify-center md:justify-start">
                        <div className="space-y-8">
                            {/* Profile Card */}
                            <div className="relative">
                                <ImageZoom>
                                    <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-sm">
                                        <BlurImage
                                            src={profileImage}
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
                                <div className="mt-6 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-foreground">{MY_FULL_NAME}</h2>
                                    <p className="text-secondary-foreground text-lg">
                                        Software Developer | Frontend Focused
                                    </p>
                                    <p className="text-secondary-foreground text-sm mt-1">
                                        Khulshi, Chittagong, BD (UTC+6)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Right Column - Philosophy */}
                    <div className="md:w-3/5 space-y-8 text-lg">
                        <MotionWrapper direction="top" delay={0.2}>
                            <p className="leading-relaxed">
                                <strong className="text-foreground">I build creative and user-friendly solutions</strong>{" "}
                                <span className="text-secondary-foreground">
                                    that solve real-world problems in a simple way. With 2+ years of experience, I work mainly with <strong>React.js, Next.js, Vue.js, Laravel</strong> and tools like <strong>TypeScript, Tailwind CSS, Bootstrap, Figma, Postman, Docker, Git</strong> to deliver smooth and functional applications.
                                </span>
                            </p>
                        </MotionWrapper>

                        <MotionWrapper direction="top" delay={0.4}>
                            <p className="leading-relaxed">
                                <strong className="text-foreground">My projects range from SaaS platforms to file management systems</strong>{" "}
                                –{" "}
                                <span className="text-secondary-foreground">
                                    I focus on clean design, responsive interfaces, and intuitive user experiences. Whether building the frontend or contributing to backend APIs, I aim for simple, practical solutions that work in the real world.
                                </span>
                            </p>
                        </MotionWrapper>

                        <MotionWrapper direction="top" delay={0.6}>
                            <p className="leading-relaxed">
                                <strong className="text-foreground">I pay attention to details</strong>{" "}
                                <span className="text-secondary-foreground">
                                    because small improvements make a big difference. This approach helps me deliver high-quality work, collaborate effectively with teams, and create software users enjoy.
                                </span>
                            </p>
                        </MotionWrapper>

                        <MotionWrapper direction="top" delay={0.8}>
                            {/* Signature */}
                            <div className="mt-[-60px]">
                                <Signature />
                            </div>
                        </MotionWrapper>
                    </div>
                </div>
            </div>
        </Section>
    );
}
