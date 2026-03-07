"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { ErrorState, PageTitle, Section, Skeleton } from "@/components/ui";
import { courses } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CourseCard from "./CourseCard";

export default function CoursesIndex() {
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [page, setPage] = useState(1);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
    }, [isSearchOpen]);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["courses", search, page],
        queryFn: () => courses.getAll(page, 20, { search: search || undefined }),
    });

    const hasCourses = (data?.courses?.length || 0) > 0;
    const hasSearch = search.trim().length > 0;

    const clearSearch = () => {
        setSearchInput("");
        setIsSearchOpen(false);
    };

    if (isError) {
        return (
            <Section id="courses">
                <PageTitle
                    title="Courses"
                    subtitle="Browse and enroll in courses to level up your skills"
                />
                <ErrorState
                    title="Failed to load courses"
                    message={error instanceof Error ? error.message : "We couldn't load the courses. Please check your connection and try again."}
                    onRetry={() => refetch()}
                />
            </Section>
        );
    }

    return (
        <Section id="courses">
            {(isLoading || hasCourses || hasSearch) && (
                <PageTitle
                    title="Courses"
                    subtitle="Browse and enroll in courses to level up your skills"
                />
            )}

            {/* Search - inline tag style */}
            {(isLoading || hasCourses || hasSearch) && (
                <MotionWrapper direction="left" delay={0.2}>
                    <div className="mb-8 flex flex-wrap items-center gap-2">
                        {isSearchOpen ? (
                            <div className="relative inline-flex items-center">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-48 sm:w-64 h-8 pl-8 pr-7 text-sm rounded-lg bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                                />
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                aria-label="Search courses"
                            >
                                <Search className="w-3.5 h-3.5" />
                            </button>
                        )}

                        {!isLoading && data?.total > 0 && (
                            <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-md bg-muted">
                                {data.total} {data.total === 1 ? "course" : "courses"}
                            </span>
                        )}
                    </div>
                </MotionWrapper>
            )}

            {/* Course Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <MotionWrapper key={i} delay={0.1 + i * 0.05}>
                            <div className="rounded-xl border border-border overflow-hidden bg-card">
                                <Skeleton className="aspect-video" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-5 w-4/5 rounded-md" />
                                    <Skeleton className="h-3.5 w-2/3 rounded-md" />
                                    <div className="flex items-center gap-3 pt-1">
                                        <Skeleton className="h-3 w-16 rounded-md" />
                                        <Skeleton className="h-3 w-12 rounded-md" />
                                    </div>
                                    <Skeleton className="h-5 w-20 rounded-md" />
                                </div>
                            </div>
                        </MotionWrapper>
                    ))}
                </div>
            ) : hasCourses ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.courses.map((course: Record<string, unknown>, index: number) => (
                            <MotionWrapper key={course.id as string} delay={0.1 + index * 0.05}>
                                <CourseCard course={course as CourseCardProps["course"]} />
                            </MotionWrapper>
                        ))}
                    </div>

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                        <MotionWrapper delay={0.3}>
                            <div className="flex items-center justify-center gap-3 mt-12">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground disabled:opacity-40 hover:bg-muted/80 transition-colors cursor-pointer disabled:cursor-default"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <span className="text-sm text-muted-foreground tabular-nums">
                                    {page} / {data.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                                    disabled={page === data.totalPages}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground disabled:opacity-40 hover:bg-muted/80 transition-colors cursor-pointer disabled:cursor-default"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </MotionWrapper>
                    )}
                </>
            ) : hasSearch ? (
                <MotionWrapper delay={0.2}>
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                            No matching courses
                        </h3>
                        <p className="text-muted-foreground max-w-md leading-relaxed">
                            No courses found for &ldquo;{search}&rdquo;. Try a different search term.
                        </p>
                        <button
                            onClick={clearSearch}
                            className="mt-6 px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                </MotionWrapper>
            ) : (
                <MotionWrapper delay={0.2}>
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                            <BookOpen className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                            Courses
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            No courses available yet
                        </p>
                        <p className="text-muted-foreground max-w-lg leading-relaxed text-base sm:text-lg">
                            New courses are being prepared to help you level up your skills. Check back soon for fresh content and learning materials.
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
            )}
        </Section>
    );
}

type CourseCardProps = React.ComponentProps<typeof CourseCard>;
