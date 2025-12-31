import { BucketListModel } from '@/database/models/bucket-list-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { NextRequest, NextResponse } from 'next/server';

// Public fields that non-admin users can see
const publicFields = {
    _id: 1,
    title: 1,
    description: 1,
    category: 1,
    status: 1,
    location: 1,
    completedDate: 1,
    order: 1,
};

export async function GET() {
    await dbConnect();
    try {
        const isAdmin = await checkIsAdmin();

        // Build query - non-admin users only see active items
        const query = isAdmin ? {} : { isActive: true };

        // Select fields based on admin status
        const projection = isAdmin ? {} : publicFields;

        const items = await BucketListModel.find(query, projection)
            .sort({ order: 1, createdAt: -1 })
            .lean();

        // Map _id to id for frontend
        const mappedItems = items.map((item: any) => ({
            id: item._id.toString(),
            title: item.title,
            description: item.description,
            category: item.category,
            status: item.status,
            location: item.location,
            completedDate: item.completedDate,
            order: item.order,
            ...(isAdmin && { isActive: item.isActive }),
        }));

        // Calculate stats
        const stats = {
            total: mappedItems.length,
            completed: mappedItems.filter((i: any) => i.status === "completed").length,
            inProgress: mappedItems.filter((i: any) => i.status === "in-progress").length,
            pending: mappedItems.filter((i: any) => i.status === "pending").length,
        };

        return NextResponse.json({ items: mappedItems, stats }, { status: 200 });
    } catch (error) {
        console.error('Error fetching bucket list:', error);
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

        const newItem = await BucketListModel.create({
            title,
            description,
            category,
            status: status || "pending",
            location: location || null,
            completedDate: completedDate || null,
            order: order ?? 0,
            isActive: isActive ?? true,
        });

        return NextResponse.json({
            id: newItem._id.toString(),
            message: 'Bucket list item created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating bucket list item:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
