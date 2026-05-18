import { EducationModel } from "@/database/models/education-model";
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

        const education = await EducationModel.findByIdAndUpdate(
            id,
            {
                start: data.start,
                end: data.end,
                degree: data.degree,
                institution: data.institution,
                institutionUrl: data.institutionUrl,
                logo: data.logo,
                order: data.order,
                isActive: data.isActive,
            },
            { new: true }
        );

        if (!education) {
            return NextResponse.json({ error: "Education not found" }, { status: 404 });
        }

        return NextResponse.json(education);
    } catch (error) {
        console.error("Error updating education:", error);
        return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
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

        const education = await EducationModel.findByIdAndDelete(id);

        if (!education) {
            return NextResponse.json({ error: "Education not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Education deleted successfully" });
    } catch (error) {
        console.error("Error deleting education:", error);
        return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
    }
}
