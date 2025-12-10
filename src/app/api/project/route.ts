// src/app/api/project/route.ts
import { ProjectModel } from '@/database/models/project-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { Project, ProjectDocument } from '@/utils/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;
        const tagsParam = searchParams.get("tags");
        const searchQuery = searchParams.get("search");

        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        // Build query - non-admin users only see published projects
        const query: Record<string, unknown> = isAdmin ? {} : { published: true };

        // Add tag filtering if tags are provided
        if (tagsParam) {
            const tags = tagsParam.split(',').filter(Boolean);
            if (tags.length > 0) {
                query.tags = { $all: tags };
            }
        }

        // Add search filtering if search query is provided
        if (searchQuery && searchQuery.trim()) {
            query.title = { $regex: searchQuery.trim(), $options: 'i' };
        }

        const total = await ProjectModel.countDocuments(query);

        const projectsFromDb = await ProjectModel.find(query)
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
            published: project.published ?? true,
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

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        // Check if user is admin
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { 
            title, slug, excerpt, categories, company, duration, 
            status, tags, imageSrc, liveUrl, githubUrl, content, published 
        } = body;

        // Validate required fields
        if (!title || !slug || !excerpt || !company || !duration || !imageSrc || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if slug already exists
        const existingProject = await ProjectModel.findOne({ slug });
        if (existingProject) {
            return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 400 });
        }

        const newProject = await ProjectModel.create({
            date: new Date(),
            views: 0,
            likes: 0,
            type: 'Project',
            title,
            slug,
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
        });

        return NextResponse.json({
            id: newProject._id.toString(),
            message: 'Project created successfully',
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
