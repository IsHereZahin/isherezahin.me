import { SubscriberModel } from "@/database/models/subscriber-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const search = searchParams.get("search") || "";
        const filter = searchParams.get("filter") || "all";

        const skip = (page - 1) * limit;

        // Build query
        const query: Record<string, unknown> = {};
        
        if (search) {
            query.email = { $regex: search, $options: "i" };
        }

        if (filter === "active") {
            query.isActive = true;
        } else if (filter === "inactive") {
            query.isActive = false;
        }

        const total = await SubscriberModel.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const subscribers = await SubscriberModel.find(query)
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const formattedSubscribers = subscribers.map((sub: Record<string, unknown>) => ({
            id: (sub._id as { toString(): string }).toString(),
            email: sub.email,
            isActive: sub.isActive,
            subscribedAt: sub.subscribedAt,
            createdAt: sub.createdAt,
            updatedAt: sub.updatedAt,
        }));

        return NextResponse.json({
            subscribers: formattedSubscribers,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
