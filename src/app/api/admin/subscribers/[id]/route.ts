import { SubscriberModel } from "@/database/models/subscriber-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        if (!action || !["activate", "deactivate"].includes(action)) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const subscriber = await SubscriberModel.findById(id);
        if (!subscriber) {
            return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
        }

        subscriber.isActive = action === "activate";
        await subscriber.save();

        return NextResponse.json({
            message: `Subscriber ${action === "activate" ? "activated" : "deactivated"} successfully`,
            isActive: subscriber.isActive,
        });
    } catch (error) {
        console.error("Error updating subscriber:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;

        const subscriber = await SubscriberModel.findByIdAndDelete(id);
        if (!subscriber) {
            return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Subscriber deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
