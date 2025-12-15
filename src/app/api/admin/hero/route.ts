import { HeroModel } from "@/database/models/hero-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

// Default hero data
const DEFAULT_HERO = {
    profileImage: "",
    greeting: "Hey, I'm",
    name: "Zahin",
    tagline: "Coder & Thinker",
    description: "I work with React & Laravel Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.",
    highlightedSkills: ["React", "Laravel"],
    buttons: [
        { text: "Learn More", href: "#about-me", icon: "ArrowDown", variant: "default" },
        { text: "More about me", href: "/about", icon: "", variant: "default" },
    ],
    isActive: true,
};

export async function GET() {
    try {
        await dbConnect();
        
        let hero = await HeroModel.findOne({ isActive: true }).lean();
        
        if (!hero) {
            // Return default if no hero data exists
            return NextResponse.json(DEFAULT_HERO);
        }

        return NextResponse.json(hero);
    } catch (error) {
        console.error("Error fetching hero:", error);
        return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
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

        // Find existing hero or create new one
        let hero = await HeroModel.findOne({});
        
        if (hero) {
            hero = await HeroModel.findByIdAndUpdate(
                hero._id,
                {
                    profileImage: data.profileImage,
                    greeting: data.greeting,
                    name: data.name,
                    tagline: data.tagline,
                    description: data.description,
                    highlightedSkills: data.highlightedSkills || [],
                    buttons: data.buttons || [],
                    isActive: data.isActive ?? true,
                },
                { new: true }
            );
        } else {
            hero = await HeroModel.create({
                profileImage: data.profileImage,
                greeting: data.greeting,
                name: data.name,
                tagline: data.tagline,
                description: data.description,
                highlightedSkills: data.highlightedSkills || [],
                buttons: data.buttons || [],
                isActive: data.isActive ?? true,
            });
        }

        return NextResponse.json(hero);
    } catch (error) {
        console.error("Error updating hero:", error);
        return NextResponse.json({ error: "Failed to update hero data" }, { status: 500 });
    }
}
