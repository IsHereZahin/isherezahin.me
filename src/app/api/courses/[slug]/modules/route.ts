import { CourseModel } from "@/database/models/course-model";
import { ModuleModel } from "@/database/models/module-model";
import { LessonModel } from "@/database/models/lesson-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

interface LessonInput {
    _id?: string;
    title: string;
    order: number;
    contentType: "video" | "text" | "quiz";
    videoUrl?: string | null;
    content?: string | null;
    duration?: string | null;
    isFree?: boolean;
}

interface ModuleInput {
    _id?: string;
    title: string;
    order: number;
    lessons: LessonInput[];
}

// PUT: Full replacement of modules and lessons for a course
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
        const { modules } = body as { modules: ModuleInput[] };

        if (!Array.isArray(modules)) {
            return NextResponse.json(
                { error: "Modules must be an array" },
                { status: 400 }
            );
        }

        const course = await CourseModel.findOne({ slug });
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        const courseId = course._id;

        // Get existing modules and lessons for this course
        const existingModules = await ModuleModel.find({ courseId }).lean();
        const existingLessons = await LessonModel.find({ courseId }).lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingModuleIds = new Set(existingModules.map((m: any) => m._id.toString()));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingLessonIds = new Set(existingLessons.map((l: any) => l._id.toString()));

        // Track which IDs we keep
        const keepModuleIds = new Set<string>();
        const keepLessonIds = new Set<string>();

        // Prepare bulk operations
        const moduleOps: mongoose.AnyBulkWriteOperation[] = [];
        const lessonOps: mongoose.AnyBulkWriteOperation[] = [];

        for (const mod of modules) {
            let moduleId: mongoose.Types.ObjectId;

            if (mod._id && existingModuleIds.has(mod._id)) {
                // Update existing module
                moduleId = new mongoose.Types.ObjectId(mod._id);
                keepModuleIds.add(mod._id);
                moduleOps.push({
                    updateOne: {
                        filter: { _id: moduleId },
                        update: { $set: { title: mod.title, order: mod.order } },
                    },
                });
            } else {
                // Create new module
                moduleId = new mongoose.Types.ObjectId();
                moduleOps.push({
                    insertOne: {
                        document: {
                            _id: moduleId,
                            courseId,
                            title: mod.title,
                            order: mod.order,
                        },
                    },
                });
            }

            for (const lesson of mod.lessons || []) {
                if (lesson._id && existingLessonIds.has(lesson._id)) {
                    // Update existing lesson
                    keepLessonIds.add(lesson._id);
                    lessonOps.push({
                        updateOne: {
                            filter: { _id: new mongoose.Types.ObjectId(lesson._id) },
                            update: {
                                $set: {
                                    moduleId,
                                    courseId,
                                    title: lesson.title,
                                    order: lesson.order,
                                    contentType: lesson.contentType,
                                    videoUrl: lesson.videoUrl || null,
                                    content: lesson.content || null,
                                    duration: lesson.duration || null,
                                    isFree: lesson.isFree || false,
                                },
                            },
                        },
                    });
                } else {
                    // Create new lesson
                    lessonOps.push({
                        insertOne: {
                            document: {
                                _id: new mongoose.Types.ObjectId(),
                                moduleId,
                                courseId,
                                title: lesson.title,
                                order: lesson.order,
                                contentType: lesson.contentType,
                                videoUrl: lesson.videoUrl || null,
                                content: lesson.content || null,
                                duration: lesson.duration || null,
                                isFree: lesson.isFree || false,
                            },
                        },
                    });
                }
            }
        }

        // Delete removed modules and lessons
        const deleteModuleIds = [...existingModuleIds].filter((id) => !keepModuleIds.has(id));
        const deleteLessonIds = [...existingLessonIds].filter((id) => !keepLessonIds.has(id));

        await Promise.all([
            deleteModuleIds.length > 0
                ? ModuleModel.deleteMany({ _id: { $in: deleteModuleIds.map((id) => new mongoose.Types.ObjectId(id)) } })
                : Promise.resolve(),
            deleteLessonIds.length > 0
                ? LessonModel.deleteMany({ _id: { $in: deleteLessonIds.map((id) => new mongoose.Types.ObjectId(id)) } })
                : Promise.resolve(),
        ]);

        // Execute bulk operations
        await Promise.all([
            moduleOps.length > 0 ? ModuleModel.bulkWrite(moduleOps) : Promise.resolve(),
            lessonOps.length > 0 ? LessonModel.bulkWrite(lessonOps) : Promise.resolve(),
        ]);

        // Return updated modules with lessons (matching old response shape)
        const updatedModules = await ModuleModel.find({ courseId }).sort({ order: 1 }).lean();
        const updatedLessons = await LessonModel.find({ courseId }).sort({ order: 1 }).lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lessonsByModule: Record<string, any[]> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const l of updatedLessons as any[]) {
            const mid = l.moduleId.toString();
            if (!lessonsByModule[mid]) lessonsByModule[mid] = [];
            lessonsByModule[mid].push(l);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseModules = updatedModules.map((m: any) => ({
            _id: m._id,
            title: m.title,
            order: m.order,
            lessons: lessonsByModule[m._id.toString()] || [],
        }));

        return NextResponse.json({
            message: "Modules updated successfully",
            modules: responseModules,
        });
    } catch (error) {
        const err = error instanceof Error ? error.message : String(error);
        console.error("Error updating modules:", err, error);
        return NextResponse.json(
            { error: "Failed to update modules", details: err },
            { status: 500 }
        );
    }
}
