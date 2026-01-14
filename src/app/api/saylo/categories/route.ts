import { SayloCategoryModel, SayloModel } from "@/database/models/saylo-model";
import dbConnect from "@/database/services/mongo";
import { checkIsAdmin } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        // Get categories from the category collection
        const storedCategories = await SayloCategoryModel.find()
            .sort({ name: 1 })
            .lean();

        const storedCategoryNames = new Set(storedCategories.map((c) => c.name));

        // Also get distinct categories from saylos that might not be in the collection
        const sayloCategories = await SayloModel.distinct("category", {
            category: { $ne: null, $exists: true },
        });

        // Merge both sources
        const allCategories = [...storedCategories.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,
            color: cat.color,
        }))];

        // Add categories from saylos that aren't in the stored categories
        for (const catName of sayloCategories) {
            if (catName && !storedCategoryNames.has(catName)) {
                allCategories.push({
                    id: `saylo-${catName}`,
                    name: catName,
                    color: null,
                });
            }
        }

        // Sort by name
        allCategories.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json({ categories: allCategories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await req.json();
        const { name, color } = body;

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Category name is required" },
                { status: 400 }
            );
        }

        // Check if category already exists
        const existing = await SayloCategoryModel.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Category already exists" },
                { status: 400 }
            );
        }

        const category = await SayloCategoryModel.create({
            name: name.trim(),
            color: color || null,
        });

        return NextResponse.json(
            {
                id: category._id.toString(),
                name: category.name,
                color: category.color,
                message: "Category created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Category ID is required" },
                { status: 400 }
            );
        }

        const category = await SayloCategoryModel.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}
