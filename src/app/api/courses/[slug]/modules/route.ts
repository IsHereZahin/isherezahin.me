import { CourseModel } from "@/database/models/course-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// Update modules (full replacement — used for reordering, adding, editing)
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
        const { modules } = body;

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

        course.modules = modules;
        await course.save();

        return NextResponse.json({
            message: "Modules updated successfully",
            modules: course.modules,
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
