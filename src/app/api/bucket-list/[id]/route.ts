import { BucketListModel } from '@/database/models/bucket-list-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;
        const isAdmin = await checkIsAdmin();

        const item = await BucketListModel.findById(id).lean();

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // If item is inactive and user is not admin, return 404
        if (!(item as any).isActive && !isAdmin) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Return appropriate fields based on admin status
        const response: any = {
            id: (item as any)._id.toString(),
            title: (item as any).title,
            description: (item as any).description,
            category: (item as any).category,
            status: (item as any).status,
            location: (item as any).location,
            completedDate: (item as any).completedDate,
            order: (item as any).order,
        };

        if (isAdmin) {
            response.isActive = (item as any).isActive;
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching bucket list item:', error);
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
        const { title, description, category, status, location, completedDate, order, isActive } = body;

        // Validate required fields
        if (!title || !description || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate category
        const validCategories = ["travel", "adventure", "personal", "career", "learning", "lifestyle"];
        if (!validCategories.includes(category)) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        // Validate status
        const validStatuses = ["completed", "in-progress", "pending"];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updatedItem = await BucketListModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                category,
                status: status || "pending",
                location: location || null,
                completedDate: completedDate || null,
                order: order ?? 0,
                isActive: isActive ?? true,
            },
            { new: true }
        );

        if (!updatedItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Bucket list item updated successfully',
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating bucket list item:', error);
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

        const deletedItem = await BucketListModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Bucket list item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting bucket list item:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
