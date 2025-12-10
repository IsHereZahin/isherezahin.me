// src/app/api/blog/tags/route.ts
import { BlogModel } from '@/database/models/blog-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const isAdmin = await checkIsAdmin();
        const query = isAdmin ? {} : { published: true };

        // Get all unique tags from blogs
        const tags = await BlogModel.distinct('tags', query);
        
        // Sort tags alphabetically
        const sortedTags = tags.sort((a: string, b: string) => 
            a.toLowerCase().localeCompare(b.toLowerCase())
        );

        return NextResponse.json({ tags: sortedTags }, { status: 200 });
    } catch (error) {
        console.error('Error fetching blog tags:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
