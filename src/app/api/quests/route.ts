// src/app/api/quests/route.ts
import { QuestModel } from '@/database/models/quest-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

// Public fields that non-admin users can see
const publicFields = {
    _id: 1,
    date: 1,
    title: 1,
    location: 1,
    description: 1,
    media: 1,
    order: 1,
};

export async function GET() {
    await dbConnect();
    try {
        const isAdmin = await checkIsAdmin();

        // Build query - non-admin users only see active quests
        const query = isAdmin ? {} : { isActive: true };

        // Select fields based on admin status
        const projection = isAdmin ? {} : publicFields;

        const quests = await QuestModel.find(query, projection)
            .sort({ order: 1, createdAt: -1 })
            .lean();

        // Map _id to id for frontend
        const mappedQuests = quests.map((quest: any) => ({
            id: quest._id.toString(),
            date: quest.date,
            title: quest.title,
            location: quest.location,
            description: quest.description,
            media: quest.media,
            order: quest.order,
            ...(isAdmin && { isActive: quest.isActive }),
        }));

        return NextResponse.json({ quests: mappedQuests }, { status: 200 });
    } catch (error) {
        console.error('Error fetching quests:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { date, title, location, description, media, order, isActive } = body;

        // Validate required fields
        if (!date || !title || !location || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate media array
        if (media && !Array.isArray(media)) {
            return NextResponse.json({ error: 'Media must be an array' }, { status: 400 });
        }

        const newQuest = await QuestModel.create({
            date,
            title,
            location,
            description,
            media: media || [],
            order: order ?? 0,
            isActive: isActive ?? true,
        });

        return NextResponse.json({
            id: newQuest._id.toString(),
            message: 'Quest created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating quest:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
