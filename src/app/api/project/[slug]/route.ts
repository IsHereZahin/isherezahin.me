// src/app/api/project/[slug]/route.ts
import { ProjectModel } from '@/database/models/project-model';
import dbConnect from '@/database/services/mongo';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    try {
        const { slug } = await context.params;

        const project = await ProjectModel.findOne({ slug }).lean();
        if (!project) {
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
        };

        return NextResponse.json(transformedProject, { status: 200 });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}