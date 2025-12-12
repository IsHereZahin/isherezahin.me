import { WorkExperienceModel } from "@/database/models/work-experience-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const data = await request.json();

        const experience = await WorkExperienceModel.findByIdAndUpdate(
            id,
            {
                start: data.start,
                end: data.end,
                title: data.title,
                company: data.company,
                companyUrl: data.companyUrl,
                location: data.location,
                type: data.type,
                description: data.description,
                highlights: data.highlights,
                logo: data.logo,
                order: data.order,
                isActive: data.isActive,
            },
            { new: true }
        );

        if (!experience) {
            return NextResponse.json({ error: "Experience not found" }, { status: 404 });
        }

        return NextResponse.json(experience);
    } catch (error) {
        console.error("Error updating work experience:", error);
        return NextResponse.json({ error: "Failed to update work experience" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const experience = await WorkExperienceModel.findByIdAndDelete(id);

        if (!experience) {
            return NextResponse.json({ error: "Experience not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Experience deleted successfully" });
    } catch (error) {
        console.error("Error deleting work experience:", error);
        return NextResponse.json({ error: "Failed to delete work experience" }, { status: 500 });
    }
}
