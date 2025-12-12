import { auth } from "@/auth";
import { ContactMessageModel } from "@/database/models/contact-message-model";
import dbConnect from "@/database/services/mongo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await auth();
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { subject, message } = await request.json();

        if (!message?.trim()) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const contactMessage = await ContactMessageModel.create({
            userId: session.user.id,
            userName: session.user.name || "Anonymous",
            userEmail: session.user.email || "",
            userImage: session.user.image || "",
            subject: subject?.trim() || "No Subject",
            message: message.trim(),
        });

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            id: contactMessage._id.toString(),
        });
    } catch (error) {
        console.error("Error sending contact message:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
