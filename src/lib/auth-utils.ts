// src/lib/auth-utils.ts
import { auth } from '@/auth';
import { MY_MAIL } from '@/lib/constants';
import { SessionModel } from "@/database/models/session-model";
import dbConnect from "@/database/services/mongo";
import type { Session } from "next-auth";

export async function checkIsAdmin(): Promise<boolean> {
    const session = await auth();
    return session?.user?.email?.toLowerCase() === MY_MAIL.toLowerCase();
}

/**
 * Validates if the current session is still active (not revoked)
 * Returns the session if valid, null if revoked or invalid
 */
export async function validateSession() {
    try {
        const session = await auth();

        if (!session?.sessionToken) {
            return null;
        }

        await dbConnect();

        // Check if session is revoked
        const dbSession = await SessionModel.findOne({
            sessionToken: session.sessionToken,
        });

        if (!dbSession || dbSession.isRevoked) {
            return null;
        }

        // Update last active timestamp
        dbSession.lastActiveAt = new Date();
        await dbSession.save();

        return session;
    } catch (error) {
        console.error("Error validating session:", error);
        return null;
    }
}

/**
 * Checks if the user is authenticated with a specific provider
 */
export function isProviderUser(
    session: Session | null,
    provider: "github" | "google"
): boolean {
    return session?.user?.provider === provider;
}

/**
 * Checks if the user can interact with GitHub-based features (Guestbook)
 */
export function canInteractWithGuestbook(session: Session | null): boolean {
    return isProviderUser(session, "github");
}