import { SayloModel, SayloReactionModel } from "@/database/models/saylo-model";
import dbConnect from "@/database/services/mongo";
import { auth } from "@/auth";
import { UserModel } from "@/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

const VALID_REACTIONS = ["like", "love", "haha", "fire"] as const;
type ReactionType = (typeof VALID_REACTIONS)[number];

interface Reactions {
    like: number;
    love: number;
    haha: number;
    fire: number;
}

interface DbUser {
    _id: { toString(): string };
}

const GUEST_ADJECTIVES = ["Happy", "Curious", "Clever", "Friendly", "Bright", "Swift", "Calm", "Bold", "Wise", "Kind"];
const GUEST_NOUNS = ["Panda", "Fox", "Owl", "Bear", "Wolf", "Eagle", "Tiger", "Lion", "Hawk", "Deer"];

function generateGuestName(): string {
    const adj = GUEST_ADJECTIVES[Math.floor(Math.random() * GUEST_ADJECTIVES.length)];
    const noun = GUEST_NOUNS[Math.floor(Math.random() * GUEST_NOUNS.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const deviceId = req.headers.get("x-device-id") || "";

        const session = await auth();
        let dbUser: DbUser | null = null;
        if (session?.user?.id) {
            dbUser = await UserModel.findById(session.user.id).lean() as DbUser | null;
        }

        const saylo = (await SayloModel.findById(id).select("reactions").lean()) as { reactions?: Reactions } | null;

        if (!saylo) {
            return NextResponse.json({ error: "Saylo not found" }, { status: 404 });
        }

        let userReaction: string | null = null;

        if (dbUser) {
            const existingReaction = await SayloReactionModel.findOne({
                sayloId: id,
                userId: dbUser._id,
            }).lean() as { type: string } | null;
            userReaction = existingReaction?.type || null;
        } else if (deviceId) {
            const existingReaction = await SayloReactionModel.findOne({
                sayloId: id,
                deviceId,
                userId: null,
            }).lean() as { type: string } | null;
            userReaction = existingReaction?.type || null;
        }

        return NextResponse.json({
            reactions: saylo.reactions || { like: 0, love: 0, haha: 0, fire: 0 },
            userReaction,
        });
    } catch {
        return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 });
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

        const session = await auth();
        let dbUser: DbUser | null = null;
        if (session?.user?.id) {
            dbUser = await UserModel.findById(session.user.id).lean() as DbUser | null;
        }

        if (!dbUser && !deviceId) {
            return NextResponse.json({ error: "Device ID required for guest users" }, { status: 400 });
        }

        if (!type || !VALID_REACTIONS.includes(type)) {
            return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
        }

        const saylo = await SayloModel.findById(id);

        if (!saylo) {
            return NextResponse.json({ error: "Saylo not found" }, { status: 404 });
        }

        if (!saylo.reactions) {
            saylo.reactions = { like: 0, love: 0, haha: 0, fire: 0 };
        }

        let existingReaction;

        if (dbUser) {
            existingReaction = await SayloReactionModel.findOne({
                sayloId: id,
                userId: dbUser._id,
            });
        } else {
            existingReaction = await SayloReactionModel.findOne({
                sayloId: id,
                deviceId,
                userId: null,
            });
        }

        if (existingReaction) {
            const oldType = existingReaction.type as ReactionType;

            if (oldType === type) {
                await SayloReactionModel.deleteOne({ _id: existingReaction._id });
                saylo.reactions[oldType] = Math.max(0, (saylo.reactions[oldType] || 0) - 1);
                await saylo.save();

                return NextResponse.json({
                    reactions: saylo.reactions,
                    userReaction: null,
                });
            } else {
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
            const reactionData: {
                sayloId: string;
                type: string;
                userId?: string;
                deviceId?: string;
                guestName?: string;
            } = {
                sayloId: id,
                type,
            };

            if (dbUser) {
                reactionData.userId = dbUser._id.toString();
            } else {
                reactionData.deviceId = deviceId!;
                reactionData.guestName = generateGuestName();
            }

            await SayloReactionModel.create(reactionData);
            saylo.reactions[type as ReactionType] = (saylo.reactions[type as ReactionType] || 0) + 1;
            await saylo.save();

            return NextResponse.json({
                reactions: saylo.reactions,
                userReaction: type,
            });
        }
    } catch {
        return NextResponse.json({ error: "Failed to toggle reaction" }, { status: 500 });
    }
}
