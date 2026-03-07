"use client";

import { BlurImage } from "@/components/ui";
import { BookOpen, Clock, Users } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
    course: {
        slug: string;
        title: string;
        thumbnail: string | null;
        instructors: { name: string; image?: string | null }[];
        price: number;
        originalPrice?: number | null;
        currency: string;
        totalLessons: number;
        enrollmentCount: number;
        difficulty: string;
        isEnrolled?: boolean;
    };
}

export default function CourseCard({ course }: Readonly<CourseCardProps>) {
    const isFree = course.price === 0;
    const hasDiscount = course.originalPrice && course.originalPrice > course.price;
    const instructorNames = course.instructors?.map((i) => i.name).join(", ") || "Unknown";

    return (
        <Link
            href={`/courses/${course.slug}`}
            className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                {course.thumbnail ? (
                    <BlurImage
                        src={course.thumbnail}
                        alt={course.title}
                        className="aspect-video"
                        imageClassName="group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <BookOpen className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                )}
                {course.isEnrolled && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        Enrolled
                    </span>
                )}
                {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {Math.round(((course.originalPrice! - course.price) / course.originalPrice!) * 100)}% OFF
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-1">
                    {instructorNames}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {course.enrollmentCount}
                    </span>
                </div>

                {/* Price */}
                <div className="pt-1">
                    {isFree ? (
                        <span className="text-green-500 font-bold text-sm">Free</span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">
                                {course.currency === "BDT" ? "৳" : "$"} {course.price}
                            </span>
                            {hasDiscount && (
                                <span className="text-muted-foreground text-sm line-through">
                                    {course.currency === "BDT" ? "৳" : "$"}{course.originalPrice}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
