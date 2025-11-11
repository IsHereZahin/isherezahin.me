// src/app/api/blog/route.ts
import { BlogModel } from '@/database/models/blog-model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const total = await BlogModel.countDocuments();
        const blogs = await BlogModel.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        if (!blogs || blogs.length === 0) {
            return NextResponse.json({ error: 'No blogs found' }, { status: 404 });
        }

        // Map _id to id for React
        const formattedBlogs = blogs.map(blog => ({
            ...blog,
            id: blog._id.toString(),
        }));

        return NextResponse.json({
            total,
            page,
            limit,
            blogs: formattedBlogs,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}