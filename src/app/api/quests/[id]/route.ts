// src/app/api/quests/[id]/route.ts
import { QuestModel } from '@/database/models/quest-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { deleteCloudinaryImage } from '@/lib/cloudinary-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;
        const isAdmin = await checkIsAdmin();

        const quest = await QuestModel.findById(id).lean();

        if (!quest) {
            return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
        }

        // If quest is inactive and user is not admin, return 404
        if (!(quest as any).isActive && !isAdmin) {
            return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
        }

        // Return appropriate fields based on admin status
        const response: any = {
            id: (quest as any)._id.toString(),
            date: (quest as any).date,
            title: (quest as any).title,
            location: (quest as any).location,
            description: (quest as any).description,
            media: (quest as any).media,
            order: (quest as any).order,
        };

        if (isAdmin) {
            response.isActive = (quest as any).isActive;
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching quest:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();
        const { date, title, location, description, media, order, isActive } = body;

        // Validate required fields
        if (!date || !title || !location || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedQuest = await QuestModel.findByIdAndUpdate(
            id,
            {
                date,
                title,
                location,
                description,
                media: media || [],
                order: order ?? 0,
                isActive: isActive ?? true,
            },
            { new: true }
        );

        if (!updatedQuest) {
            return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Quest updated successfully',
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating quest:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;

        const deletedQuest = await QuestModel.findByIdAndDelete(id);

        if (!deletedQuest) {
            return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
        }

        // Delete associated images from Cloudinary
        if (deletedQuest.media && deletedQuest.media.length > 0) {
            for (const item of deletedQuest.media) {
                if (item.src && item.src.includes('cloudinary')) {
                    await deleteCloudinaryImage(item.src).catch(console.error);
                }
                if (item.thumbnail && item.thumbnail.includes('cloudinary')) {
                    await deleteCloudinaryImage(item.thumbnail).catch(console.error);
                }
            }
        }

        return NextResponse.json({ message: 'Quest deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting quest:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
