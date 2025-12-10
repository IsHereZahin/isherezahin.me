// src/app/api/blog/route.ts
import { AdminSettingsModel } from '@/database/models/admin-settings-model';
import { BlogModel } from '@/database/models/blog-model';
import { SubscriberModel } from '@/database/models/subscriber-model';
import dbConnect from '@/database/services/mongo';
import { checkIsAdmin } from '@/lib/auth-utils';
import { sendNewBlogNotification } from '@/lib/mails/new-blog-notification';
import { Blog, BlogDocument } from '@/utils/types';
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

        // Build query - non-admin users only see published blogs
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

        const total = await BlogModel.countDocuments(query);

        const blogsFromDb = await BlogModel.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean<BlogDocument[]>();

        if (!blogsFromDb || blogsFromDb.length === 0) {
            return NextResponse.json({ 
                total: 0,
                page,
                limit,
                blogs: [],
            }, { status: 200 });
        }

        // Map _id to id
        const blogs: Blog[] = blogsFromDb.map(blog => ({
            id: blog._id.toString(),
            date: blog.date.toString(),
            views: blog.views,
            likes: blog.likes,
            type: blog.type,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            tags: blog.tags,
            imageSrc: blog.imageSrc,
            content: blog.content,
            published: blog.published ?? true,
        }));

        return NextResponse.json({
            total,
            page,
            limit,
            blogs,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
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
        const { title, slug, excerpt, tags, imageSrc, content, published } = body;

        // Validate required fields
        if (!title || !slug || !excerpt || !imageSrc || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if slug already exists
        const existingBlog = await BlogModel.findOne({ slug });
        if (existingBlog) {
            return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 400 });
        }

        const newBlog = await BlogModel.create({
            date: new Date(),
            views: 0,
            likes: 0,
            type: 'Blog',
            title,
            slug,
            excerpt,
            tags: tags || [],
            imageSrc,
            content,
            published: published ?? false,
        });

        // Send newsletter to subscribers if blog is published and newsletter is enabled
        let emailsSent = 0;
        let emailsFailed = 0;
        
        if (published) {
            try {
                // Check if newsletter is enabled
                const newsletterSetting = await AdminSettingsModel.findOne({ key: 'newsletterEnabled' }).lean() as { value: boolean } | null;
                const isNewsletterEnabled = newsletterSetting?.value ?? true;

                console.log('Newsletter enabled:', isNewsletterEnabled);

                if (isNewsletterEnabled) {
                    // Get all active subscribers
                    const activeSubscribers = await SubscriberModel.find({ isActive: true }).lean() as unknown as { email: string }[];
                    const subscriberEmails = activeSubscribers.map((sub) => sub.email);

                    console.log('Active subscribers found:', subscriberEmails.length);

                    if (subscriberEmails.length > 0) {
                        const result = await sendNewBlogNotification(
                            {
                                blogTitle: title,
                                blogExcerpt: excerpt,
                                blogSlug: slug,
                                blogImageSrc: imageSrc,
                                publishedDate: new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }),
                            },
                            subscriberEmails
                        );
                        emailsSent = result.sent;
                        emailsFailed = result.failed;
                        console.log('Newsletter results - sent:', emailsSent, 'failed:', emailsFailed);
                    }
                }
            } catch (emailError) {
                console.error('Error sending newsletter emails:', emailError);
            }
        }

        return NextResponse.json({
            id: newBlog._id.toString(),
            message: 'Blog created successfully',
            newsletter: published ? { sent: emailsSent, failed: emailsFailed } : null,
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
