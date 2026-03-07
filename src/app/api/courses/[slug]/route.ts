import { auth } from "@/auth";
import { CourseModel } from "@/database/models/course-model";
import { CategoryModel } from "@/database/models/category-model";
import { InstructorModel } from "@/database/models/instructor-model";
import { ModuleModel } from "@/database/models/module-model";
import { LessonModel } from "@/database/models/lesson-model";
import { EnrollmentModel } from "@/database/models/enrollment-model";
import { LessonProgressModel } from "@/database/models/lesson-progress-model";
import { QuizResultModel } from "@/database/models/quiz-result-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import mongoose from "mongoose";
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

        // Fetch modules, lessons, category, and instructors from separate collections
        const [dbModules, dbLessons, category, dbInstructors] = await Promise.all([
            ModuleModel.find({ courseId: course._id }).sort({ order: 1 }).lean(),
            LessonModel.find({ courseId: course._id }).sort({ order: 1 }).lean(),
            course.categoryId ? CategoryModel.findById(course.categoryId).lean() : null,
            course.instructorIds?.length > 0
                ? InstructorModel.find({ _id: { $in: course.instructorIds } }).lean()
                : Promise.resolve([]),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instructors = (dbInstructors as any[]).map((i) => ({
            id: i._id.toString(),
            name: i.name,
            image: i.image,
            bio: i.bio,
        }));

        // Group lessons by module
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lessonsByModule: Record<string, any[]> = {};
        for (const lesson of dbLessons) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const moduleId = (lesson as any).moduleId.toString();
            if (!lessonsByModule[moduleId]) lessonsByModule[moduleId] = [];
            lessonsByModule[moduleId].push(lesson);
        }

        // Build modules with lessons (matching old response shape)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modules = dbModules.map((mod: any) => {
            const modId = mod._id.toString();
            const modLessons = (lessonsByModule[modId] || []).map((lesson: Record<string, unknown>) => {
                const canAccess = isAdmin || isEnrolled || lesson.isFree;
                let content = canAccess ? lesson.content : null;

                // Strip correct answers from quiz content (security)
                if (content && lesson.contentType === "quiz" && !isAdmin) {
                    try {
                        const questions = JSON.parse(content as string);
                        if (Array.isArray(questions)) {
                            content = JSON.stringify(questions.map((q: Record<string, unknown>) => ({
                                question: q.question,
                                options: q.options,
                            })));
                        }
                    } catch { /* noop */ }
                }

                return {
                    _id: lesson._id,
                    title: lesson.title,
                    order: lesson.order,
                    contentType: lesson.contentType,
                    videoUrl: canAccess ? lesson.videoUrl : null,
                    content,
                    duration: lesson.duration,
                    isFree: lesson.isFree,
                };
            });

            return {
                _id: mod._id,
                title: mod.title,
                order: mod.order,
                lessons: modLessons,
            };
        });

        const totalLessons = dbLessons.length;

        // Build enrollment data with lesson progress and quiz results
        let enrollmentData = null;
        if (enrollment) {
            const [progressRecords, quizResults] = await Promise.all([
                LessonProgressModel.find({ enrollmentId: enrollment._id }).lean(),
                QuizResultModel.find({ enrollmentId: enrollment._id }).lean(),
            ]);

            const completedLessons = progressRecords
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((p: any) => p.completedAt)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((p: any) => p.lessonId.toString());

            const quizResultsMap: Record<string, Record<string, unknown>> = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const qr of quizResults as any[]) {
                quizResultsMap[qr.lessonId.toString()] = {
                    results: qr.results,
                    correctCount: qr.correctCount,
                    totalQuestions: qr.totalQuestions,
                    passed: qr.passed,
                    answers: qr.answers,
                };
            }

            enrollmentData = {
                completedLessons,
                lastAccessedLessonId: enrollment.lastAccessedLessonId?.toString() || null,
                progressPercent: enrollment.progressPercent,
                status: enrollment.status,
                quizResults: quizResultsMap,
            };
        }

        return NextResponse.json({
            id: course._id.toString(),
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnail: course.thumbnail,
            category: category ? (category as unknown as { name: string }).name : null,
            tags: course.tags,
            difficulty: course.difficulty,
            instructors,
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
            enrollment: enrollmentData,
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

        const course = await CourseModel.findOne({ slug }).lean();
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

        // Validate instructorIds required
        const instructorIds = Array.isArray(body.instructorIds) ? body.instructorIds : [];
        if (instructorIds.length === 0) {
            return NextResponse.json(
                { error: "At least one instructor is required" },
                { status: 400 }
            );
        }

        // Build $set update object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const update: Record<string, any> = {};

        // Handle category: resolve name to categoryId
        if (body.category !== undefined) {
            if (body.category?.trim()) {
                const categorySlug = body.category.trim().toLowerCase().replace(/\s+/g, "-");
                let cat = await CategoryModel.findOne({
                    $or: [{ slug: categorySlug }, { name: body.category.trim() }],
                });
                if (!cat) {
                    cat = await CategoryModel.create({
                        name: body.category.trim(),
                        slug: categorySlug,
                    });
                }
                update.categoryId = cat._id;
            } else {
                update.categoryId = null;
            }
        }

        // Handle instructorIds
        update.instructorIds = instructorIds.map((id: string) => new mongoose.Types.ObjectId(id));

        const allowedFields = [
            "title", "slug", "description", "thumbnail",
            "tags", "difficulty", "price", "originalPrice",
            "currency", "learningOutcomes", "status",
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                if (field === "slug") {
                    update[field] = body[field].trim().toLowerCase();
                } else {
                    update[field] = body[field];
                }
            }
        }

        console.log("Updating course with:", JSON.stringify(update, null, 2));

        const updated = await CourseModel.findByIdAndUpdate(
            (course as unknown as { _id: string })._id,
            { $set: update },
            { new: true, strict: false }
        );

        console.log("Updated instructorIds:", updated.instructorIds);

        return NextResponse.json({
            id: updated._id.toString(),
            slug: updated.slug,
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

        // Cascade delete all related data
        const enrollments = await EnrollmentModel.find({ courseId: course._id }, { _id: 1 }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enrollmentIds = enrollments.map((e: any) => e._id);

        await Promise.all([
            ModuleModel.deleteMany({ courseId: course._id }),
            LessonModel.deleteMany({ courseId: course._id }),
            EnrollmentModel.deleteMany({ courseId: course._id }),
            LessonProgressModel.deleteMany({ enrollmentId: { $in: enrollmentIds } }),
            QuizResultModel.deleteMany({ enrollmentId: { $in: enrollmentIds } }),
        ]);

        return NextResponse.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            { error: "Failed to delete course" },
            { status: 500 }
        );
    }
}
