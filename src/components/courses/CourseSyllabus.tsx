"use client";

import { CheckCircle, ChevronDown, Lock, PlayCircle, FileText } from "lucide-react";
import { useState } from "react";

interface Lesson {
    _id: string;
    title: string;
    order: number;
    contentType: string;
    duration?: string | null;
    isFree?: boolean;
    videoUrl?: string | null;
}

interface Module {
    _id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface CourseSyllabusProps {
    modules: Module[];
    completedLessons?: string[];
    isEnrolled?: boolean;
    onLessonClick?: (lessonId: string) => void;
    activeLessonId?: string | null;
    progressPercent?: number;
}

export default function CourseSyllabus({
    modules,
    completedLessons = [],
    isEnrolled = false,
    onLessonClick,
    activeLessonId,
    progressPercent = 0,
}: Readonly<CourseSyllabusProps>) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
        // Expand first module by default
        const initial = new Set<string>();
        if (modules.length > 0) {
            initial.add(modules[0]._id);
        }
        return initial;
    });

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground">Course Syllabus</h3>
                <span className="text-sm text-muted-foreground">
                    {progressPercent}% complete
                </span>
            </div>

            {/* Progress bar */}
            {isEnrolled && (
                <div className="h-1 bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            )}

            {/* Modules */}
            <div className="divide-y divide-border">
                {modules
                    .sort((a, b) => a.order - b.order)
                    .map((module) => {
                        const isExpanded = expandedModules.has(module._id);
                        const moduleLessonCount = module.lessons.length;
                        const completedInModule = module.lessons.filter((l) =>
                            completedLessons.includes(l._id)
                        ).length;

                        return (
                            <div key={module._id}>
                                {/* Module header */}
                                <button
                                    onClick={() => toggleModule(module._id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground text-sm">
                                            {module.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {moduleLessonCount} {moduleLessonCount === 1 ? "lesson" : "lessons"}
                                            {isEnrolled && completedInModule > 0 && (
                                                <span> · {completedInModule} completed</span>
                                            )}
                                        </p>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
                                            isExpanded ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Lessons */}
                                {isExpanded && (
                                    <div className="border-t border-border/50 bg-muted/20">
                                        {module.lessons
                                            .sort((a, b) => a.order - b.order)
                                            .map((lesson) => {
                                                const isCompleted = completedLessons.includes(lesson._id);
                                                const isActive = activeLessonId === lesson._id;
                                                const canAccess = isEnrolled || lesson.isFree;

                                                return (
                                                    <button
                                                        key={lesson._id}
                                                        onClick={() => canAccess && onLessonClick?.(lesson._id)}
                                                        disabled={!canAccess && !onLessonClick}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm ${
                                                            isActive
                                                                ? "bg-primary/10 text-primary"
                                                                : canAccess
                                                                ? "hover:bg-muted/50 text-foreground cursor-pointer"
                                                                : "text-muted-foreground cursor-default"
                                                        }`}
                                                    >
                                                        {/* Icon */}
                                                        <div className="flex-shrink-0">
                                                            {isCompleted ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : isActive ? (
                                                                <PlayCircle className="w-4 h-4 text-primary" />
                                                            ) : !canAccess ? (
                                                                <Lock className="w-4 h-4" />
                                                            ) : lesson.contentType === "video" ? (
                                                                <PlayCircle className="w-4 h-4" />
                                                            ) : (
                                                                <FileText className="w-4 h-4" />
                                                            )}
                                                        </div>

                                                        {/* Lesson info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate">{lesson.title}</p>
                                                        </div>

                                                        {/* Duration / Free badge */}
                                                        <div className="flex-shrink-0 flex items-center gap-2">
                                                            {lesson.isFree && !isEnrolled && (
                                                                <span className="text-xs text-green-500 font-medium">
                                                                    Free
                                                                </span>
                                                            )}
                                                            {lesson.duration && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {lesson.duration}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Footer summary */}
            <div className="p-3 border-t border-border bg-muted/20 text-center text-xs text-muted-foreground">
                {totalLessons} lessons · {modules.length} modules
            </div>
        </div>
    );
}
