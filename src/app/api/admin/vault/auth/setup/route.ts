import { NextRequest, NextResponse } from "next/server";
import { getOrCreateVaultSettings, requireVaultAdmin, vaultErrorResponse } from "@/lib/vault/guard";
import {
    hashPassword,
    generateKdfSalt,
    deriveKEK,
    generateDEK,
    wrapDEK,
} from "@/lib/vault/crypto";
import { createVaultSession } from "@/lib/vault/session";
import { logVaultAccess } from "@/lib/vault/log";
import { VAULT_SESSION_TIMEOUT_MINUTES } from "@/lib/vault/config";

// Set the INITIAL vault password (only when not already configured).
export async function POST(request: NextRequest) {
    try {
        await requireVaultAdmin();
        const settings = await getOrCreateVaultSettings();

        if (settings.isConfigured) {
            return NextResponse.json(
                { error: "Vault is already configured. Use change password instead." },
                { status: 400 }
            );
        }

        const { password } = await request.json();
        if (!password || typeof password !== "string" || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const { passwordHash, passwordSalt } = hashPassword(password);
        const kdfSalt = generateKdfSalt();
        const kek = deriveKEK(password, kdfSalt);
        const dek = generateDEK();
        const wrappedDEK = wrapDEK(dek, kek);

        settings.passwordHash = passwordHash;
        settings.passwordSalt = passwordSalt;
        settings.kdfSalt = kdfSalt;
        settings.wrappedDEK = wrappedDEK;
        settings.dekVersion = settings.dekVersion || 1;
        settings.isConfigured = true;
        await settings.save();

        // Auto-unlock right after setup.
        await createVaultSession(dek, settings.dekVersion, VAULT_SESSION_TIMEOUT_MINUTES);
        await logVaultAccess("password_change", request, "Initial vault password set");

        return NextResponse.json({ success: true });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
