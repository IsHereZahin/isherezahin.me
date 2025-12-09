import { SubscriberModel } from "@/database/models/subscriber-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

// Check if email is subscribed and get newsletter status
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const checkStatus = searchParams.get("status");

        // If checking newsletter status only
        if (checkStatus === "true") {
            const { AdminSettingsModel } = await import("@/database/models/admin-settings-model");
            const newsletterSetting = await AdminSettingsModel.findOne({ key: 'newsletterEnabled' }).lean() as { value: boolean } | null;
            const isNewsletterEnabled = newsletterSetting?.value ?? true;
            return NextResponse.json({ newsletterEnabled: isNewsletterEnabled });
        }

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const subscriber = await SubscriberModel.findOne({ 
            email: email.toLowerCase(),
            isActive: true 
        });

        // Also get newsletter enabled status
        const { AdminSettingsModel } = await import("@/database/models/admin-settings-model");
        const newsletterSetting = await AdminSettingsModel.findOne({ key: 'newsletterEnabled' }).lean() as { value: boolean } | null;
        const isNewsletterEnabled = newsletterSetting?.value ?? true;

        return NextResponse.json({ 
            isSubscribed: !!subscriber,
            newsletterEnabled: isNewsletterEnabled
        });
    } catch (error) {
        console.error("Error checking subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Subscribe email
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Check if already subscribed
        const existingSubscriber = await SubscriberModel.findOne({ 
            email: email.toLowerCase() 
        });

        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return NextResponse.json({ 
                    message: "Already subscribed",
                    alreadySubscribed: true 
                });
            }
            // Reactivate subscription
            existingSubscriber.isActive = true;
            await existingSubscriber.save();
            return NextResponse.json({ 
                message: "Subscription reactivated",
                success: true 
            });
        }

        // Create new subscriber
        await SubscriberModel.create({ email: email.toLowerCase() });

        return NextResponse.json({ 
            message: "Successfully subscribed!",
            success: true 
        });
    } catch (error) {
        console.error("Error subscribing:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Unsubscribe email
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Find and deactivate subscription
        const subscriber = await SubscriberModel.findOne({ 
            email: email.toLowerCase() 
        });

        if (!subscriber) {
            return NextResponse.json({ 
                error: "Email not found in subscribers",
                success: false 
            }, { status: 404 });
        }

        if (!subscriber.isActive) {
            return NextResponse.json({ 
                message: "Already unsubscribed",
                success: true 
            });
        }

        // Deactivate subscription (soft delete)
        subscriber.isActive = false;
        await subscriber.save();

        return NextResponse.json({ 
            message: "Successfully unsubscribed",
            success: true 
        });
    } catch (error) {
        console.error("Error unsubscribing:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
