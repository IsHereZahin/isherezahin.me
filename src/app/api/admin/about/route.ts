import { AboutHeroModel } from "@/database/models/about-hero-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const aboutHero = await AboutHeroModel.findOne();
        return NextResponse.json(aboutHero);
    } catch (error) {
        console.error("Error fetching about hero:", error);
        return NextResponse.json({ error: "Failed to fetch about hero" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        let aboutHero = await AboutHeroModel.findOne();

        if (aboutHero) {
            aboutHero = await AboutHeroModel.findByIdAndUpdate(
                aboutHero._id,
                {
                    name: data.name,
                    title: data.title,
                    location: data.location,
                    age: data.age,
                    imageSrc: data.imageSrc,
                    paragraphs: data.paragraphs,
                    pageTitle: data.pageTitle,
                    pageSubtitle: data.pageSubtitle,
                },
                { new: true }
            );
        } else {
            aboutHero = await AboutHeroModel.create({
                name: data.name,
                title: data.title,
                location: data.location,
                age: data.age,
                imageSrc: data.imageSrc,
                paragraphs: data.paragraphs,
                pageTitle: data.pageTitle,
                pageSubtitle: data.pageSubtitle,
            });
        }

        return NextResponse.json(aboutHero);
    } catch (error) {
        console.error("Error updating about hero:", error);
        return NextResponse.json({ error: "Failed to update about hero" }, { status: 500 });
    }
}
