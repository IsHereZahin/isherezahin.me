import { TestimonialModel } from "@/database/models/testimonial-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('all') === 'true';
        
        const query = includeInactive ? {} : { isActive: true };
        const testimonials = await TestimonialModel.find(query).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
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

        const testimonial = await TestimonialModel.create({
            quote: data.quote,
            name: data.name,
            role: data.role,
            order: data.order || 0,
            isActive: data.isActive ?? true,
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
    }
}
