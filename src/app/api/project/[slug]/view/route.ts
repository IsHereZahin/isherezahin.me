// src/app/api/project/[slug]/view/route.ts
import { ProjectModel } from '@/database/models/project-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    try {
        const { slug } = await context.params;

        // Check if project exists and is published
        const existingProject = await ProjectModel.findOne({ slug }).lean<{ published?: boolean }>();
        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        // If project is unpublished and user is not admin, return 404
        if (!existingProject.published && !isAdmin) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Increment view count
        const project = await ProjectModel.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } },
            { new: true, lean: true }
        ).lean<{ views: number }>();

        return NextResponse.json(
            { views: project?.views || 0, success: true },
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