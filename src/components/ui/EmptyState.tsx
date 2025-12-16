"use client";

import { Compass, FileText, FolderOpen, type LucideIcon, Scale, Shield } from "lucide-react";
import MotionWrapper from "../motion/MotionWrapper";

export type EmptyStateType = "blogs" | "projects" | "quests" | "privacy-policy" | "terms-of-service";

interface EmptyStateConfig {
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
}

interface EmptyStateProps {
    type: EmptyStateType;
    title?: string;
    subtitle?: string;
    description?: string;
}

const defaultContent: Record<EmptyStateType, EmptyStateConfig> = {
    blogs: {
        title: "Ideas, insights, & inspiration",
        subtitle: "No blogs published yet",
        description: "I'm crafting some thoughtful content about web development, design patterns, and technology insights. Check back soon for fresh perspectives and practical guides.",
        icon: FileText,
    },
    projects: {
        title: "Projects I've worked on",
        subtitle: "No projects to showcase yet",
        description: "I'm currently working on some exciting projects that showcase modern web development practices. Stay tuned to see what I'm building next.",
        icon: FolderOpen,
    },
    quests: {
        title: "Side Quests & Adventures",
        subtitle: "No quests shared yet",
        description: "Life's adventures and side quests are being documented. Check back soon to see hobbies, travels, and experiences that add color beyond the daily grind.",
        icon: Compass,
    },
    "privacy-policy": {
        title: "Privacy Policy",
        subtitle: "Coming soon",
        description: "This page is currently being prepared. Please check back soon for our privacy policy.",
        icon: Shield,
    },
    "terms-of-service": {
        title: "Terms of Service",
        subtitle: "Coming soon",
        description: "This page is currently being prepared. Please check back soon for our terms of service.",
        icon: Scale,
    },
};

export default function EmptyState({ type, title, subtitle, description }: Readonly<EmptyStateProps>) {
    const content = defaultContent[type];
    const Icon = content.icon;

    return (
        <MotionWrapper direction="bottom" delay={0.3}>
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                    <Icon className="w-10 h-10 text-muted-foreground" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    {title || content.title}
                </h3>

                {subtitle && (
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        {subtitle}
                    </p>
                )}

                <p className="text-muted-foreground max-w-lg leading-relaxed text-base sm:text-lg">
                    {description || content.description}
                </p>

                <div className="mt-10 flex items-center gap-3 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        Content coming soon
                    </span>
                </div>
            </div>
        </MotionWrapper>
    );
}