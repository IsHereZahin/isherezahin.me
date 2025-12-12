import { CurrentStatusModel } from "@/database/models/current-status-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('all') === 'true';
        
        const query = includeInactive ? {} : { isActive: true };
        const statuses = await CurrentStatusModel.find(query).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(statuses);
    } catch (error) {
        console.error("Error fetching current status:", error);
        return NextResponse.json({ error: "Failed to fetch current status" }, { status: 500 });
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

        const status = await CurrentStatusModel.create({
            text: data.text,
            order: data.order || 0,
            isActive: data.isActive ?? true,
        });

        return NextResponse.json(status, { status: 201 });
    } catch (error) {
        console.error("Error creating current status:", error);
        return NextResponse.json({ error: "Failed to create current status" }, { status: 500 });
    }
}
