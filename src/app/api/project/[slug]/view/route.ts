// src/app/api/project/[slug]/view/route.ts
import { ProjectModel } from '@/database/models/project-model';
import dbConnect from '@/database/services/mongo';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    try {
        const { slug } = await context.params;

        // Increment view count
        const project = await ProjectModel.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } },
            { new: true, lean: true }
        ).lean<{ views: number }>();

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { views: project.views, success: true },
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