// src/app/api/blog/route.ts
import dbConnect from '@/database/services/mongo';
import { BlogModel } from '@/database/models/blog-model';
import { NextRequest, NextResponse } from 'next/server';
import { Blog, BlogDocument } from '@/utils/types';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const total = await BlogModel.countDocuments();

        const blogsFromDb = await BlogModel.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean<BlogDocument[]>();

        if (!blogsFromDb || blogsFromDb.length === 0) {
            return NextResponse.json({ error: 'No blogs found' }, { status: 404 });
        }

        // Map _id to id
        const blogs: Blog[] = blogsFromDb.map(blog => ({
            id: blog._id.toString(),
            date: blog.date.toString(),
            views: blog.views,
            type: blog.type,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            tags: blog.tags,
            imageSrc: blog.imageSrc,
            content: blog.content,
        }));

        return NextResponse.json({
            total,
            page,
            limit,
            blogs,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}