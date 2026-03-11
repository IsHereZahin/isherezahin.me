"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, Section, Skeleton } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { courses } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, CheckCircle, ChevronRight, GraduationCap, Layers, PlayCircle, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CourseCard from "./CourseCard";
import CourseSyllabus from "./CourseSyllabus";

interface CourseDetailIndexProps {
    slug: string;
}

export default function CourseDetailIndex({ slug }: Readonly<CourseDetailIndexProps>) {
    const { user, status: authStatus } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: course, isLoading } = useQuery({
        queryKey: ["course", slug],
        queryFn: () => courses.get(slug),
    });

    // Fetch related courses (only when course has a category)
    const { data: relatedData } = useQuery({
        queryKey: ["courses", "related", course?.category],
        queryFn: () =>
            courses.getAll(1, 5, { category: course!.category }),
        enabled: !!course?.category,
    });

    const enrollMutation = useMutation({
        mutationFn: () => courses.enroll(slug),
        onSuccess: () => {
            toast.success("Enrolled successfully!");
            queryClient.invalidateQueries({ queryKey: ["course", slug] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    if (isLoading) {
        return (
            <Section id="course-detail">
                <Skeleton className="h-8 w-2/3 mb-4" />
                <Skeleton className="h-5 w-1/3 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="aspect-video rounded-xl" />
                        <Skeleton className="h-20" />
                    </div>
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </Section>
        );
    }

    if (!course) {
        return (
            <Section id="course-detail">
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">Course not found</p>
                    <Link href="/courses" className="text-primary text-sm mt-2 inline-block hover:underline">
                        Back to courses
                    </Link>
                </div>
            </Section>
        );
    }

    const isFree = course.price === 0;
    const hasDiscount = course.originalPrice && course.originalPrice > course.price;
    const currencySymbol = course.currency === "BDT" ? "৳" : "$";

    const handleEnroll = () => {
        if (authStatus !== "authenticated") {
            toast.error("Please sign in to enroll");
            return;
        }
        enrollMutation.mutate();
    };

    const handleStartCourse = () => {
        // Navigate to first lesson or last accessed
        const firstLesson = course.modules?.[0]?.lessons?.[0];
        const targetLessonId = course.enrollment?.lastAccessedLessonId || firstLesson?._id;
        if (targetLessonId) {
            router.push(`/courses/${slug}/learn?lesson=${targetLessonId}`);
        }
    };

    const relatedCourses = relatedData?.courses?.filter(
        (c: { slug: string }) => c.slug !== slug
    )?.slice(0, 4);

    return (
        <Section id="course-detail" className="px-6 py-8 max-w-6xl">
            {/* Breadcrumb */}
            <MotionWrapper>
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/courses" className="hover:text-foreground transition-colors">
                        Courses
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium truncate">{course.title}</span>
                </nav>
            </MotionWrapper>

            {/* Enrolled progress card */}
            {course.isEnrolled && (
                <MotionWrapper delay={0.1}>
                    <div className="mb-8 p-5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1">
                            <p className="font-semibold text-foreground flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                Course Progress
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                You have completed {course.enrollment?.progressPercent || 0}% of this course
                            </p>
                            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden max-w-xs">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${course.enrollment?.progressPercent || 0}%` }}
                                />
                            </div>
                        </div>
                        {course.thumbnail && (
                            <BlurImage
                                src={course.thumbnail}
                                alt=""
                                width={120}
                                height={68}
                                className="rounded-lg hidden sm:block"
                            />
                        )}
                        <button
                            onClick={handleStartCourse}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <PlayCircle className="w-4 h-4" />
                            {course.enrollment?.lastAccessedLessonId ? "Continue Learning" : "Start Course"}
                        </button>
                    </div>
                </MotionWrapper>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Title & info - shown for non-enrolled */}
                    {!course.isEnrolled && (
                        <MotionWrapper delay={0.1}>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {course.title}
                            </h1>
                            {course.description && (
                                <p className="text-muted-foreground mt-3 leading-relaxed">
                                    {course.description}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    {course.totalLessons} lessons
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    {course.enrollmentCount} enrolled
                                </span>
                                <span className="capitalize px-2 py-0.5 bg-muted rounded text-xs font-medium">
                                    {course.difficulty}
                                </span>
                            </div>

                            {/* Enroll button (mobile) */}
                            <div className="lg:hidden mt-6 p-4 bg-card border border-border rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    {isFree ? (
                                        <span className="text-2xl font-bold text-green-500">Free</span>
                                    ) : (
                                        <>
                                            <span className="text-2xl font-bold text-foreground">
                                                {currencySymbol} {course.price}
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-lg text-muted-foreground line-through">
                                                    {currencySymbol}{course.originalPrice}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrollMutation.isPending}
                                    className="w-full py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                                </button>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Syllabus */}
                    <MotionWrapper delay={0.2}>
                        <CourseSyllabus
                            modules={course.modules || []}
                            completedLessons={course.enrollment?.completedLessons || []}
                            isEnrolled={course.isEnrolled}
                            progressPercent={course.enrollment?.progressPercent || 0}
                            onLessonClick={(lessonId) => {
                                if (course.isEnrolled) {
                                    router.push(`/courses/${slug}/learn?lesson=${lessonId}`);
                                }
                            }}
                        />
                    </MotionWrapper>

                    {/* Instructors - shown in main content only for non-enrolled */}
                    {!course.isEnrolled && course.instructors?.length > 0 && (
                        <MotionWrapper delay={0.3}>
                            <div className="border border-border rounded-xl p-5 bg-card">
                                <h3 className="font-semibold text-foreground mb-4">Course {course.instructors.length > 1 ? "Instructors" : "Instructor"}</h3>
                                <div className="space-y-4">
                                    {course.instructors.map((instructor: { name: string; image?: string | null; bio?: string | null }, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            {instructor.image ? (
                                                <BlurImage
                                                    src={instructor.image}
                                                    alt={instructor.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full w-12 h-12 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg font-bold text-muted-foreground">
                                                        {instructor.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-foreground">{instructor.name}</p>
                                                {instructor.bio && (
                                                    <p className="text-sm text-muted-foreground mt-0.5">{instructor.bio}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </MotionWrapper>
                    )}

                    {/* Learning Outcomes */}
                    {course.learningOutcomes?.length > 0 && (
                        <MotionWrapper delay={0.35}>
                            <div className="border border-border rounded-xl p-5 bg-card">
                                <h3 className="font-semibold text-foreground mb-4">What you will learn</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {course.learningOutcomes.map((outcome: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </MotionWrapper>
                    )}
                </div>

                {/* Sidebar - Enroll card (desktop only, for non-enrolled) */}
                {!course.isEnrolled && (
                    <div className="hidden lg:block">
                        <MotionWrapper delay={0.2}>
                            <div className="sticky top-24 border border-border rounded-xl overflow-hidden bg-card">
                                {course.thumbnail && (
                                    <BlurImage
                                        src={course.thumbnail}
                                        alt={course.title}
                                        width={400}
                                        height={225}
                                        className="aspect-video w-full"
                                    />
                                )}
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        {isFree ? (
                                            <span className="text-2xl font-bold text-green-500">Free</span>
                                        ) : (
                                            <>
                                                <span className="text-2xl font-bold text-foreground">
                                                    {currencySymbol} {course.price}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-lg text-muted-foreground line-through">
                                                        {currencySymbol}{course.originalPrice}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrollMutation.isPending}
                                        className="w-full py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                                    </button>
                                    <div className="text-xs text-muted-foreground space-y-1.5 pt-2 border-t border-border">
                                        <p className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> {course.totalLessons} lessons</p>
                                        <p className="flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> {course.totalModules} modules</p>
                                        <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {course.enrollmentCount} students enrolled</p>
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    </div>
                )}

                {/* Sidebar - Instructors & Summary (for enrolled users) */}
                {course.isEnrolled && (
                    <div className="order-first lg:order-none">
                        <MotionWrapper delay={0.2}>
                            <div className="lg:sticky lg:top-24 space-y-6">
                                {/* Course Summary */}
                                <div className="border border-border rounded-xl p-5 bg-card">
                                    <h3 className="font-semibold text-foreground mb-3">Course Summary</h3>
                                    {course.description && (
                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{course.description}</p>
                                    )}
                                    <div className="text-xs text-muted-foreground space-y-1.5 pt-2 border-t border-border">
                                        <p className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> {course.totalLessons} lessons</p>
                                        <p className="flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> {course.totalModules} modules</p>
                                        <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {course.enrollmentCount} students enrolled</p>
                                    </div>
                                </div>

                                {/* Instructors */}
                                {course.instructors?.length > 0 && (
                                    <div className="border border-border rounded-xl p-5 bg-card">
                                        <h3 className="font-semibold text-foreground mb-4">Course {course.instructors.length > 1 ? "Instructors" : "Instructor"}</h3>
                                        <div className="space-y-4">
                                            {course.instructors.map((instructor: { name: string; image?: string | null; bio?: string | null }, i: number) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    {instructor.image ? (
                                                        <BlurImage
                                                            src={instructor.image}
                                                            alt={instructor.name}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-full w-12 h-12 flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                                            <span className="text-lg font-bold text-muted-foreground">
                                                                {instructor.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-foreground">{instructor.name}</p>
                                                        {instructor.bio && (
                                                            <p className="text-sm text-muted-foreground mt-0.5">{instructor.bio}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </MotionWrapper>
                    </div>
                )}

            </div>

            {/* Related Courses */}
            {relatedCourses?.length > 0 && (
                <MotionWrapper delay={0.4}>
                    <div className="mt-16">
                        <h2 className="text-xl font-bold text-foreground mb-6">
                            Related Courses
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedCourses.map((c: Record<string, unknown>) => (
                                <CourseCard key={c.id as string} course={c as React.ComponentProps<typeof CourseCard>["course"]} />
                            ))}
                        </div>
                    </div>
                </MotionWrapper>
            )}
        </Section>
    );
}
