"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, Button, ImageZoom, Section, Skeleton } from "@/components/ui";
import { hero as heroApi } from "@/lib/api";
import { MY_NAME, SITE_USER_LOGO } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown } from "lucide-react";
import { type ReactNode } from "react";

interface HeroButton {
    text: string;
    href: string;
    icon?: string;
    variant?: string;
}

interface HeroData {
    _id?: string;
    profileImage: string;
    greeting: string;
    name: string;
    tagline: string;
    description: string;
    highlightedSkills: string[];
    buttons: HeroButton[];
    isActive: boolean;
}

// Default fallback data
const defaultHero: HeroData = {
    profileImage: SITE_USER_LOGO || "",
    greeting: "Hey, I'm",
    name: MY_NAME,
    tagline: "Coder & Thinker",
    description: "I work with React & Laravel Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.",
    highlightedSkills: ["React", "Laravel"],
    buttons: [
        { text: "Learn More", href: "#about-me", icon: "ArrowDown", variant: "default" },
        { text: "More about me", href: "/about", icon: "", variant: "default" },
    ],
    isActive: true,
};

// Helper to render icon based on icon name
const renderIcon = (iconName?: string) => {
    if (iconName === "ArrowDown") {
        return <ArrowDown className="size-[70%] text-foreground" />;
    }
    return undefined;
};

// Helper to render description with highlighted skills
const renderDescription = (description: string, skills: string[]) => {
    if (!skills || skills.length === 0) {
        return description;
    }

    let result: ReactNode[] = [description];

    skills.forEach((skill, index) => {
        const newResult: ReactNode[] = [];
        result.forEach((part) => {
            if (typeof part === "string") {
                const parts = part.split(new RegExp(`(${skill})`, "gi"));
                parts.forEach((p, i) => {
                    if (p.toLowerCase() === skill.toLowerCase()) {
                        newResult.push(
                            <b key={`${skill}-${index}-${i}`} className="text-foreground">
                                {p}
                            </b>
                        );
                    } else if (p) {
                        newResult.push(p);
                    }
                });
            } else {
                newResult.push(part);
            }
        });
        result = newResult;
    });

    return result;
};

export default function Hero() {
    const { data, isLoading } = useQuery<HeroData>({
        queryKey: ["hero"],
        queryFn: () => heroApi.get(),
    });

    const heroData = {
        ...defaultHero,
        ...data,
        buttons: data?.buttons?.length ? data.buttons : defaultHero.buttons,
        highlightedSkills: data?.highlightedSkills?.length ? data.highlightedSkills : defaultHero.highlightedSkills,
    };
    const profileImage = heroData.profileImage || SITE_USER_LOGO;

    if (isLoading) {
        return (
            <Section id="profile" animate={true}>
                <div className="flex flex-col justify-center items-start text-left">
                    <Skeleton className="size-20 sm:size-25 rounded-full mb-6 sm:mb-8" />
                    <Skeleton className="h-12 w-80 mb-3 sm:mb-4" />
                    <Skeleton className="h-6 w-full max-w-xl mb-4 sm:mb-6" />
                    <div className="mt-4 sm:mt-8 flex gap-2 sm:gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
            </Section>
        );
    }

    return (
        <Section id="profile" animate={true}>
            <div className="flex flex-col justify-center items-start text-left">
                {/* Profile Picture */}
                <MotionWrapper
                    delay={0.1}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {profileImage && (
                        <div className="relative size-20 sm:size-25 rounded-full overflow-hidden shadow-lg mb-6 sm:mb-8">
                            <ImageZoom>
                                <BlurImage
                                    src={profileImage}
                                    alt="Profile Photo"
                                    className="w-full h-full object-cover"
                                    width={500}
                                    height={500}
                                />
                            </ImageZoom>
                        </div>
                    )}
                </MotionWrapper>

                {/* Heading */}
                <MotionWrapper
                    direction="top"
                    delay={0.2}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
                        {heroData.greeting} <span className="text-primary">{heroData.name}</span>. <br />
                        {heroData.tagline}
                    </h1>
                </MotionWrapper>

                {/* Description */}
                <MotionWrapper
                    direction="top"
                    delay={0.3}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <p className="max-w-xl text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors mb-4 sm:mb-6 leading-relaxed">
                        {renderDescription(heroData.description, heroData.highlightedSkills)}
                    </p>
                </MotionWrapper>

                {/* Buttons */}
                <MotionWrapper
                    direction="bottom"
                    delay={0.4}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="mt-4 sm:mt-8 flex gap-2 sm:gap-4 flex-wrap">
                        {heroData.buttons.map((button, index) => (
                            <Button
                                key={index}
                                href={button.href}
                                text={button.text}
                                icon={renderIcon(button.icon)}
                            />
                        ))}
                    </div>
                </MotionWrapper>
            </div>
        </Section>
    );
}