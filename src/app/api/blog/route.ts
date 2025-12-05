// src/app/api/blog/route.ts
import { BlogModel } from '@/database/models/blog-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { Blog, BlogDocument } from '@/utils/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        // Build query - non-admin users only see published blogs
        const query = isAdmin ? {} : { published: true };

        const total = await BlogModel.countDocuments(query);

        const blogsFromDb = await BlogModel.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean<BlogDocument[]>();

        if (!blogsFromDb || blogsFromDb.length === 0) {
            return NextResponse.json({ 
                total: 0,
                page,
                limit,
                blogs: [],
            }, { status: 200 });
        }

        // Map _id to id
        const blogs: Blog[] = blogsFromDb.map(blog => ({
            id: blog._id.toString(),
            date: blog.date.toString(),
            views: blog.views,
            likes: blog.likes,
            type: blog.type,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            tags: blog.tags,
            imageSrc: blog.imageSrc,
            content: blog.content,
            published: blog.published ?? true,
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

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, slug, excerpt, tags, imageSrc, content, published } = body;

        // Validate required fields
        if (!title || !slug || !excerpt || !imageSrc || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if slug already exists
        const existingBlog = await BlogModel.findOne({ slug });
        if (existingBlog) {
            return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 400 });
        }

        const newBlog = await BlogModel.create({
            date: new Date(),
            views: 0,
            likes: 0,
            type: 'Blog',
            title,
            slug,
            excerpt,
            tags: tags || [],
            imageSrc,
            content,
            published: published ?? false,
        });

        return NextResponse.json({
            id: newBlog._id.toString(),
            message: 'Blog created successfully',
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
