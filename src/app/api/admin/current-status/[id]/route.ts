import { CurrentStatusModel } from "@/database/models/current-status-model";
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

        const status = await CurrentStatusModel.findByIdAndUpdate(
            id,
            {
                text: data.text,
                order: data.order,
                isActive: data.isActive,
            },
            { new: true }
        );

        if (!status) {
            return NextResponse.json({ error: "Status not found" }, { status: 404 });
        }

        return NextResponse.json(status);
    } catch (error) {
        console.error("Error updating current status:", error);
        return NextResponse.json({ error: "Failed to update current status" }, { status: 500 });
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

        const status = await CurrentStatusModel.findByIdAndDelete(id);

        if (!status) {
            return NextResponse.json({ error: "Status not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Status deleted successfully" });
    } catch (error) {
        console.error("Error deleting current status:", error);
        return NextResponse.json({ error: "Failed to delete current status" }, { status: 500 });
    }
}
