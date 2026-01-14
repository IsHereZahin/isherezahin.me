import { auth } from "@/auth";
import { SayloCommentModel, SayloModel } from "@/database/models/saylo-model";
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
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        const saylo = await SayloModel.findById(id).select("_id").lean();

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        const total = await SayloCommentModel.countDocuments({ sayloId: id });

        // Sync commentCount in Saylo document if it differs
        await SayloModel.findByIdAndUpdate(id, { commentCount: total });

        const comments = await SayloCommentModel.find({ sayloId: id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const formattedComments = comments.map((comment) => ({
            id: comment._id.toString(),
            content: comment.content,
            authorName: comment.authorName,
            authorImage: comment.authorImage,
            authorId: comment.authorId,
            isAdmin: comment.isAdmin,
            createdAt: comment.createdAt,
        }));

        return NextResponse.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            comments: formattedComments,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { id } = await context.params;
        const body = await req.json();
        const { content } = body;

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Comment content is required" },
                { status: 400 }
            );
        }

        const saylo = await SayloModel.findById(id);

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        const isAdmin = await checkIsAdmin();

        const comment = await SayloCommentModel.create({
            sayloId: id,
            content: content.trim(),
            authorName: session.user.name || "Anonymous",
            authorImage: session.user.image || null,
            authorId: session.user.id || null,
            isAdmin,
        });

        // Update comment count
        saylo.commentCount = (saylo.commentCount || 0) + 1;
        await saylo.save();

        return NextResponse.json(
            {
                id: comment._id.toString(),
                content: comment.content,
                authorName: comment.authorName,
                authorImage: comment.authorImage,
                authorId: comment.authorId,
                isAdmin: comment.isAdmin,
                createdAt: comment.createdAt,
                message: "Comment added successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { id } = await context.params;
        const body = await req.json();
        const { commentId, content } = body;

        if (!commentId) {
            return NextResponse.json(
                { error: "Comment ID is required" },
                { status: 400 }
            );
        }

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Comment content is required" },
                { status: 400 }
            );
        }

        const comment = await SayloCommentModel.findById(commentId);

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        // Only comment author can edit their own comment
        if (comment.authorId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized - you can only edit your own comments" },
                { status: 403 }
            );
        }

        // Verify comment belongs to this saylo
        if (comment.sayloId.toString() !== id) {
            return NextResponse.json(
                { error: "Comment does not belong to this saylo" },
                { status: 400 }
            );
        }

        comment.content = content.trim();
        await comment.save();

        return NextResponse.json({
            id: comment._id.toString(),
            content: comment.content,
            authorName: comment.authorName,
            authorImage: comment.authorImage,
            authorId: comment.authorId,
            isAdmin: comment.isAdmin,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            message: "Comment updated successfully",
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json(
            { error: "Failed to update comment" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const isAdmin = await checkIsAdmin();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { id } = await context.params;
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get("commentId");

        if (!commentId) {
            return NextResponse.json(
                { error: "Comment ID is required" },
                { status: 400 }
            );
        }

        const comment = await SayloCommentModel.findById(commentId);

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        // Only admin or comment author can delete
        if (!isAdmin && comment.authorId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        await SayloCommentModel.deleteOne({ _id: commentId });

        // Update comment count
        await SayloModel.findByIdAndUpdate(id, {
            $inc: { commentCount: -1 },
        });

        return NextResponse.json({
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { error: "Failed to delete comment" },
            { status: 500 }
        );
    }
}
