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
import { VaultCredentialModel } from "@/database/models/vault-credential-model";
import { VaultNoteModel } from "@/database/models/vault-note-model";
import { VAULT_SESSION_TIMEOUT_MINUTES } from "@/lib/vault/config";

// Reset the password WITHOUT the old one. The old DEK is unrecoverable by design,
// so encrypted payloads (credentials + encrypted notes) are purged and a fresh
// DEK is generated. Bumping dekVersion invalidates every existing session.
export async function POST(request: NextRequest) {
    try {
        await requireVaultAdmin();
        const settings = await getOrCreateVaultSettings();

        const { newPassword, confirm } = await request.json();
        if (confirm !== true) {
            return NextResponse.json(
                { error: "Reset must be explicitly confirmed" },
                { status: 400 }
            );
        }
        if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Purge data encrypted under the old (now unrecoverable) DEK.
        const purgedCredentials = await VaultCredentialModel.deleteMany({});
        const purgedNotes = await VaultNoteModel.deleteMany({ isEncrypted: true });

        const { passwordHash, passwordSalt } = hashPassword(newPassword);
        const kdfSalt = generateKdfSalt();
        const kek = deriveKEK(newPassword, kdfSalt);
        const dek = generateDEK();

        settings.passwordHash = passwordHash;
        settings.passwordSalt = passwordSalt;
        settings.kdfSalt = kdfSalt;
        settings.wrappedDEK = wrapDEK(dek, kek);
        settings.dekVersion = (settings.dekVersion || 1) + 1;
        settings.isConfigured = true;
        await settings.save();

        await createVaultSession(dek, settings.dekVersion, VAULT_SESSION_TIMEOUT_MINUTES);
        await logVaultAccess(
            "password_reset",
            request,
            `Purged ${purgedCredentials.deletedCount} credentials, ${purgedNotes.deletedCount} encrypted notes`
        );

        return NextResponse.json({
            success: true,
            purged: {
                credentials: purgedCredentials.deletedCount,
                encryptedNotes: purgedNotes.deletedCount,
            },
        });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
