"use client";

import { CheckCircle, ChevronDown, Lock, PlayCircle, FileText, HelpCircle } from "lucide-react";
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

function LessonIcon({ lesson, isCompleted, isActive, canAccess }: {
    lesson: Lesson;
    isCompleted: boolean;
    isActive: boolean;
    canAccess: boolean;
}) {
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-green-500" />;
    const colorClass = isActive ? "text-primary" : canAccess ? "" : "text-muted-foreground/50";

    if (!canAccess) {
        return (
            <span className="relative inline-flex items-center justify-center w-5 h-5">
                {lesson.contentType === "video" && <PlayCircle className={`w-4 h-4 ${colorClass}`} />}
                {lesson.contentType === "quiz" && <HelpCircle className={`w-4 h-4 ${colorClass}`} />}
                {lesson.contentType === "text" && <FileText className={`w-4 h-4 ${colorClass}`} />}
                <span className="absolute -bottom-0.5 -right-0.5 bg-card rounded-full p-[1px]">
                    <Lock className="w-2 h-2 text-muted-foreground" />
                </span>
            </span>
        );
    }

    if (lesson.contentType === "video") return <PlayCircle className={`w-4 h-4 ${colorClass}`} />;
    if (lesson.contentType === "quiz") return <HelpCircle className={`w-4 h-4 ${colorClass}`} />;
    return <FileText className={`w-4 h-4 ${colorClass}`} />;
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

    const allLessons = modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;

    const totalVideos = allLessons.filter((l) => l.contentType === "video").length;
    const totalTexts = allLessons.filter((l) => l.contentType === "text").length;
    const totalQuizzes = allLessons.filter((l) => l.contentType === "quiz").length;

    const completedVideos = allLessons.filter((l) => l.contentType === "video" && completedLessons.includes(l._id)).length;
    const completedTexts = allLessons.filter((l) => l.contentType === "text" && completedLessons.includes(l._id)).length;
    const completedQuizzes = allLessons.filter((l) => l.contentType === "quiz" && completedLessons.includes(l._id)).length;

    const statusParts: string[] = [];
    if (totalVideos > 0) statusParts.push(`${completedVideos}/${totalVideos} video`);
    if (totalTexts > 0) statusParts.push(`${completedTexts}/${totalTexts} text`);
    if (totalQuizzes > 0) statusParts.push(`${completedQuizzes}/${totalQuizzes} quiz`);

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Course Syllabus</h3>
                <span className="text-sm text-muted-foreground">
                    {progressPercent}% complete
                </span>
            </div>

            {/* Per-type completion status */}
            {isEnrolled && statusParts.length > 0 && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {statusParts.map((part) => (
                        <span key={part}>{part}</span>
                    ))}
                </div>
            )}

            {/* Progress bar */}
            {isEnrolled && (
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            )}

            {/* Modules */}
            <div className="space-y-3">
                {modules
                    .sort((a, b) => a.order - b.order)
                    .map((module) => {
                        const isExpanded = expandedModules.has(module._id);
                        const videoCount = module.lessons.filter((l) => l.contentType === "video").length;
                        const textCount = module.lessons.filter((l) => l.contentType === "text").length;
                        const quizCount = module.lessons.filter((l) => l.contentType === "quiz").length;

                        const completedVideos = module.lessons.filter((l) => l.contentType === "video" && completedLessons.includes(l._id)).length;
                        const completedTexts = module.lessons.filter((l) => l.contentType === "text" && completedLessons.includes(l._id)).length;
                        const completedQuizzes = module.lessons.filter((l) => l.contentType === "quiz" && completedLessons.includes(l._id)).length;

                        const parts: string[] = [];
                        if (videoCount > 0) parts.push(isEnrolled ? `${completedVideos}/${videoCount} video` : `${videoCount} video`);
                        if (textCount > 0) parts.push(isEnrolled ? `${completedTexts}/${textCount} text` : `${textCount} text`);
                        if (quizCount > 0) parts.push(isEnrolled ? `${completedQuizzes}/${quizCount} quiz` : `${quizCount} quiz`);

                        return (
                            <div key={module._id} className="border border-border rounded-lg overflow-hidden bg-card">
                                {/* Module header */}
                                <button
                                    onClick={() => toggleModule(module._id)}
                                    className="w-full flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors text-left cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground text-sm leading-snug">
                                            {module.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                                            {parts.map((part, i) => (
                                                <span key={i}>{part}</span>
                                            ))}
                                        </p>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-3 ${
                                            isExpanded ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Lessons */}
                                {isExpanded && (
                                    <div className="border-t border-border">
                                        {module.lessons
                                            .sort((a, b) => a.order - b.order)
                                            .map((lesson) => {
                                                const isCompleted = completedLessons.includes(lesson._id);
                                                const isActive = activeLessonId === lesson._id;
                                                const canAccess = isEnrolled || !!lesson.isFree;

                                                return (
                                                    <button
                                                        key={lesson._id}
                                                        onClick={() => canAccess && onLessonClick?.(lesson._id)}
                                                        disabled={!canAccess && !onLessonClick}
                                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm border-b border-border/50 last:border-b-0 ${
                                                            isActive
                                                                ? "bg-primary/10 text-primary"
                                                                : canAccess
                                                                ? "hover:bg-muted/40 text-foreground cursor-pointer"
                                                                : "text-muted-foreground cursor-default"
                                                        }`}
                                                    >
                                                        {/* Icon */}
                                                        <div className="flex-shrink-0">
                                                            <LessonIcon
                                                                lesson={lesson}
                                                                isCompleted={isCompleted}
                                                                isActive={isActive}
                                                                canAccess={canAccess}
                                                            />
                                                        </div>

                                                        {/* Lesson info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate text-[13px]">{lesson.title}</p>
                                                        </div>

                                                        {/* Duration / Free badge */}
                                                        <div className="flex-shrink-0 flex items-center gap-2">
                                                            {lesson.isFree && !isEnrolled && (
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 font-medium">
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
            <div className="text-center text-xs text-muted-foreground">
                {totalLessons} lessons · {modules.length} modules
            </div>
        </div>
    );
}
