import { auth } from "@/auth";
import { CourseModel, EnrollmentModel } from "@/database/models/course-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();
        const { slug } = await params;

        const session = await auth();
        const isAdmin = await checkIsAdmin();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const course = await CourseModel.findOne({ slug }).lean() as any;
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Non-admins can't see draft/archived courses
        if (!isAdmin && course.status !== "published") {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Check enrollment
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let enrollment: any = null;
        if (session?.user?.id) {
            enrollment = await EnrollmentModel.findOne({
                userId: session.user.id,
                courseId: course._id,
            }).lean();
        }

        const isEnrolled = !!enrollment;

        // For non-enrolled, non-admin users: hide video URLs of non-free lessons
        const modules = course.modules?.map((module: Record<string, unknown>) => ({
            ...module,
            lessons: (module.lessons as Record<string, unknown>[])?.map((lesson: Record<string, unknown>) => {
                const canAccess = isAdmin || isEnrolled || lesson.isFree;
                return {
                    ...lesson,
                    videoUrl: canAccess ? lesson.videoUrl : null,
                    content: canAccess ? lesson.content : null,
                };
            }),
        })) || [];

        const totalLessons = modules.reduce(
            (sum: number, m: { lessons?: unknown[] }) => sum + (m.lessons?.length || 0),
            0
        );

        return NextResponse.json({
            id: course._id.toString(),
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnail: course.thumbnail,
            category: course.category,
            tags: course.tags,
            difficulty: course.difficulty,
            instructors: course.instructors,
            price: course.price,
            originalPrice: course.originalPrice,
            currency: course.currency,
            modules,
            learningOutcomes: course.learningOutcomes,
            status: course.status,
            enrollmentCount: course.enrollmentCount,
            totalModules: modules.length,
            totalLessons,
            isEnrolled,
            enrollment: enrollment
                ? {
                    completedLessons: enrollment.completedLessons,
                    lastAccessedLessonId: enrollment.lastAccessedLessonId,
                    progressPercent: enrollment.progressPercent,
                    status: enrollment.status,
                }
                : null,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        return NextResponse.json(
            { error: "Failed to fetch course" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { slug } = await params;
        const body = await req.json();

        const course = await CourseModel.findOne({ slug });
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // If slug is being changed, check for duplicates
        if (body.slug && body.slug !== slug) {
            const existing = await CourseModel.findOne({ slug: body.slug.trim().toLowerCase() });
            if (existing) {
                return NextResponse.json(
                    { error: "A course with this slug already exists" },
                    { status: 409 }
                );
            }
        }

        const allowedFields = [
            "title", "slug", "description", "thumbnail", "category",
            "tags", "difficulty", "instructors", "price", "originalPrice",
            "currency", "learningOutcomes", "status",
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                if (field === "slug") {
                    course[field] = body[field].trim().toLowerCase();
                } else {
                    course[field] = body[field];
                }
            }
        }

        await course.save();

        return NextResponse.json({
            id: course._id.toString(),
            slug: course.slug,
            message: "Course updated successfully",
        });
    } catch (error) {
        console.error("Error updating course:", error);
        return NextResponse.json(
            { error: "Failed to update course" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { slug } = await params;

        const course = await CourseModel.findOneAndDelete({ slug });
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Also delete all enrollments for this course
        await EnrollmentModel.deleteMany({ courseId: course._id });

        return NextResponse.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            { error: "Failed to delete course" },
            { status: 500 }
        );
    }
}
