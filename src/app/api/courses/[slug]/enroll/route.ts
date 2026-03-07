import { auth } from "@/auth";
import { CourseModel } from "@/database/models/course-model";
import { EnrollmentModel } from "@/database/models/enrollment-model";
import { LessonProgressModel } from "@/database/models/lesson-progress-model";
import { QuizResultModel } from "@/database/models/quiz-result-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Please sign in to enroll" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { slug } = await params;

        const course = await CourseModel.findOne({ slug, status: "published" });
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Check if already enrolled
        const existing = await EnrollmentModel.findOne({
            userId: session.user.id,
            courseId: course._id,
        });

        if (existing) {
            return NextResponse.json(
                { error: "Already enrolled in this course" },
                { status: 409 }
            );
        }

        await EnrollmentModel.create({
            userId: session.user.id,
            courseId: course._id,
        });

        // Increment enrollment count
        await CourseModel.updateOne(
            { _id: course._id },
            { $inc: { enrollmentCount: 1 } }
        );

        return NextResponse.json(
            { message: "Enrolled successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error enrolling:", error);
        return NextResponse.json(
            { error: "Failed to enroll" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

        const course = await CourseModel.findOne({ slug });
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        const result = await EnrollmentModel.findOneAndDelete({
            userId: session.user.id,
            courseId: course._id,
        });

        if (!result) {
            return NextResponse.json(
                { error: "Not enrolled in this course" },
                { status: 404 }
            );
        }

        // Cascade delete lesson progress and quiz results for this enrollment
        await Promise.all([
            LessonProgressModel.deleteMany({ enrollmentId: result._id }),
            QuizResultModel.deleteMany({ enrollmentId: result._id }),
        ]);

        await CourseModel.updateOne(
            { _id: course._id },
            { $inc: { enrollmentCount: -1 } }
        );

        return NextResponse.json({ message: "Unenrolled successfully" });
    } catch (error) {
        console.error("Error unenrolling:", error);
        return NextResponse.json(
            { error: "Failed to unenroll" },
            { status: 500 }
        );
    }
}

// GET - Admin: list all enrollments for a course
export async function GET(req: NextRequest, { params }: RouteParams) {
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

        const course = await CourseModel.findOne({ slug });
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        const enrollments = await EnrollmentModel.find({ courseId: course._id })
            .populate("userId", "name email image")
            .sort({ createdAt: -1 })
            .lean();

        // Get completed lesson counts per enrollment
        const enrollmentIds = enrollments.map((e: Record<string, unknown>) => e._id);
        const progressCounts = await LessonProgressModel.aggregate([
            { $match: { enrollmentId: { $in: enrollmentIds }, completedAt: { $ne: null } } },
            { $group: { _id: "$enrollmentId", count: { $sum: 1 } } },
        ]);
        const progressCountMap: Record<string, number> = {};
        for (const p of progressCounts) progressCountMap[p._id.toString()] = p.count;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = enrollments.map((e: any) => ({
            id: e._id.toString(),
            user: e.userId,
            progressPercent: e.progressPercent,
            completedLessons: progressCountMap[e._id.toString()] || 0,
            status: e.status,
            enrolledAt: e.createdAt,
            completedAt: e.completedAt,
        }));

        return NextResponse.json({ enrollments: formatted });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return NextResponse.json(
            { error: "Failed to fetch enrollments" },
            { status: 500 }
        );
    }
}
