// src/app/api/blog/[slug]/route.ts
import { BlogModel } from '@/database/models/blog-model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest,context: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await context.params

        const blog = await BlogModel.findOne({ slug }).lean()
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
        }

        return NextResponse.json(blog, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
