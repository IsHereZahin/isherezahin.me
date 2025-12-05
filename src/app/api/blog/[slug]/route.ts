// src/app/api/blog/[slug]/route.ts
import { auth } from '@/auth';
import { BlogModel } from '@/database/models/blog-model';
import dbConnect from '@/database/services/mongo';
import { MY_MAIL } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        const { slug } = await context.params;

        const blog = await BlogModel.findOne({ slug }).lean();
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        // Check if user is admin
        const session = await auth();
        const isAdmin = session?.user?.email?.toLowerCase() === MY_MAIL.toLowerCase();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await context.params;
        const body = await req.json();
        const { title, excerpt, tags, imageSrc, content, published } = body;

        // Validate required fields
        if (!title || !excerpt || !imageSrc || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate new slug from title
        const newSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        // Check if new slug already exists (if slug changed)
        if (newSlug !== slug) {
            const existingBlog = await BlogModel.findOne({ slug: newSlug });
            if (existingBlog) {
                return NextResponse.json({ error: 'A blog with this title already exists' }, { status: 400 });
            }
        }

        const updatedBlog = await BlogModel.findOneAndUpdate(
            { slug },
            {
                title,
                slug: newSlug,
                excerpt,
                tags: tags || [],
                imageSrc,
                content,
                published: published ?? false,
            },
            { new: true }
        );

        if (!updatedBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Blog updated successfully',
            slug: newSlug,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        // Check if user is admin
        const session = await auth();
        const isAdmin = session?.user?.email?.toLowerCase() === MY_MAIL.toLowerCase();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await context.params;

        const deletedBlog = await BlogModel.findOneAndDelete({ slug });

        if (!deletedBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
