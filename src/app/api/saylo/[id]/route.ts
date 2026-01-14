import { SayloCommentModel, SayloModel, SayloReactionModel } from "@/database/models/saylo-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const saylo = await SayloModel.findById(id).lean();

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        const isAdmin = await checkIsAdmin();
        if (!saylo.published && !isAdmin) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        // Get actual comment count
        const commentCount = await SayloCommentModel.countDocuments({ sayloId: id });

        return NextResponse.json({
            id: saylo._id.toString(),
            content: saylo.content,
            authorName: saylo.authorName || null,
            authorImage: saylo.authorImage || null,
            category: saylo.category,
            images: saylo.images || [],
            videos: saylo.videos || [],
            reactions: saylo.reactions || { like: 0, love: 0, haha: 0, fire: 0 },
            commentCount,
            shareCount: saylo.shareCount || 0,
            published: saylo.published,
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
        const { content, category, images, videos, published } = body;

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

        // Clean up related reactions and comments
        await SayloReactionModel.deleteMany({ sayloId: id });
        await SayloCommentModel.deleteMany({ sayloId: id });

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
