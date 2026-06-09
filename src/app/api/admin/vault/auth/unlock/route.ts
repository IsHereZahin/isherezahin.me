import { NextRequest, NextResponse } from "next/server";
import { getOrCreateVaultSettings, vaultErrorResponse, VaultAccessError } from "@/lib/vault/guard";
import { verifyPassword, deriveKEK, unwrapDEK } from "@/lib/vault/crypto";
import { createVaultSession } from "@/lib/vault/session";
import { logVaultAccess } from "@/lib/vault/log";
import { VAULT_SESSION_TIMEOUT_MINUTES } from "@/lib/vault/config";

// Verify the vault password and open an unlocked session.
// Password-only (no admin login): this is what lets you unlock from any device.
export async function POST(request: NextRequest) {
    try {
        const settings = await getOrCreateVaultSettings();

        if (!settings.enabled) throw new VaultAccessError("disabled");
        if (!settings.isConfigured) {
            return NextResponse.json(
                { error: "Vault is not configured yet" },
                { status: 400 }
            );
        }

        const { password } = await request.json();
        if (!password || typeof password !== "string") {
            return NextResponse.json({ error: "Password is required" }, { status: 400 });
        }

        const ok = verifyPassword(password, settings.passwordHash, settings.passwordSalt);
        if (!ok) {
            await logVaultAccess("unlock_failed", request);
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }

        // Correct password: derive KEK, unwrap the DEK, open the session.
        const kek = deriveKEK(password, settings.kdfSalt);
        const dek = unwrapDEK(settings.wrappedDEK, kek);

        await createVaultSession(dek, settings.dekVersion, VAULT_SESSION_TIMEOUT_MINUTES);
        await logVaultAccess("unlock_success", request);

        return NextResponse.json({ success: true });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
