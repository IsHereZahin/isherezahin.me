import { auth } from "@/auth";
import { CourseModel } from "@/database/models/course-model";
import { LessonModel } from "@/database/models/lesson-model";
import { EnrollmentModel } from "@/database/models/enrollment-model";
import { LessonProgressModel } from "@/database/models/lesson-progress-model";
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

        const course = await CourseModel.findOne({ slug }).lean() as { _id: unknown } | null;
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

        // Get total lessons for progress calculation
        const totalLessons = await LessonModel.countDocuments({ courseId: course._id });

        if (action === "complete" && lessonId) {
            // Upsert lesson progress record
            await LessonProgressModel.findOneAndUpdate(
                { enrollmentId: enrollment._id, lessonId },
                { $set: { completedAt: new Date() } },
                { upsert: true }
            );
        } else if (action === "uncomplete" && lessonId) {
            // Remove lesson progress record
            await LessonProgressModel.deleteOne({
                enrollmentId: enrollment._id,
                lessonId,
            });
        }

        if (lessonId) {
            enrollment.lastAccessedLessonId = lessonId;
        }

        // Recalculate progress from LessonProgress collection
        const completedCount = await LessonProgressModel.countDocuments({
            enrollmentId: enrollment._id,
            completedAt: { $ne: null },
        });

        enrollment.progressPercent = totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

        if (enrollment.progressPercent >= 100) {
            enrollment.status = "completed";
            enrollment.completedAt = new Date();
        } else {
            enrollment.status = "active";
            enrollment.completedAt = null;
        }

        await enrollment.save();

        // Return completed lesson IDs for frontend compatibility
        const progressRecords = await LessonProgressModel.find({
            enrollmentId: enrollment._id,
            completedAt: { $ne: null },
        }).lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completedLessons = progressRecords.map((p: any) => p.lessonId.toString());

        return NextResponse.json({
            completedLessons,
            progressPercent: enrollment.progressPercent,
            status: enrollment.status,
            lastAccessedLessonId: enrollment.lastAccessedLessonId?.toString() || null,
        });
    } catch (error) {
        console.error("Error updating progress:", error);
        return NextResponse.json(
            { error: "Failed to update progress" },
            { status: 500 }
        );
    }
}
