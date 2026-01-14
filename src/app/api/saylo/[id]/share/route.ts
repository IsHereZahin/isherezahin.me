import { SayloModel } from "@/database/models/saylo-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const saylo = await SayloModel.findByIdAndUpdate(
            id,
            { $inc: { shareCount: 1 } },
            { new: true }
        );

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            shareCount: saylo.shareCount,
        });
    } catch (error) {
        console.error("Error incrementing share count:", error);
        return NextResponse.json(
            { error: "Failed to increment share count" },
            { status: 500 }
        );
    }
}
