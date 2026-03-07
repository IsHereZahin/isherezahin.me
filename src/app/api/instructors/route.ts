import { InstructorModel } from "@/database/models/instructor-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

// GET: List all instructors (admin only)
export async function GET() {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const instructors = await InstructorModel.find()
            .sort({ name: 1 })
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = instructors.map((i: any) => ({
            id: i._id.toString(),
            name: i.name,
            image: i.image,
            bio: i.bio,
        }));

        return NextResponse.json({ instructors: formatted });
    } catch (error) {
        console.error("Error fetching instructors:", error);
        return NextResponse.json(
            { error: "Failed to fetch instructors" },
            { status: 500 }
        );
    }
}

// POST: Create a new instructor (admin only)
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
        const { name, image, bio } = body;

        if (!name?.trim()) {
            return NextResponse.json(
                { error: "Instructor name is required" },
                { status: 400 }
            );
        }

        const instructor = await InstructorModel.create({
            name: name.trim(),
            image: image || null,
            bio: bio?.trim() || null,
        });

        return NextResponse.json(
            {
                id: instructor._id.toString(),
                name: instructor.name,
                image: instructor.image,
                bio: instructor.bio,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating instructor:", error);
        return NextResponse.json(
            { error: "Failed to create instructor" },
            { status: 500 }
        );
    }
}
