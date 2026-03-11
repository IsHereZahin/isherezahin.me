"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, Skeleton } from "@/components/ui";
import { courses } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, PlayCircle, Users } from "lucide-react";
import Link from "next/link";

export default function ProfileCourses() {
    const { data, isLoading } = useQuery({
        queryKey: ["my-enrolled-courses"],
        queryFn: () => courses.getMyEnrolledCourses(),
    });

    const enrolledCourses = data?.courses || [];

    return (
        <div className="space-y-6">
            <MotionWrapper>
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Track your learning progress across all enrolled courses.
                </p>
            </MotionWrapper>

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <MotionWrapper key={i} delay={0.1 + i * 0.05}>
                            <div className="rounded-xl border border-border overflow-hidden bg-card flex flex-col sm:flex-row">
                                <Skeleton className="aspect-video sm:w-48 flex-shrink-0" />
                                <div className="flex-1 p-4 space-y-3">
                                    <Skeleton className="h-5 w-3/5 rounded-md" />
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-2 w-full rounded-full" />
                                    <Skeleton className="h-4 w-24 rounded-md" />
                                </div>
                            </div>
                        </MotionWrapper>
                    ))}
                </div>
            ) : enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                    {enrolledCourses.map((course: EnrolledCourse, index: number) => (
                        <MotionWrapper key={course.id} delay={0.1 + index * 0.05}>
                            <Link
                                href={`/courses/${course.slug}`}
                                className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {/* Thumbnail */}
                                    <div className="relative sm:w-48 flex-shrink-0 overflow-hidden bg-muted">
                                        <div className="aspect-video sm:h-full">
                                            {course.thumbnail ? (
                                                <BlurImage
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full"
                                                    imageClassName="group-hover:scale-105 transition-transform duration-500 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                                    <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>
                                        {course.enrollment?.status === "completed" && (
                                            <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                                Completed
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                    {course.title}
                                                </h3>
                                                <span className="hidden sm:inline-flex capitalize px-2 py-0.5 bg-muted rounded text-[10px] font-semibold text-muted-foreground flex-shrink-0">
                                                    {course.difficulty}
                                                </span>
                                            </div>

                                            {/* Instructors */}
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                {course.instructors?.length > 0 && (
                                                    <div className="flex -space-x-1.5">
                                                        {course.instructors.slice(0, 3).map((inst: { name: string; image?: string | null }, i: number) => (
                                                            inst.image ? (
                                                                <img
                                                                    key={i}
                                                                    src={inst.image}
                                                                    alt={inst.name}
                                                                    className="w-5 h-5 rounded-full border border-card object-cover"
                                                                />
                                                            ) : (
                                                                <div
                                                                    key={i}
                                                                    className="w-5 h-5 rounded-full border border-card bg-muted flex items-center justify-center"
                                                                >
                                                                    <span className="text-[8px] font-bold text-muted-foreground">
                                                                        {inst.name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {course.instructors?.map((i: { name: string }) => i.name).join(", ")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    {course.enrollment?.progressPercent || 0}% complete
                                                </span>
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="w-3 h-3" />
                                                        {course.totalLessons} lessons
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {course.enrollmentCount}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                                    style={{ width: `${course.enrollment?.progressPercent || 0}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action hint */}
                                        <div className="flex items-center gap-1.5 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-3.5 h-3.5" />
                                            {course.enrollment?.lastAccessedLessonId ? "Continue Learning" : "Start Course"}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </MotionWrapper>
                    ))}
                </div>
            ) : (
                <MotionWrapper delay={0.2}>
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-border rounded-xl bg-card">
                        <div className="mb-4 p-4 rounded-2xl bg-muted/50">
                            <GraduationCap className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">No courses yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            You haven&apos;t enrolled in any courses yet. Browse available courses to start learning.
                        </p>
                        <Link
                            href="/courses"
                            className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </MotionWrapper>
            )}
        </div>
    );
}

interface EnrolledCourse {
    id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail: string | null;
    difficulty: string;
    instructors: { name: string; image?: string | null }[];
    totalLessons: number;
    enrollmentCount: number;
    isEnrolled: boolean;
    enrollment?: {
        progressPercent: number;
        status: string;
        enrolledAt: string;
        lastAccessedLessonId: string | null;
    };
}
