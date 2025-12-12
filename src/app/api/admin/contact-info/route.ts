import { ContactInfoModel } from "@/database/models/contact-info-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        let contactInfo = await ContactInfoModel.findOne();
        
        if (!contactInfo) {
            contactInfo = {
                email: "",
                headline: "Any questions about software?",
                subheadline: "Feel free to reach out to me!",
                highlightText: "I'm available for collaboration.",
                skills: ["Next.js", "React.js", "TypeScript", "Laravel"],
            };
        }
        
        return NextResponse.json(contactInfo);
    } catch (error) {
        console.error("Error fetching contact info:", error);
        return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 });
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

        const contactInfo = await ContactInfoModel.findOneAndUpdate(
            {},
            {
                email: data.email,
                headline: data.headline,
                subheadline: data.subheadline,
                highlightText: data.highlightText,
                skills: data.skills,
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(contactInfo);
    } catch (error) {
        console.error("Error updating contact info:", error);
        return NextResponse.json({ error: "Failed to update contact info" }, { status: 500 });
    }
}
