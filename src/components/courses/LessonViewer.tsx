"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { Section, Skeleton } from "@/components/ui";
import { courses } from "@/lib/api";
import { parseMarkdown } from "@/lib/markdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CourseSyllabus from "./CourseSyllabus";

interface LessonViewerProps {
    slug: string;
}

interface Lesson {
    _id: string;
    title: string;
    order: number;
    contentType: string;
    videoUrl?: string | null;
    content?: string | null;
    duration?: string | null;
    isFree?: boolean;
}

interface Module {
    _id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

function getYouTubeEmbedUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        let videoId: string | null = null;

        if (parsed.hostname.includes("youtube.com")) {
            videoId = parsed.searchParams.get("v");
        } else if (parsed.hostname.includes("youtu.be")) {
            videoId = parsed.pathname.slice(1);
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch {
        // If it's already an embed URL, return as-is
        if (url.includes("youtube.com/embed/")) return url;
    }
    return url;
}

export default function LessonViewer({ slug }: Readonly<LessonViewerProps>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const lessonIdParam = searchParams.get("lesson");

    const { data: course, isLoading } = useQuery({
        queryKey: ["course", slug],
        queryFn: () => courses.get(slug),
    });

    // Flatten all lessons in order
    const allLessons = useMemo(() => {
        if (!course?.modules) return [];
        return course.modules
            .sort((a: Module, b: Module) => a.order - b.order)
            .flatMap((m: Module) =>
                m.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order)
            );
    }, [course]);

    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

    // Set active lesson from URL or default to first
    useEffect(() => {
        if (allLessons.length > 0) {
            if (lessonIdParam && allLessons.find((l: Lesson) => l._id === lessonIdParam)) {
                setActiveLessonId(lessonIdParam);
            } else {
                const defaultId = course?.enrollment?.lastAccessedLessonId || allLessons[0]._id;
                setActiveLessonId(defaultId);
            }
        }
    }, [allLessons, lessonIdParam, course]);

    const activeLesson = allLessons.find((l: Lesson) => l._id === activeLessonId);
    const activeLessonIndex = allLessons.findIndex((l: Lesson) => l._id === activeLessonId);
    const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
    const nextLesson = activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1] : null;

    const completedLessons = course?.enrollment?.completedLessons || [];
    const isCurrentCompleted = activeLessonId ? completedLessons.includes(activeLessonId) : false;

    const progressMutation = useMutation({
        mutationFn: ({ lessonId, action }: { lessonId: string; action: "complete" | "uncomplete" | "access" }) =>
            courses.updateProgress(slug, lessonId, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", slug] });
        },
    });

    // Track lesson access
    useEffect(() => {
        if (activeLessonId && course?.isEnrolled) {
            progressMutation.mutate({ lessonId: activeLessonId, action: "access" });
        }
        // Only run when activeLessonId changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLessonId]);

    const handleLessonClick = useCallback((lessonId: string) => {
        setActiveLessonId(lessonId);
        router.replace(`/courses/${slug}/learn?lesson=${lessonId}`, { scroll: false });
    }, [router, slug]);

    const handleToggleComplete = () => {
        if (!activeLessonId || !course?.isEnrolled) return;
        const action = isCurrentCompleted ? "uncomplete" : "complete";
        progressMutation.mutate({ lessonId: activeLessonId, action });
        if (!isCurrentCompleted) {
            toast.success("Lesson marked as complete!");
        }
    };

    const handleNavigate = (lesson: Lesson) => {
        handleLessonClick(lesson._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [showSidebar, setShowSidebar] = useState(false);

    if (isLoading) {
        return (
            <Section id="lesson-viewer" className="px-4 py-6 max-w-7xl">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Skeleton className="aspect-video rounded-xl" />
                        <Skeleton className="h-8 w-2/3 mt-4" />
                    </div>
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </Section>
        );
    }

    if (!course || !course.isEnrolled) {
        return (
            <Section id="lesson-viewer">
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        {!course ? "Course not found" : "You need to enroll to access lessons"}
                    </p>
                    <Link
                        href={course ? `/courses/${slug}` : "/courses"}
                        className="text-primary text-sm mt-2 inline-block hover:underline"
                    >
                        {course ? "Go to course page" : "Browse courses"}
                    </Link>
                </div>
            </Section>
        );
    }

    const embedUrl = activeLesson?.videoUrl ? getYouTubeEmbedUrl(activeLesson.videoUrl) : null;

    // Find which module the active lesson belongs to
    const activeModule = course.modules?.find((m: Module) =>
        m.lessons.some((l: Lesson) => l._id === activeLessonId)
    );

    return (
        <Section id="lesson-viewer" className="px-4 py-6 max-w-7xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
                <Link href="/courses" className="hover:text-foreground transition-colors">
                    Courses
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href={`/courses/${slug}`} className="hover:text-foreground transition-colors truncate max-w-32">
                    {course.title}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground truncate max-w-48">{activeLesson?.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2">
                    <MotionWrapper>
                        {/* Video player */}
                        {activeLesson?.contentType === "video" && embedUrl ? (
                            <div className="aspect-video bg-black rounded-xl overflow-hidden">
                                <iframe
                                    src={embedUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={activeLesson.title}
                                />
                            </div>
                        ) : activeLesson?.contentType === "text" && activeLesson.content ? (
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none p-6 bg-card border border-border rounded-xl"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(activeLesson.content) }}
                            />
                        ) : (
                            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                                <p className="text-muted-foreground">No content available</p>
                            </div>
                        )}
                    </MotionWrapper>

                    {/* Lesson info & actions */}
                    <MotionWrapper delay={0.1}>
                        <div className="mt-4 space-y-3">
                            <h2 className="text-lg font-semibold text-foreground">
                                {activeLesson?.title}
                            </h2>

                            {activeModule && (
                                <p className="text-sm text-muted-foreground">
                                    Module: {activeModule.title}
                                </p>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <button
                                    onClick={handleToggleComplete}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                        isCurrentCompleted
                                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                            : "bg-muted text-foreground hover:bg-muted/80"
                                    }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {isCurrentCompleted ? "Completed" : "Mark as Complete"}
                                </button>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copied!");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>

                                {/* Mobile sidebar toggle */}
                                <button
                                    onClick={() => setShowSidebar(!showSidebar)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                                >
                                    Syllabus
                                </button>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                {prevLesson ? (
                                    <button
                                        onClick={() => handleNavigate(prevLesson)}
                                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span className="truncate max-w-40">{prevLesson.title}</span>
                                    </button>
                                ) : (
                                    <div />
                                )}
                                {nextLesson ? (
                                    <button
                                        onClick={() => handleNavigate(nextLesson)}
                                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        <span className="truncate max-w-40">{nextLesson.title}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Mobile sidebar */}
                    {showSidebar && (
                        <div className="lg:hidden mt-6">
                            <CourseSyllabus
                                modules={course.modules || []}
                                completedLessons={completedLessons}
                                isEnrolled
                                activeLessonId={activeLessonId}
                                progressPercent={course.enrollment?.progressPercent || 0}
                                onLessonClick={handleLessonClick}
                            />
                        </div>
                    )}
                </div>

                {/* Desktop sidebar */}
                <div className="hidden lg:block">
                    <div className="sticky top-20">
                        <CourseSyllabus
                            modules={course.modules || []}
                            completedLessons={completedLessons}
                            isEnrolled
                            activeLessonId={activeLessonId}
                            progressPercent={course.enrollment?.progressPercent || 0}
                            onLessonClick={handleLessonClick}
                        />
                    </div>
                </div>
            </div>
        </Section>
    );
}
