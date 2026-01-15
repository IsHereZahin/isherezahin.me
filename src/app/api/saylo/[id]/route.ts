import { auth } from "@/auth";
import { SayloModel, SayloReactionModel, SayloShareModel } from "@/database/models/saylo-model";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

// Ensure User model is registered for population
const _UserModel = UserModel;

interface SayloDocument {
    _id: { toString(): string };
    content: string;
    authorId: { _id?: string; name?: string; image?: string } | null;
    category: string | null;
    images: string[];
    videos: string[];
    reactions: { like: number; love: number; haha: number; fire: number };
    published: boolean;
    visibility: string;
    discussionNumber: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const saylo = await SayloModel.findById(id).populate("authorId", "name image").lean() as SayloDocument | null;

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        const session = await auth();
        const isAdmin = await checkIsAdmin();

        // Check visibility permissions
        if (!isAdmin) {
            if (!saylo.published) {
                return NextResponse.json(
                    { error: "Saylo not found" },
                    { status: 404 }
                );
            }

            const visibility = saylo.visibility || "public";

            // authorId is populated, so get the _id for comparison
            const authorIdValue = saylo.authorId?._id?.toString();
            if (visibility === "private" && authorIdValue !== session?.user?.id) {
                return NextResponse.json(
                    { error: "Saylo not found" },
                    { status: 404 }
                );
            }

            if (visibility === "authenticated" && !session?.user) {
                return NextResponse.json(
                    { error: "Authentication required to view this saylo" },
                    { status: 401 }
                );
            }
        }

        // Get share count
        const shareCount = await SayloShareModel.countDocuments({ sayloId: id });

        return NextResponse.json({
            id: saylo._id.toString(),
            content: saylo.content,
            authorName: saylo.authorId?.name || null,
            authorImage: saylo.authorId?.image || null,
            category: saylo.category,
            images: saylo.images || [],
            videos: saylo.videos || [],
            reactions: saylo.reactions || { like: 0, love: 0, haha: 0, fire: 0 },
            shareCount,
            published: saylo.published,
            visibility: saylo.visibility || "public",
            discussionNumber: saylo.discussionNumber || null,
            createdAt: saylo.createdAt,
            updatedAt: saylo.updatedAt,
        });
    } catch (error) {
        console.error("Error fetching saylo:", error);
        return NextResponse.json(
            { error: "Failed to fetch saylo" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { id } = await context.params;
        const body = await req.json();
        const { content, category, images, videos, published, visibility } = body;

        const saylo = await SayloModel.findById(id);

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        if (content !== undefined) {
            if (!content || content.trim().length === 0) {
                return NextResponse.json(
                    { error: "Content is required" },
                    { status: 400 }
                );
            }
            saylo.content = content.trim();
        }

        if (category !== undefined) {
            saylo.category = category || null;
        }

        if (images !== undefined) {
            saylo.images = Array.isArray(images) ? images : [];
        }

        if (videos !== undefined) {
            saylo.videos = Array.isArray(videos) ? videos : [];
        }

        if (published !== undefined) {
            saylo.published = published;
        }

        if (visibility !== undefined) {
            const validVisibilities = ["public", "authenticated", "private"];
            if (validVisibilities.includes(visibility)) {
                saylo.visibility = visibility;
            }
        }

        await saylo.save();

        return NextResponse.json({
            id: saylo._id.toString(),
            message: "Saylo updated successfully",
        });
    } catch (error) {
        console.error("Error updating saylo:", error);
        return NextResponse.json(
            { error: "Failed to update saylo" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { id } = await context.params;

        const saylo = await SayloModel.findByIdAndDelete(id);

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        // Clean up related reactions and shares
        await Promise.all([
            SayloReactionModel.deleteMany({ sayloId: id }),
            SayloShareModel.deleteMany({ sayloId: id }),
        ]);

        return NextResponse.json({
            message: "Saylo deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting saylo:", error);
        return NextResponse.json(
            { error: "Failed to delete saylo" },
            { status: 500 }
        );
    }
}
