// src/app/api/blog/[slug]/view/route.ts
import dbConnect from '@/database/services/mongo';
import { BlogModel } from '@/database/models/blog-model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    try {
        const { slug } = await context.params;

        // Increment view count
        const blog = await BlogModel.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } },
            { new: true, lean: true }
        ).lean<{ views: number }>();

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { views: blog.views, success: true },
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