import { VisitorModel } from "@/database/models/visitor-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { fingerprint, ref, path } = body;

        if (!fingerprint) {
            return NextResponse.json({ error: "Fingerprint required" }, { status: 400 });
        }

        const userAgent = request.headers.get("user-agent") || null;
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0].trim() : null;

        await VisitorModel.create({
            fingerprint,
            ref: ref || null,
            userAgent,
            path: path || "/",
            ip,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking visitor:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
