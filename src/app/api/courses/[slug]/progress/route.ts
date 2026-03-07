import { auth } from "@/auth";
import { CourseModel, EnrollmentModel } from "@/database/models/course-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// PATCH - Mark a lesson as complete / update last accessed
export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { slug } = await params;
        const body = await req.json();
        const { lessonId, action } = body; // action: "complete" | "uncomplete" | "access"

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const course = await CourseModel.findOne({ slug }).lean() as any;
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        const enrollment = await EnrollmentModel.findOne({
            userId: session.user.id,
            courseId: course._id,
        });

        if (!enrollment) {
            return NextResponse.json(
                { error: "Not enrolled in this course" },
                { status: 403 }
            );
        }

        // Calculate total lessons
        const totalLessons = course.modules?.reduce(
            (sum: number, m: { lessons?: unknown[] }) => sum + (m.lessons?.length || 0),
            0
        ) || 0;

        if (action === "complete" && lessonId) {
            if (!enrollment.completedLessons.includes(lessonId)) {
                enrollment.completedLessons.push(lessonId);
            }
        } else if (action === "uncomplete" && lessonId) {
            enrollment.completedLessons = enrollment.completedLessons.filter(
                (id: string) => id !== lessonId
            );
        }

        if (lessonId) {
            enrollment.lastAccessedLessonId = lessonId;
        }

        // Recalculate progress
        enrollment.progressPercent = totalLessons > 0
            ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
            : 0;

        if (enrollment.progressPercent >= 100) {
            enrollment.status = "completed";
            enrollment.completedAt = new Date();
        } else {
            enrollment.status = "active";
            enrollment.completedAt = null;
        }

        await enrollment.save();

        return NextResponse.json({
            completedLessons: enrollment.completedLessons,
            progressPercent: enrollment.progressPercent,
            status: enrollment.status,
            lastAccessedLessonId: enrollment.lastAccessedLessonId,
        });
    } catch (error) {
        console.error("Error updating progress:", error);
        return NextResponse.json(
            { error: "Failed to update progress" },
            { status: 500 }
        );
    }
}
