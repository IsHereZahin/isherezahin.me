import { NewsletterOtpModel } from "@/database/models/newsletter-otp-model";
import { SubscriberModel } from "@/database/models/subscriber-model";
import dbConnect from "@/database/services/mongo";
import { sendOtpEmail } from "@/lib/mails/otp-email";
import { NextRequest, NextResponse } from "next/server";

const OTP_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_MINUTES = 10;

function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
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

        const normalizedEmail = email.toLowerCase();

        // Check if already subscribed
        const existingSubscriber = await SubscriberModel.findOne({
            email: normalizedEmail,
            isActive: true,
        });

        if (existingSubscriber) {
            return NextResponse.json({
                message: "This email is already subscribed to the newsletter",
                alreadySubscribed: true,
            });
        }

        // Check for existing OTP and cooldown
        const existingOtp = await NewsletterOtpModel.findOne({ email: normalizedEmail });

        if (existingOtp) {
            const timeSinceLastSent = Date.now() - existingOtp.lastSentAt.getTime();
            const cooldownMs = RESEND_COOLDOWN_MINUTES * 60 * 1000;

            if (timeSinceLastSent < cooldownMs) {
                const remainingMs = cooldownMs - timeSinceLastSent;
                const remainingMinutes = Math.ceil(remainingMs / 60000);

                return NextResponse.json({
                    error: `Please wait ${remainingMinutes} minute(s) before requesting a new code`,
                    canResendAt: new Date(existingOtp.lastSentAt.getTime() + cooldownMs).toISOString(),
                    cooldown: true,
                }, { status: 429 });
            }
        }

        // Generate new OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        // Save or update OTP
        await NewsletterOtpModel.findOneAndUpdate(
            { email: normalizedEmail },
            {
                email: normalizedEmail,
                otp,
                expiresAt,
                lastSentAt: new Date(),
            },
            { upsert: true, new: true }
        );

        // Send OTP email
        const emailSent = await sendOtpEmail(normalizedEmail, otp);

        if (!emailSent) {
            return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Verification code sent to your email",
            expiresIn: OTP_EXPIRY_MINUTES,
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Verify OTP and subscribe
export async function PUT(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase();

        // Find OTP record
        const otpRecord = await NewsletterOtpModel.findOne({ email: normalizedEmail });

        if (!otpRecord) {
            return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await NewsletterOtpModel.deleteOne({ email: normalizedEmail });
            return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        // Check if already subscribed (double check)
        const existingSubscriber = await SubscriberModel.findOne({ email: normalizedEmail });

        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                await NewsletterOtpModel.deleteOne({ email: normalizedEmail });
                return NextResponse.json({
                    message: "Already subscribed",
                    alreadySubscribed: true,
                });
            }
            // Reactivate subscription
            existingSubscriber.isActive = true;
            await existingSubscriber.save();
        } else {
            // Create new subscriber
            await SubscriberModel.create({ email: normalizedEmail });
        }

        // Delete OTP record
        await NewsletterOtpModel.deleteOne({ email: normalizedEmail });

        return NextResponse.json({
            success: true,
            message: "Successfully subscribed to the newsletter!",
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
