"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { Section, Skeleton } from "@/components/ui";
import { courses } from "@/lib/api";
import { parseMarkdown } from "@/lib/markdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function getYouTubeVideoId(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com") && parsed.pathname === "/watch") {
            return parsed.searchParams.get("v");
        }
        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.slice(1);
        }
        if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
            return parsed.pathname.split("/embed/")[1]?.split("?")[0] || null;
        }
    } catch {
        // noop
    }
    return null;
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// YouTube IFrame API types
declare global {
    interface Window {
        YT: {
            Player: new (
                el: string | HTMLElement,
                config: {
                    videoId: string;
                    playerVars?: Record<string, unknown>;
                    events?: {
                        onReady?: (event: { target: YTPlayer }) => void;
                        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
                    };
                }
            ) => YTPlayer;
            PlayerState: {
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady: (() => void) | undefined;
    }
}

interface YTPlayer {
    getDuration: () => number;
    destroy: () => void;
}

function YouTubePlayer({
    videoId,
    title,
    onEnded,
    onDurationDetected,
}: Readonly<{
    videoId: string;
    title: string;
    onEnded: () => void;
    onDurationDetected: (duration: string) => void;
}>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const currentVideoIdRef = useRef(videoId);

    useEffect(() => {
        currentVideoIdRef.current = videoId;

        const createPlayer = () => {
            if (!containerRef.current || !window.YT?.Player) return;

            // Destroy old player
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch { /* noop */ }
                playerRef.current = null;
            }

            // Create a fresh div for the player
            const playerDiv = document.createElement("div");
            playerDiv.id = `yt-player-${videoId}`;
            containerRef.current.innerHTML = "";
            containerRef.current.appendChild(playerDiv);

            playerRef.current = new window.YT.Player(playerDiv.id, {
                videoId,
                width: "100%",
                height: "100%",
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    autoplay: 0,
                },
                events: {
                    onReady: (event) => {
                        const dur = event.target.getDuration();
                        if (dur > 0) {
                            onDurationDetected(formatDuration(dur));
                        }
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            onEnded();
                        }
                    },
                },
            });
        };

        // Load YouTube IFrame API if not already loaded
        if (window.YT?.Player) {
            createPlayer();
        } else {
            const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
            if (!existingScript) {
                const script = document.createElement("script");
                script.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(script);
            }
            window.onYouTubeIframeAPIReady = createPlayer;
        }

        return () => {
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch { /* noop */ }
                playerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    return (
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <div ref={containerRef} className="w-full h-full" title={title} />
        </div>
    );
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

    const handleToggleComplete = useCallback(() => {
        if (!activeLessonId || !course?.isEnrolled) return;
        const action = isCurrentCompleted ? "uncomplete" : "complete";
        progressMutation.mutate({ lessonId: activeLessonId, action });
        if (!isCurrentCompleted) {
            toast.success("Lesson marked as complete!");
        }
    }, [activeLessonId, course?.isEnrolled, isCurrentCompleted, progressMutation]);

    const handleVideoEnded = useCallback(() => {
        if (!activeLessonId || !course?.isEnrolled || isCurrentCompleted) return;
        progressMutation.mutate({ lessonId: activeLessonId, action: "complete" });
        toast.success("Lesson auto-completed!");
    }, [activeLessonId, course?.isEnrolled, isCurrentCompleted, progressMutation]);

    const handleDurationDetected = useCallback((duration: string) => {
        if (!activeLessonId || !activeLesson?.duration) {
            // Only update if there's no duration set yet
            // We could save it via API, but for now just display it
        }
        // We don't persist auto-detected duration to avoid unnecessary API calls
        // Admin can set it manually in module editor
        void duration;
    }, [activeLessonId, activeLesson?.duration]);

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

    const videoId = activeLesson?.videoUrl ? getYouTubeVideoId(activeLesson.videoUrl) : null;

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
                        {/* Video player — only for video lessons */}
                        {activeLesson?.contentType === "video" && videoId ? (
                            <YouTubePlayer
                                videoId={videoId}
                                title={activeLesson.title}
                                onEnded={handleVideoEnded}
                                onDurationDetected={handleDurationDetected}
                            />
                        ) : activeLesson?.contentType === "video" ? (
                            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                                <p className="text-muted-foreground">No video available</p>
                            </div>
                        ) : null}
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

                            {/* Lesson note */}
                            {activeLesson?.content && (
                                <div className="pt-4 border-t border-border">
                                    <h3 className="text-sm font-medium text-foreground mb-2">Note</h3>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground p-4 bg-muted/30 border border-border rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(activeLesson.content) }}
                                    />
                                </div>
                            )}
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
