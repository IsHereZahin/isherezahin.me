// src/app/api/project/route.ts
import { ProjectModel } from '@/database/models/project-model';
import dbConnect from '@/database/services/mongo';
import { Project, ProjectDocument } from '@/utils/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const total = await ProjectModel.countDocuments();

        const projectsFromDb = await ProjectModel.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean<ProjectDocument[]>();

        if (!projectsFromDb || projectsFromDb.length === 0) {
            return NextResponse.json({ 
                total: 0,
                page,
                limit,
                projects: [],
            }, { status: 200 });
        }

        // Map _id to id and format dates
        const projects: Project[] = projectsFromDb.map(project => ({
            id: project._id.toString(),
            date: project.date.toString(),
            views: project.views,
            likes: project.likes,
            title: project.title,
            slug: project.slug,
            excerpt: project.excerpt,
            categories: project.categories,
            company: project.company,
            duration: project.duration,
            status: project.status,
            tags: project.tags,
            imageSrc: project.imageSrc,
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            content: project.content,
        }));

        return NextResponse.json({
            total,
            page,
            limit,
            projects,
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}