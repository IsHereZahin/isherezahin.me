"use client";

import { BlurImage, ConfirmDialog, Skeleton } from "@/components/ui";
import { courses } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Edit, Eye, Trash2, Users, Plus, Layers } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import CourseFormModal from "./CourseFormModal";
import ModuleEditor from "./ModuleEditor";

interface Course {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    status: string;
    enrollmentCount: number;
    totalLessons: number;
    totalModules: number;
    price: number;
    originalPrice?: number | null;
    currency: string;
    difficulty: string;
    category: string | null;
    tags: string[];
    instructors: { id: string; name: string; image?: string | null; bio?: string | null }[];
    description: string;
    learningOutcomes: string[];
    createdAt: string;
}

export default function AdminCourses() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [managingModules, setManagingModules] = useState<Course | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-courses"],
        queryFn: () => courses.getAll(1, 100, { status: "all" }),
    });

    const deleteMutation = useMutation({
        mutationFn: (slug: string) => courses.delete(slug),
        onSuccess: () => {
            toast.success("Course deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            setDeleteTarget(null);
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const statusColors: Record<string, string> = {
        draft: "bg-yellow-500/10 text-yellow-500",
        published: "bg-green-500/10 text-green-500",
        archived: "bg-gray-500/10 text-gray-400",
    };

    if (managingModules) {
        return (
            <ModuleEditor
                course={managingModules}
                onBack={() => {
                    setManagingModules(null);
                    queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Courses</h2>
                    <p className="text-sm text-muted-foreground">
                        {data?.courses?.length || 0} total courses
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingCourse(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    New Course
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
            ) : data?.courses?.length > 0 ? (
                <div className="space-y-3">
                    {data.courses.map((course: Course) => (
                        <div
                            key={course.id}
                            className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors"
                        >
                            {/* Thumbnail */}
                            <div className="w-20 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {course.thumbnail ? (
                                    <BlurImage
                                        src={course.thumbnail}
                                        alt=""
                                        width={80}
                                        height={48}
                                        className="w-20 h-12"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-muted-foreground/50" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-foreground text-sm truncate">
                                        {course.title}
                                    </h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[course.status] || ""}`}>
                                        {course.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span>{course.totalModules} modules</span>
                                    <span>{course.totalLessons} lessons</span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {course.enrollmentCount}
                                    </span>
                                    <span>
                                        {course.price === 0 ? "Free" : `${course.currency === "BDT" ? "৳" : "$"}${course.price}`}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                    title="View"
                                >
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                </Link>
                                <button
                                    onClick={() => setManagingModules(course)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer text-xs font-medium"
                                    title="Manage Modules & Lessons"
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    Content
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingCourse(course);
                                        setShowForm(true);
                                    }}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(course)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No courses yet</p>
                    <p className="text-sm">Create your first course to get started</p>
                </div>
            )}

            {/* Course Form Modal */}
            {showForm && (
                <CourseFormModal
                    course={editingCourse}
                    onClose={() => {
                        setShowForm(false);
                        setEditingCourse(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingCourse(null);
                        queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
                    }}
                />
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <ConfirmDialog
                    open={true}
                    onOpenChange={() => setDeleteTarget(null)}
                    title="Delete Course"
                    description={`Are you sure you want to delete "${deleteTarget.title}"? This will also remove all enrollments. This action cannot be undone.`}
                    onConfirm={() => deleteMutation.mutate(deleteTarget.slug)}
                    confirmText="Delete"
                    variant="danger"
                />
            )}
        </div>
    );
}
