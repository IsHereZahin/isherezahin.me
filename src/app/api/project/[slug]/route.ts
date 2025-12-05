// src/app/api/project/[slug]/route.ts
import { ProjectModel } from '@/database/models/project-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { deleteCloudinaryImage } from '@/lib/cloudinary-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        const { slug } = await context.params;

        const project = await ProjectModel.findOne({ slug }).lean();
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        // If project is unpublished and user is not admin, return 404
        if (!(project as any).published && !isAdmin) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Transform the project data to match the expected format
        const transformedProject = {
            id: (project as any)._id.toString(),
            date: (project as any).date.toString(),
            views: (project as any).views,
            likes: (project as any).likes,
            title: (project as any).title,
            slug: (project as any).slug,
            excerpt: (project as any).excerpt,
            categories: (project as any).categories,
            company: (project as any).company,
            duration: (project as any).duration,
            status: (project as any).status,
            tags: (project as any).tags,
            imageSrc: (project as any).imageSrc,
            liveUrl: (project as any).liveUrl,
            githubUrl: (project as any).githubUrl,
            content: (project as any).content,
            published: (project as any).published ?? true,
        };

        return NextResponse.json(transformedProject, { status: 200 });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await context.params;
        const body = await req.json();
        const { 
            title, excerpt, categories, company, duration, 
            status, tags, imageSrc, liveUrl, githubUrl, content, published 
        } = body;

        // Validate required fields
        if (!title || !excerpt || !company || !duration || !imageSrc || !content) {
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
            const existingProject = await ProjectModel.findOne({ slug: newSlug });
            if (existingProject) {
                return NextResponse.json({ error: 'A project with this title already exists' }, { status: 400 });
            }
        }

        const updatedProject = await ProjectModel.findOneAndUpdate(
            { slug },
            {
                title,
                slug: newSlug,
                excerpt,
                categories: categories || 'Project',
                company,
                duration,
                status: status || 'completed',
                tags: tags || [],
                imageSrc,
                liveUrl: liveUrl || null,
                githubUrl: githubUrl || null,
                content,
                published: published ?? false,
            },
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Project updated successfully',
            slug: newSlug,
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await context.params;

        const deletedProject = await ProjectModel.findOneAndDelete({ slug });

        if (!deletedProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Delete associated image from Cloudinary
        if (deletedProject.imageSrc) {
            await deleteCloudinaryImage(deletedProject.imageSrc);
        }

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
