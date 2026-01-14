import { SayloModel, SayloReactionModel } from "@/database/models/saylo-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

const VALID_REACTIONS = ["like", "love", "haha", "fire"] as const;
type ReactionType = typeof VALID_REACTIONS[number];

interface Reactions {
    like: number;
    love: number;
    haha: number;
    fire: number;
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const deviceId = req.headers.get("x-device-id") || "";

        const saylo = await SayloModel.findById(id).select("reactions").lean() as { reactions?: Reactions } | null;

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        // Get user's current reaction if any
        let userReaction: string | null = null;
        if (deviceId) {
            const existingReaction = await SayloReactionModel.findOne({
                sayloId: id,
                deviceId,
            }).lean() as { type: string } | null;
            userReaction = existingReaction?.type || null;
        }

        return NextResponse.json({
            reactions: saylo.reactions || { like: 0, love: 0, haha: 0, fire: 0 },
            userReaction,
        });
    } catch (error) {
        console.error("Error fetching reactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch reactions" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const deviceId = req.headers.get("x-device-id");
        const body = await req.json();
        const { type } = body;

        if (!deviceId) {
            return NextResponse.json(
                { error: "Device ID required" },
                { status: 400 }
            );
        }

        if (!type || !VALID_REACTIONS.includes(type)) {
            return NextResponse.json(
                { error: "Invalid reaction type" },
                { status: 400 }
            );
        }

        const saylo = await SayloModel.findById(id);

        if (!saylo) {
            return NextResponse.json(
                { error: "Saylo not found" },
                { status: 404 }
            );
        }

        // Initialize reactions if not present (for older documents)
        if (!saylo.reactions) {
            saylo.reactions = { like: 0, love: 0, haha: 0, fire: 0 };
        }

        // Check if user already has a reaction
        const existingReaction = await SayloReactionModel.findOne({
            sayloId: id,
            deviceId,
        });

        if (existingReaction) {
            const oldType = existingReaction.type as ReactionType;

            if (oldType === type) {
                // Same reaction - remove it (toggle off)
                await SayloReactionModel.deleteOne({ _id: existingReaction._id });
                saylo.reactions[oldType] = Math.max(0, (saylo.reactions[oldType] || 0) - 1);
                await saylo.save();

                return NextResponse.json({
                    reactions: saylo.reactions,
                    userReaction: null,
                });
            } else {
                // Different reaction - switch it
                saylo.reactions[oldType] = Math.max(0, (saylo.reactions[oldType] || 0) - 1);
                saylo.reactions[type as ReactionType] = (saylo.reactions[type as ReactionType] || 0) + 1;
                existingReaction.type = type;
                await existingReaction.save();
                await saylo.save();

                return NextResponse.json({
                    reactions: saylo.reactions,
                    userReaction: type,
                });
            }
        } else {
            // New reaction
            await SayloReactionModel.create({
                sayloId: id,
                deviceId,
                type,
            });
            saylo.reactions[type as ReactionType] = (saylo.reactions[type as ReactionType] || 0) + 1;
            await saylo.save();

            return NextResponse.json({
                reactions: saylo.reactions,
                userReaction: type,
            });
        }
    } catch (error) {
        console.error("Error toggling reaction:", error);
        return NextResponse.json(
            { error: "Failed to toggle reaction" },
            { status: 500 }
        );
    }
}
