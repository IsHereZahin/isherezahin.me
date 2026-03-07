import { auth } from "@/auth";
import { CourseModel, EnrollmentModel } from "@/database/models/course-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const search = searchParams.get("search");
        const statusFilter = searchParams.get("status");

        const session = await auth();
        const isAdmin = await checkIsAdmin();

        const query: Record<string, unknown> = {};

        // Non-admins only see published courses
        if (!isAdmin) {
            query.status = "published";
        } else if (statusFilter && statusFilter !== "all") {
            query.status = statusFilter;
        }

        if (category && category !== "all") {
            query.category = category;
        }

        if (difficulty && difficulty !== "all") {
            query.difficulty = difficulty;
        }

        if (search?.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: "i" } },
                { description: { $regex: search.trim(), $options: "i" } },
                { tags: { $regex: search.trim(), $options: "i" } },
            ];
        }

        const total = await CourseModel.countDocuments(query);
        const courses = await CourseModel.find(query)
            .select("-modules.lessons.videoUrl -modules.lessons.content")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // Get enrollment info for authenticated users
        let enrolledCourseIds: string[] = [];
        if (session?.user?.id) {
            const enrollments = await EnrollmentModel.find(
                { userId: session.user.id },
                { courseId: 1 }
            ).lean();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            enrolledCourseIds = enrollments.map((e: any) => e.courseId.toString());
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedCourses = courses.map((course: any) => {
            const totalLessons = course.modules?.reduce(
                (sum: number, m: { lessons?: unknown[] }) => sum + (m.lessons?.length || 0),
                0
            ) || 0;

            return {
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
                status: course.status,
                learningOutcomes: course.learningOutcomes || [],
                enrollmentCount: course.enrollmentCount,
                totalModules: course.modules?.length || 0,
                totalLessons,
                isEnrolled: enrolledCourseIds.includes(course._id.toString()),
                createdAt: course.createdAt,
            };
        });

        return NextResponse.json({
            courses: formattedCourses,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await req.json();
        const {
            title,
            slug,
            description,
            thumbnail,
            category,
            tags,
            difficulty,
            instructors,
            price,
            originalPrice,
            currency,
            learningOutcomes,
            status: courseStatus,
        } = body;

        if (!title?.trim() || !slug?.trim()) {
            return NextResponse.json(
                { error: "Title and slug are required" },
                { status: 400 }
            );
        }

        // Check for duplicate slug
        const existing = await CourseModel.findOne({ slug: slug.trim().toLowerCase() });
        if (existing) {
            return NextResponse.json(
                { error: "A course with this slug already exists" },
                { status: 409 }
            );
        }

        const course = await CourseModel.create({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            description: description?.trim() || "",
            thumbnail: thumbnail || null,
            category: category?.trim() || null,
            tags: Array.isArray(tags) ? tags : [],
            difficulty: difficulty || "beginner",
            instructors: Array.isArray(instructors) ? instructors : [],
            price: price || 0,
            originalPrice: originalPrice || null,
            currency: currency || "BDT",
            learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
            status: courseStatus || "draft",
        });

        return NextResponse.json(
            { id: course._id.toString(), slug: course.slug, message: "Course created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating course:", error);
        return NextResponse.json(
            { error: "Failed to create course" },
            { status: 500 }
        );
    }
}
