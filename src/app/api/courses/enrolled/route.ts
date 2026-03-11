import { auth } from "@/auth";
import { CourseModel } from "@/database/models/course-model";
import { EnrollmentModel } from "@/database/models/enrollment-model";
import { InstructorModel } from "@/database/models/instructor-model";
import { ModuleModel } from "@/database/models/module-model";
import { LessonModel } from "@/database/models/lesson-model";
import dbConnect from "@/database/services/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Please sign in to view enrolled courses" },
                { status: 401 }
            );
        }

        await dbConnect();

        const enrollments = await EnrollmentModel.find({ userId: session.user.id })
            .sort({ updatedAt: -1 })
            .lean();

        if (enrollments.length === 0) {
            return NextResponse.json({ courses: [] });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const courseIds = enrollments.map((e: any) => e.courseId);
        const courses = await CourseModel.find({ _id: { $in: courseIds } }).lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allInstructorIds = [...new Set(courses.flatMap((c: any) => (c.instructorIds || []).map((id: any) => id.toString())))];

        const [moduleCounts, lessonCounts, instructors] = await Promise.all([
            ModuleModel.aggregate([
                { $match: { courseId: { $in: courseIds } } },
                { $group: { _id: "$courseId", count: { $sum: 1 } } },
            ]),
            LessonModel.aggregate([
                { $match: { courseId: { $in: courseIds } } },
                { $group: { _id: "$courseId", count: { $sum: 1 } } },
            ]),
            allInstructorIds.length > 0
                ? InstructorModel.find({ _id: { $in: allInstructorIds } }).lean()
                : Promise.resolve([]),
        ]);

        const moduleCountMap: Record<string, number> = {};
        for (const m of moduleCounts) moduleCountMap[m._id.toString()] = m.count;
        const lessonCountMap: Record<string, number> = {};
        for (const l of lessonCounts) lessonCountMap[l._id.toString()] = l.count;
        const instructorMap: Record<string, { id: string; name: string; image: string | null }> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const i of instructors as any[]) instructorMap[i._id.toString()] = { id: i._id.toString(), name: i.name, image: i.image };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enrollmentMap: Record<string, any> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const e of enrollments as any[]) enrollmentMap[e.courseId.toString()] = e;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedCourses = courses.map((course: any) => {
            const id = course._id.toString();
            const enrollment = enrollmentMap[id];
            return {
                id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnail: course.thumbnail,
                difficulty: course.difficulty,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                instructors: (course.instructorIds || []).map((iid: any) => instructorMap[iid.toString()]).filter(Boolean),
                price: course.price,
                originalPrice: course.originalPrice,
                currency: course.currency,
                totalLessons: lessonCountMap[id] || 0,
                totalModules: moduleCountMap[id] || 0,
                enrollmentCount: course.enrollmentCount,
                isEnrolled: true,
                enrollment: {
                    progressPercent: enrollment?.progressPercent || 0,
                    status: enrollment?.status || "active",
                    enrolledAt: enrollment?.createdAt,
                    lastAccessedLessonId: enrollment?.lastAccessedLessonId?.toString() || null,
                },
            };
        });

        // Sort by enrollment updatedAt order
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const courseOrderMap: Record<string, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enrollments.forEach((e: any, i: number) => { courseOrderMap[e.courseId.toString()] = i; });
        formattedCourses.sort((a, b) => (courseOrderMap[a.id] ?? 0) - (courseOrderMap[b.id] ?? 0));

        return NextResponse.json({ courses: formattedCourses });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch enrolled courses" },
            { status: 500 }
        );
    }
}
