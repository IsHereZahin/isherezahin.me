// src/app/api/blog/[slug]/view/route.ts
import { BlogModel } from '@/database/models/blog-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    try {
        const { slug } = await context.params;

        // Check if blog exists and is published
        const existingBlog = await BlogModel.findOne({ slug }).lean<{ published?: boolean }>();
        if (!existingBlog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        // If blog is unpublished and user is not admin, return 404
        if (!existingBlog.published && !isAdmin) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Increment view count
        const blog = await BlogModel.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } },
            { new: true, lean: true }
        ).lean<{ views: number }>();

        return NextResponse.json(
            { views: blog?.views || 0, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating view count:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}