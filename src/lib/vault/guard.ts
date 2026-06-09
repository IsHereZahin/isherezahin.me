// src/lib/vault/guard.ts
// Central access control for vault API routes.

import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/auth-utils";
import dbConnect from "@/database/services/mongo";
import { VaultSettingsModel } from "@/database/models/vault-settings-model";
import { getVaultSession, touchVaultSession, type VaultSession } from "@/lib/vault/session";
import { VAULT_SESSION_TIMEOUT_MINUTES } from "@/lib/vault/config";

export type VaultDenyReason = "unauthorized" | "disabled" | "locked";

export class VaultAccessError extends Error {
    reason: VaultDenyReason;
    status: number;
    constructor(reason: VaultDenyReason) {
        super(reason);
        this.reason = reason;
        this.status = reason === "unauthorized" ? 401 : 403;
    }
}

// Vault settings are a singleton document. Create the defaults on first access.
export async function getOrCreateVaultSettings() {
    await dbConnect();
    let settings = await VaultSettingsModel.findOne();
    if (!settings) {
        settings = await VaultSettingsModel.create({});
    }
    return settings;
}

// Admin-only gate that does NOT require an unlocked vault (settings/auth routes).
export async function requireVaultAdmin() {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) throw new VaultAccessError("unauthorized");
    const settings = await getOrCreateVaultSettings();
    return { settings };
}

// Full gate for content/file routes: module enabled + unlocked session.
// NOT tied to admin login; the vault password is the gate, so contents are
// reachable from any device via /vault. (Admin login is only for /admin/vault settings.)
// Slides the inactivity window forward on success.
export async function requireVault(): Promise<{
    dek: Buffer;
    settings: InstanceType<typeof VaultSettingsModel>;
    session: VaultSession;
}> {
    const settings = await getOrCreateVaultSettings();
    if (!settings.enabled) throw new VaultAccessError("disabled");

    const session = await getVaultSession(
        VAULT_SESSION_TIMEOUT_MINUTES,
        settings.dekVersion
    );
    if (!session) throw new VaultAccessError("locked");

    await touchVaultSession(session, VAULT_SESSION_TIMEOUT_MINUTES);

    return { dek: session.dek, settings, session };
}

// Maps a thrown VaultAccessError (or anything else) to a NextResponse.
export function vaultErrorResponse(error: unknown): NextResponse {
    if (error instanceof VaultAccessError) {
        return NextResponse.json(
            { error: error.reason, reason: error.reason },
            { status: error.status }
        );
    }
    console.error("Vault route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
