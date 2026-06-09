import { NextRequest, NextResponse } from "next/server";
import { getOrCreateVaultSettings, requireVaultAdmin, vaultErrorResponse } from "@/lib/vault/guard";
import {
    verifyPassword,
    hashPassword,
    generateKdfSalt,
    deriveKEK,
    unwrapDEK,
    wrapDEK,
} from "@/lib/vault/crypto";
import { logVaultAccess } from "@/lib/vault/log";

// Change the vault password while keeping all data readable: the same DEK is
// simply re-wrapped with a key derived from the new password. No re-encryption.
export async function POST(request: NextRequest) {
    try {
        await requireVaultAdmin();
        const settings = await getOrCreateVaultSettings();

        if (!settings.isConfigured) {
            return NextResponse.json({ error: "Vault is not configured yet" }, { status: 400 });
        }

        const { oldPassword, newPassword } = await request.json();
        if (!oldPassword || !newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
            return NextResponse.json(
                { error: "New password must be at least 8 characters" },
                { status: 400 }
            );
        }

        if (!verifyPassword(oldPassword, settings.passwordHash, settings.passwordSalt)) {
            await logVaultAccess("unlock_failed", request, "Wrong old password on change");
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
        }

        // Recover the existing DEK with the old password, then re-wrap with the new.
        const oldKek = deriveKEK(oldPassword, settings.kdfSalt);
        const dek = unwrapDEK(settings.wrappedDEK, oldKek);

        const { passwordHash, passwordSalt } = hashPassword(newPassword);
        const kdfSalt = generateKdfSalt();
        const newKek = deriveKEK(newPassword, kdfSalt);

        settings.passwordHash = passwordHash;
        settings.passwordSalt = passwordSalt;
        settings.kdfSalt = kdfSalt;
        settings.wrappedDEK = wrapDEK(dek, newKek);
        await settings.save();

        await logVaultAccess("password_change", request, "Vault password changed");

        return NextResponse.json({ success: true });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
