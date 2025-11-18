// src/app/api/blog/[slug]/like/route.ts
import { auth } from '@/auth';
import { BlogLikeModel } from '@/database/models/blog-like-model';
import { BlogModel } from '@/database/models/blog-model';
import dbConnect from '@/database/services/mongo';
import { NextRequest, NextResponse } from 'next/server';

// Type for lean BlogLike queries
type LeanBlogLike = {
    likeCount: number;
    _id: unknown;
};

// Get likes
export async function GET( req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    try {
        const { slug } = await context.params;
        const deviceId = req.headers.get('x-device-id');

        if (!deviceId) {
            return NextResponse.json(
                { error: 'Device ID required' },
                { status: 400 }
            );
        }

        // Get user session (if authenticated)
        const session = await auth();
        const userEmail = session?.user?.email || null;

        // Get blog total likes
        const blog = await BlogModel.findOne({ slug }, 'likes').lean<{ likes?: number }>();
        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Check likes by email first (if authenticated), otherwise by device
        let userLike;
        if (userEmail) {
            userLike = await BlogLikeModel.findOne({
                blogSlug: slug,
                userEmail,
            }).lean<LeanBlogLike>();
        }

        // If no email-based like found, check device-based
        if (!userLike) {
            userLike = await BlogLikeModel.findOne({
                blogSlug: slug,
                deviceId,
            }).lean<LeanBlogLike>();
        }

        return NextResponse.json({
            totalLikes: blog.likes || 0,
            userLikes: userLike?.likeCount || 0,
            isAuthenticated: !!userEmail,
            userEmail: userEmail,
        });
    } catch (error) {
        console.error('Error fetching likes:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Add like
export async function POST( req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    try {
        const { slug } = await context.params;
        const deviceId = req.headers.get('x-device-id');

        if (!deviceId) {
            return NextResponse.json(
                { error: 'Device ID required' },
                { status: 400 }
            );
        }

        // Get user session (if authenticated)
        const session = await auth();
        const userEmail = session?.user?.email || null;

        // Check if blog exists
        const blog = await BlogModel.findOne({ slug });
        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        let userLike;
        let query;
        let updateData;

        // For authenticated users
        if (userEmail) {
            query = { blogSlug: slug, userEmail };
            updateData = {
                $inc: { likeCount: 1 },
                $set: { deviceId }, // Update device ID if changed
            };

            userLike = await BlogLikeModel.findOne(query).lean<LeanBlogLike>();
        } else {
            // Anonymous user - track by device
            query = { blogSlug: slug, deviceId };
            updateData = { $inc: { likeCount: 1 } };

            userLike = await BlogLikeModel.findOne(query).lean<LeanBlogLike>();
        }

        // Check if max likes reached
        if (userLike && userLike.likeCount >= 3) {
            return NextResponse.json(
                {
                    error: 'Maximum likes reached',
                    message: userEmail
                        ? 'You have already liked this blog 3 times'
                        : 'This device has already liked this blog 3 times'
                },
                { status: 400 }
            );
        }

        // For authenticated users, check if they previously liked from another device
        if (userEmail && !userLike) {
            const emailLike = await BlogLikeModel.findOne({
                blogSlug: slug,
                userEmail,
            }).lean<LeanBlogLike>();

            if (emailLike) {
                // Merge device likes into email-based record
                const deviceLike = await BlogLikeModel.findOne({
                    blogSlug: slug,
                    deviceId,
                }).lean<LeanBlogLike>();

                if (deviceLike) {
                    // Merge device likes into email-based record
                    const totalLikes = Math.min(emailLike.likeCount + deviceLike.likeCount + 1, 3);
                    const likesToAdd = totalLikes - emailLike.likeCount;

                    if (likesToAdd <= 0) {
                        return NextResponse.json(
                            { error: 'Maximum likes reached' },
                            { status: 400 }
                        );
                    }

                    // Update email record and delete device record
                    await BlogLikeModel.updateOne(
                        { _id: emailLike._id },
                        { $inc: { likeCount: likesToAdd }, $set: { deviceId } }
                    );
                    await BlogLikeModel.deleteOne({ _id: deviceLike._id });

                    // Update blog total
                    await BlogModel.findOneAndUpdate(
                        { slug },
                        { $inc: { likes: likesToAdd } }
                    );

                    const updatedBlog = await BlogModel.findOne({ slug }, 'likes').lean<{ likes: number }>();
                    return NextResponse.json({
                        totalLikes: updatedBlog?.likes || 0,
                        userLikes: totalLikes,
                        success: true,
                        merged: true,
                    });
                }
            }
        }

        // Update or create like record
        const updatedUserLike = await BlogLikeModel.findOneAndUpdate(
            query,
            updateData,
            { new: true, upsert: true, lean: true }
        ).lean<LeanBlogLike>();

        // Increment blog total likes
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { slug },
            { $inc: { likes: 1 } },
            { new: true, lean: true }
        ).lean<{ likes: number }>();

        return NextResponse.json({
            totalLikes: updatedBlog?.likes || 0,
            userLikes: updatedUserLike?.likeCount || 0,
            success: true,
            isAuthenticated: !!userEmail,
        });
    } catch (error) {
        console.error('Error adding like:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}