// src/app/api/legal/[slug]/route.ts
import { auth } from "@/auth";
import { LegalPageModel } from "@/database/models/legal-page-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

const VALID_SLUGS = ["privacy-policy", "terms-of-service"];

// Helper to sanitize response for non-admin users
function sanitizeForPublic(page: any) {
    return {
        id: page._id?.toString(),
        slug: page.slug,
        title: page.title,
        subtitle: page.subtitle || "",
        content: page.content,
        updatedAt: page.updatedAt,
    };
}

// Helper to include admin-only fields
function formatForAdmin(page: any) {
    return {
        id: page._id?.toString(),
        slug: page.slug,
        title: page.title,
        subtitle: page.subtitle || "",
        content: page.content,
        published: page.published,
        lastUpdatedBy: page.lastUpdatedBy,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
    };
}

// GET - Fetch a legal page by slug
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    await dbConnect();

    try {
        const { slug } = await context.params;

        if (!VALID_SLUGS.includes(slug)) {
            return NextResponse.json(
                { error: "Invalid page slug" },
                { status: 400 }
            );
        }

        const isAdmin = await checkIsAdmin();
        const query = isAdmin ? { slug } : { slug, published: true };

        const page = await LegalPageModel.findOne(query).lean();

        if (!page) {
            return NextResponse.json(
                { error: "Page not found", exists: false },
                { status: 404 }
            );
        }

        // Return sanitized data for non-admin users
        if (isAdmin) {
            return NextResponse.json(formatForAdmin(page));
        }

        return NextResponse.json(sanitizeForPublic(page));
    } catch (error) {
        console.error("Error fetching legal page:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT - Update or create a legal page (admin only)
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    await dbConnect();

    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { slug } = await context.params;

        if (!VALID_SLUGS.includes(slug)) {
            return NextResponse.json(
                { error: "Invalid page slug" },
                { status: 400 }
            );
        }

        const session = await auth();
        const body = await request.json();
        const { title, subtitle, content, published } = body;

        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const page = await LegalPageModel.findOneAndUpdate(
            { slug },
            {
                slug,
                title,
                subtitle: subtitle || "",
                content: content || "",
                published: published ?? false,
                lastUpdatedBy: session?.user?.email || null,
            },
            { new: true, upsert: true, lean: true }
        );

        return NextResponse.json({
            ...formatForAdmin(page),
            message: "Page updated successfully",
        });
    } catch (error) {
        console.error("Error updating legal page:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
