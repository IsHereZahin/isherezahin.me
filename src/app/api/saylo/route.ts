import { auth } from "@/auth";
import { SayloCategoryModel, SayloModel, SayloShareModel } from "@/database/models/saylo-model";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Ensure User model is registered for population
const _UserModel = UserModel;

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const category = searchParams.get("category");
        const sort = searchParams.get("sort") || "recent";
        const visibilityFilter = searchParams.get("visibility");
        const search = searchParams.get("search");

        const session = await auth();
        const isAdmin = await checkIsAdmin();

        // Build visibility query based on user authentication and admin status
        let query: Record<string, unknown>;
        if (isAdmin) {
            // Admin can see everything, but can filter by visibility
            query = {};
            if (visibilityFilter && visibilityFilter !== "all") {
                query.visibility = visibilityFilter;
            }
        } else if (session?.user) {
            // Authenticated users can see public, authenticated, and their own private posts
            query = {
                published: true,
                $or: [
                    { visibility: "public" },
                    { visibility: "authenticated" },
                    { visibility: "private", authorId: new mongoose.Types.ObjectId(session.user.id) },
                ],
            };
        } else {
            // Non-authenticated users can only see public posts
            query = { published: true, visibility: { $in: ["public", null] } };
        }

        if (category && category !== "all") {
            query.category = category;
        }

        // Add search filter
        if (search && search.trim()) {
            query.content = { $regex: search.trim(), $options: "i" };
        }

        // Determine sort order
        let sortOption: Record<string, 1 | -1>;
        switch (sort) {
            case "oldest":
                sortOption = { createdAt: 1 };
                break;
            case "popular":
                // Sort by total reactions (sum of all reaction types) + comment count
                sortOption = { "reactions.like": -1, "reactions.love": -1, createdAt: -1 };
                break;
            case "recent":
            default:
                sortOption = { createdAt: -1 };
                break;
        }

        const total = await SayloModel.countDocuments(query);

        // Get distinct visibility types count (for admin to show/hide filter)
        let distinctVisibilities: string[] = [];
        if (isAdmin) {
            distinctVisibilities = await SayloModel.distinct("visibility");
        }

        // Get distinct categories count
        const distinctCategories = await SayloModel.distinct("category", { category: { $ne: null } });

        let saylos;
        if (sort === "popular") {
            // For popular sort, use aggregation to calculate total engagement
            saylos = await SayloModel.aggregate([
                { $match: query },
                {
                    $addFields: {
                        totalReactions: {
                            $add: [
                                { $ifNull: ["$reactions.like", 0] },
                                { $ifNull: ["$reactions.love", 0] },
                                { $ifNull: ["$reactions.haha", 0] },
                                { $ifNull: ["$reactions.fire", 0] },
                            ],
                        },
                    },
                },
                { $sort: { totalReactions: -1, createdAt: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "author",
                    },
                },
                { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
            ]);
        } else {
            saylos = await SayloModel.find(query)
                .populate("authorId", "name image")
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
        }

        // Get actual share counts for all saylos
        const sayloIds = saylos.map((s) => s._id);
        const shareCounts = await SayloShareModel.aggregate([
            { $match: { sayloId: { $in: sayloIds } } },
            { $group: { _id: "$sayloId", count: { $sum: 1 } } },
        ]);
        const shareCountMap = new Map(
            shareCounts.map((s) => [s._id.toString(), s.count])
        );

        const formattedSaylos = saylos.map((saylo) => {
            // Handle both aggregation (author) and populate (authorId) results
            const author = saylo.author || saylo.authorId;
            return {
                id: saylo._id.toString(),
                content: saylo.content,
                authorName: author?.name || null,
                authorImage: author?.image || null,
                category: saylo.category,
                images: saylo.images || [],
                videos: saylo.videos || [],
                reactions: saylo.reactions || { like: 0, love: 0, haha: 0, fire: 0 },
                shareCount: shareCountMap.get(saylo._id.toString()) || 0,
                published: saylo.published,
                visibility: saylo.visibility || "public",
                discussionNumber: saylo.discussionNumber || null,
                createdAt: saylo.createdAt,
                updatedAt: saylo.updatedAt,
            };
        });

        return NextResponse.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            saylos: formattedSaylos,
            distinctCategoriesCount: distinctCategories.length,
            distinctVisibilitiesCount: distinctVisibilities.length,
        });
    } catch (error) {
        console.error("Error fetching saylos:", error);
        return NextResponse.json(
            { error: "Failed to fetch saylos" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const isAdmin = await checkIsAdmin();
        if (!isAdmin || !session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await req.json();
        const { content, category, newCategory, images = [], videos = [], published = true, visibility = "public" } = body;

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        // Handle new category creation
        let finalCategory = category;
        if (newCategory && newCategory.trim()) {
            const existingCategory = await SayloCategoryModel.findOne({
                name: { $regex: new RegExp(`^${newCategory.trim()}$`, "i") },
            });

            if (!existingCategory) {
                const createdCategory = await SayloCategoryModel.create({
                    name: newCategory.trim(),
                });
                finalCategory = createdCategory.name;
            } else {
                finalCategory = existingCategory.name;
            }
        }

        // Validate visibility
        const validVisibilities = ["public", "authenticated", "private"];
        const finalVisibility = validVisibilities.includes(visibility) ? visibility : "public";

        const saylo = await SayloModel.create({
            content: content.trim(),
            authorId: session.user.id,
            category: finalCategory || null,
            images: Array.isArray(images) ? images : [],
            videos: Array.isArray(videos) ? videos : [],
            published,
            visibility: finalVisibility,
        });

        return NextResponse.json(
            {
                id: saylo._id.toString(),
                message: "Saylo created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating saylo:", error);
        return NextResponse.json(
            { error: "Failed to create saylo" },
            { status: 500 }
        );
    }
}
