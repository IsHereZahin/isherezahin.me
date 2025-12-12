import { WorkExperienceModel } from "@/database/models/work-experience-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('all') === 'true';
        
        const query = includeInactive ? {} : { isActive: true };
        const experiences = await WorkExperienceModel.find(query).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(experiences);
    } catch (error) {
        console.error("Error fetching work experience:", error);
        return NextResponse.json({ error: "Failed to fetch work experience" }, { status: 500 });
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

        const experience = await WorkExperienceModel.create({
            start: data.start,
            end: data.end || "Present",
            title: data.title,
            company: data.company,
            companyUrl: data.companyUrl,
            location: data.location,
            type: data.type || "On Site",
            description: data.description,
            highlights: data.highlights || [],
            logo: data.logo,
            order: data.order || 0,
            isActive: data.isActive ?? true,
        });

        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error("Error creating work experience:", error);
        return NextResponse.json({ error: "Failed to create work experience" }, { status: 500 });
    }
}
