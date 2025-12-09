import { auth } from "@/auth";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const user = await UserModel.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found", logout: true },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            username: user.username,
            provider: user.provider,
            bio: user.bio || null,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { bio } = body;

        // Validate bio length
        if (bio !== undefined && bio !== null && bio.length > 500) {
            return NextResponse.json(
                { error: "Bio must be 500 characters or less" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await UserModel.findByIdAndUpdate(
            session.user.id,
            { bio, updatedAt: new Date() },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found", logout: true },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            username: user.username,
            provider: user.provider,
            bio: user.bio || null,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
