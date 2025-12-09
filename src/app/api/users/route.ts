import { auth } from "@/auth";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { MY_MAIL } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        if (session.user.email.toLowerCase() !== MY_MAIL.toLowerCase()) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const filter = searchParams.get("filter") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 10;

        // Build query
        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
            ];
        }

        if (filter === "banned") {
            query.isBanned = true;
        } else if (filter === "active") {
            query.isBanned = { $ne: true };
        }

        const total = await UserModel.countDocuments(query);
        const users = await UserModel.find(query)
            .select("name email image username provider isBanned createdAt")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({
            users: users.map((u) => ({
                id: u._id.toString(),
                name: u.name,
                email: u.email,
                image: u.image,
                username: u.username,
                provider: u.provider,
                isBanned: u.isBanned || false,
                isAdmin: u.email?.toLowerCase() === MY_MAIL.toLowerCase(),
                createdAt: u.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
