import { NextRequest, NextResponse } from "next/server";
import { getOrCreateVaultSettings } from "@/lib/vault/guard";
import { getVaultSession } from "@/lib/vault/session";
import { VAULT_SESSION_TIMEOUT_MINUTES } from "@/lib/vault/config";

// Drives the client gate at /vault: Disabled / Not configured / Locked / Unlocked.
// Public (no admin login) so the vault can be opened from any device with just
// the vault password. Only exposes enabled/configured/unlocked flags.
export async function GET(_request: NextRequest) {
    try {
        const settings = await getOrCreateVaultSettings();

        let unlocked = false;
        if (settings.enabled && settings.isConfigured) {
            const session = await getVaultSession(
                VAULT_SESSION_TIMEOUT_MINUTES,
                settings.dekVersion
            );
            unlocked = !!session;
        }

        return NextResponse.json({
            enabled: settings.enabled,
            configured: settings.isConfigured,
            unlocked,
            sessionTimeoutMinutes: VAULT_SESSION_TIMEOUT_MINUTES,
        });
    } catch (error) {
        console.error("Vault status error:", error);
        return NextResponse.json({ error: "Failed to load vault status" }, { status: 500 });
    }
}
