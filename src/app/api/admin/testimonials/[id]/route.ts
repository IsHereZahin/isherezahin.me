import { TestimonialModel } from "@/database/models/testimonial-model";
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

        const testimonial = await TestimonialModel.findByIdAndUpdate(
            id,
            {
                quote: data.quote,
                name: data.name,
                role: data.role,
                order: data.order,
                isActive: data.isActive,
            },
            { new: true }
        );

        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
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

        const testimonial = await TestimonialModel.findByIdAndDelete(id);

        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}
