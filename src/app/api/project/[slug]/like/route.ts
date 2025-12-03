// src/app/api/project/[slug]/like/route.ts
import { auth } from '@/auth';
import { ProjectLikeModel } from '@/database/models/project-like-model';
import { ProjectModel } from '@/database/models/project-model';
import dbConnect from '@/database/services/mongo';
import { NextRequest, NextResponse } from 'next/server';

// Type for lean ProjectLike queries
type LeanProjectLike = {
    likeCount: number;
    _id: unknown;
};

// Get likes
export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
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

        // Get project total likes
        const project = await ProjectModel.findOne({ slug }, 'likes').lean<{ likes?: number }>();
        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Check likes by email first (if authenticated), otherwise by device
        let userLike;
        if (userEmail) {
            userLike = await ProjectLikeModel.findOne({
                projectSlug: slug,
                userEmail,
            }).lean<LeanProjectLike>();
        }

        // If no email-based like found, check device-based
        if (!userLike) {
            userLike = await ProjectLikeModel.findOne({
                projectSlug: slug,
                deviceId,
            }).lean<LeanProjectLike>();
        }

        return NextResponse.json({
            totalLikes: project.likes || 0,
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
export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
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

        // Check if project exists
        const project = await ProjectModel.findOne({ slug });
        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        let userLike;
        let query;
        let updateData;

        // For authenticated users
        if (userEmail) {
            query = { projectSlug: slug, userEmail };
            updateData = {
                $inc: { likeCount: 1 },
                $set: { deviceId }, // Update device ID if changed
            };

            userLike = await ProjectLikeModel.findOne(query).lean<LeanProjectLike>();
        } else {
            // Anonymous user - track by device
            query = { projectSlug: slug, deviceId };
            updateData = { $inc: { likeCount: 1 } };

            userLike = await ProjectLikeModel.findOne(query).lean<LeanProjectLike>();
        }

        // Check if max likes reached
        if (userLike && userLike.likeCount >= 3) {
            return NextResponse.json(
                {
                    error: 'Maximum likes reached',
                    message: userEmail
                        ? 'You have already liked this project 3 times'
                        : 'This device has already liked this project 3 times'
                },
                { status: 400 }
            );
        }

        // For authenticated users, check if they previously liked from another device
        if (userEmail && !userLike) {
            const emailLike = await ProjectLikeModel.findOne({
                projectSlug: slug,
                userEmail,
            }).lean<LeanProjectLike>();

            if (emailLike) {
                // Merge device likes into email-based record
                const deviceLike = await ProjectLikeModel.findOne({
                    projectSlug: slug,
                    deviceId,
                }).lean<LeanProjectLike>();

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
                    await ProjectLikeModel.updateOne(
                        { _id: emailLike._id },
                        { $inc: { likeCount: likesToAdd }, $set: { deviceId } }
                    );
                    await ProjectLikeModel.deleteOne({ _id: deviceLike._id });

                    // Update project total
                    await ProjectModel.findOneAndUpdate(
                        { slug },
                        { $inc: { likes: likesToAdd } }
                    );

                    const updatedProject = await ProjectModel.findOne({ slug }, 'likes').lean<{ likes: number }>();
                    return NextResponse.json({
                        totalLikes: updatedProject?.likes || 0,
                        userLikes: totalLikes,
                        success: true,
                        merged: true,
                    });
                }
            }
        }

        // Update or create like record
        const updatedUserLike = await ProjectLikeModel.findOneAndUpdate(
            query,
            updateData,
            { new: true, upsert: true, lean: true }
        ).lean<LeanProjectLike>();

        // Increment project total likes
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { slug },
            { $inc: { likes: 1 } },
            { new: true, lean: true }
        ).lean<{ likes: number }>();

        return NextResponse.json({
            totalLikes: updatedProject?.likes || 0,
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