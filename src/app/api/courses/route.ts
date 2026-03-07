import { auth } from "@/auth";
import { CourseModel } from "@/database/models/course-model";
import { CategoryModel } from "@/database/models/category-model";
import { InstructorModel } from "@/database/models/instructor-model";
import { ModuleModel } from "@/database/models/module-model";
import { LessonModel } from "@/database/models/lesson-model";
import { EnrollmentModel } from "@/database/models/enrollment-model";
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

        // Category filter: resolve slug/name to categoryId
        if (category && category !== "all") {
            const cat = await CategoryModel.findOne({
                $or: [{ slug: category }, { name: category }],
            }).lean();
            if (cat) {
                query.categoryId = (cat as { _id: unknown })._id;
            } else {
                return NextResponse.json({
                    courses: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                });
            }
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

        // Get module/lesson counts and category names in parallel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const courseIds = courses.map((c: any) => c._id);
        // Collect all instructor IDs across courses
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allInstructorIds = [...new Set(courses.flatMap((c: any) => (c.instructorIds || []).map((id: any) => id.toString())))];

        const [moduleCounts, lessonCounts, categories, instructors] = await Promise.all([
            ModuleModel.aggregate([
                { $match: { courseId: { $in: courseIds } } },
                { $group: { _id: "$courseId", count: { $sum: 1 } } },
            ]),
            LessonModel.aggregate([
                { $match: { courseId: { $in: courseIds } } },
                { $group: { _id: "$courseId", count: { $sum: 1 } } },
            ]),
            CategoryModel.find({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _id: { $in: courses.map((c: any) => c.categoryId).filter(Boolean) },
            }).lean(),
            allInstructorIds.length > 0
                ? InstructorModel.find({ _id: { $in: allInstructorIds } }).lean()
                : Promise.resolve([]),
        ]);

        const moduleCountMap: Record<string, number> = {};
        for (const m of moduleCounts) moduleCountMap[m._id.toString()] = m.count;
        const lessonCountMap: Record<string, number> = {};
        for (const l of lessonCounts) lessonCountMap[l._id.toString()] = l.count;
        const categoryMap: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const c of categories as any[]) categoryMap[c._id.toString()] = c.name;
        const instructorMap: Record<string, { id: string; name: string; image: string | null; bio: string | null }> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const i of instructors as any[]) instructorMap[i._id.toString()] = { id: i._id.toString(), name: i.name, image: i.image, bio: i.bio };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedCourses = courses.map((course: any) => {
            const id = course._id.toString();
            return {
                id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnail: course.thumbnail,
                category: course.categoryId ? categoryMap[course.categoryId.toString()] || null : null,
                tags: course.tags,
                difficulty: course.difficulty,
                instructors: (course.instructorIds || []).map((id: any) => instructorMap[id.toString()]).filter(Boolean),
                price: course.price,
                originalPrice: course.originalPrice,
                currency: course.currency,
                status: course.status,
                learningOutcomes: course.learningOutcomes || [],
                enrollmentCount: course.enrollmentCount,
                totalModules: moduleCountMap[id] || 0,
                totalLessons: lessonCountMap[id] || 0,
                isEnrolled: enrolledCourseIds.includes(id),
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
            instructorIds,
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

        if (!Array.isArray(instructorIds) || instructorIds.length === 0) {
            return NextResponse.json(
                { error: "At least one instructor is required" },
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

        // Resolve category name to categoryId (auto-create if new)
        let categoryId = null;
        if (category?.trim()) {
            const categorySlug = category.trim().toLowerCase().replace(/\s+/g, "-");
            let cat = await CategoryModel.findOne({
                $or: [{ slug: categorySlug }, { name: category.trim() }],
            });
            if (!cat) {
                cat = await CategoryModel.create({
                    name: category.trim(),
                    slug: categorySlug,
                });
            }
            categoryId = cat._id;
        }

        const course = await CourseModel.create({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            description: description?.trim() || "",
            thumbnail: thumbnail || null,
            categoryId,
            tags: Array.isArray(tags) ? tags : [],
            difficulty: difficulty || "beginner",
            instructorIds: Array.isArray(instructorIds) ? instructorIds : [],
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
