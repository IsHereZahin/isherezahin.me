// src/lib/vault/session.ts
// Manages the separate, short-lived "unlocked vault" session via an encrypted cookie.
// The cookie carries the unlocked DEK plus timestamps for the inactivity timeout.

import { cookies } from "next/headers";
import { IS_PRODUCTION } from "@/lib/constants";
import { sealCookie, openCookie } from "@/lib/vault/crypto";

export const VAULT_COOKIE_NAME = "vault_session";

interface VaultSessionPayload {
    dek: string; // base64 DEK
    dekVersion: number;
    unlockedAt: number; // epoch ms
    lastActiveAt: number; // epoch ms
}

export interface VaultSession {
    dek: Buffer;
    dekVersion: number;
    unlockedAt: number;
    lastActiveAt: number;
}

function cookieOptions(maxAgeSeconds: number) {
    return {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: "strict" as const,
        path: "/",
        maxAge: maxAgeSeconds,
    };
}

// Create (or refresh) the unlocked session cookie.
export async function createVaultSession(
    dek: Buffer,
    dekVersion: number,
    timeoutMinutes: number
): Promise<void> {
    const now = Date.now();
    const payload: VaultSessionPayload = {
        dek: dek.toString("base64"),
        dekVersion,
        unlockedAt: now,
        lastActiveAt: now,
    };
    const cookieStore = await cookies();
    cookieStore.set(
        VAULT_COOKIE_NAME,
        sealCookie(payload),
        cookieOptions(timeoutMinutes * 60)
    );
}

// Read + validate the session against the inactivity timeout. Returns null if
// missing, tampered, version-mismatched, or expired.
export async function getVaultSession(
    timeoutMinutes: number,
    currentDekVersion: number
): Promise<VaultSession | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get(VAULT_COOKIE_NAME)?.value;
    if (!raw) return null;

    const payload = openCookie<VaultSessionPayload>(raw);
    if (!payload || typeof payload.dek !== "string") return null;

    // DEK was rotated (password reset); force re-unlock.
    if (payload.dekVersion !== currentDekVersion) return null;

    const idleMs = Date.now() - payload.lastActiveAt;
    if (idleMs > timeoutMinutes * 60 * 1000) return null;

    return {
        dek: Buffer.from(payload.dek, "base64"),
        dekVersion: payload.dekVersion,
        unlockedAt: payload.unlockedAt,
        lastActiveAt: payload.lastActiveAt,
    };
}

// Slide the inactivity window forward on activity.
export async function touchVaultSession(
    session: VaultSession,
    timeoutMinutes: number
): Promise<void> {
    const payload: VaultSessionPayload = {
        dek: session.dek.toString("base64"),
        dekVersion: session.dekVersion,
        unlockedAt: session.unlockedAt,
        lastActiveAt: Date.now(),
    };
    const cookieStore = await cookies();
    cookieStore.set(
        VAULT_COOKIE_NAME,
        sealCookie(payload),
        cookieOptions(timeoutMinutes * 60)
    );
}

export async function clearVaultSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(VAULT_COOKIE_NAME);
}
