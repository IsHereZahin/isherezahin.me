"use client";

import { Compass, FileText, FolderOpen, Plus } from "lucide-react";
import MotionWrapper from "../motion/MotionWrapper";
import { Button } from "./shadcn-button";

type ContentType = "blogs" | "projects" | "quests";

interface AdminEmptyStateProps {
    type: ContentType;
    onAdd: () => void;
}

const contentConfig = {
    blogs: {
        icon: FileText,
        title: "Start Your Blog Journey",
        subtitle: "Share your knowledge with the world",
        description: "Create your first blog post to share insights, tutorials, and thoughts with your audience. Your content will inspire and help others.",
        buttonText: "Create First Blog",
    },
    projects: {
        icon: FolderOpen,
        title: "Showcase Your Work",
        subtitle: "Let your projects speak for themselves",
        description: "Add your first project to build an impressive portfolio. Highlight your skills, technologies used, and the impact of your work.",
        buttonText: "Add First Project",
    },
    quests: {
        icon: Compass,
        title: "Share Your Adventures",
        subtitle: "Document your side quests",
        description: "Add your first side quest to share your hobbies, adventures, and experiences. These moments add color to life beyond work.",
        buttonText: "Add First Quest",
    },
};

export default function AdminEmptyState({ type, onAdd }: Readonly<AdminEmptyStateProps>) {
    const config = contentConfig[type];
    const Icon = config.icon;

    return (
        <MotionWrapper direction="bottom" delay={0.2}>
            <div className="rounded-xl">
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">

                    {/* Icon */}
                    <div className="mb-6">
                        <div className="p-5 rounded-xl bg-muted">
                            <Icon className="w-10 h-10 text-foreground" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 mb-6">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {config.subtitle}
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {config.title}
                        </h3>
                        <p className="text-muted-foreground max-w-md leading-relaxed">
                            {config.description}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Button
                        onClick={onAdd}
                        size="lg"
                        className="px-8 cursor-pointer"
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            {config.buttonText}
                        </span>
                    </Button>

                    {/* Helper text */}
                    <p className="mt-6 text-xs text-muted-foreground/70">
                        Only you can see this as an admin
                    </p>
                </div>
            </div>
        </MotionWrapper>
    );
}
