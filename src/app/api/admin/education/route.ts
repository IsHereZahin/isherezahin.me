import { EducationModel } from "@/database/models/education-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('all') === 'true';

        const query = includeInactive ? {} : { isActive: true };
        const education = await EducationModel.find(query).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(education);
    } catch (error) {
        console.error("Error fetching education:", error);
        return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        const education = await EducationModel.create({
            start: data.start,
            end: data.end || "Present",
            degree: data.degree,
            institution: data.institution,
            institutionUrl: data.institutionUrl || "",
            logo: data.logo,
            order: data.order || 0,
            isActive: data.isActive ?? true,
        });

        return NextResponse.json(education, { status: 201 });
    } catch (error) {
        console.error("Error creating education:", error);
        return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
    }
}
