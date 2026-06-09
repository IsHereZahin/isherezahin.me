import { NextRequest, NextResponse } from "next/server";
import { getOrCreateVaultSettings, requireVaultAdmin, vaultErrorResponse } from "@/lib/vault/guard";
import { logVaultAccess } from "@/lib/vault/log";

import { VAULT_SESSION_TIMEOUT_MINUTES, VAULT_MAX_FILE_SIZE_MB } from "@/lib/vault/config";

interface VaultSettingsView {
    enabled: boolean;
    isConfigured: boolean;
}

// Public-safe view of vault settings (never expose hashes / wrapped DEK).
// Timeout / file limits are static (see config.ts), surfaced here for the UI.
function publicSettings(settings: VaultSettingsView) {
    return {
        enabled: settings.enabled,
        isConfigured: settings.isConfigured,
        sessionTimeoutMinutes: VAULT_SESSION_TIMEOUT_MINUTES,
        maxFileSizeMB: VAULT_MAX_FILE_SIZE_MB,
        allowedFileTypes: [],
    };
}

export async function GET() {
    try {
        const { settings } = await requireVaultAdmin();
        return NextResponse.json(publicSettings(settings));
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await requireVaultAdmin();
        const settings = await getOrCreateVaultSettings();
        const data = await request.json();

        // Only the module on/off toggle is dynamic; limits are static (config.ts).
        const changes: string[] = [];
        if (typeof data.enabled === "boolean") {
            settings.enabled = data.enabled;
            changes.push(`enabled=${data.enabled}`);
        }

        await settings.save();
        await logVaultAccess("settings_change", request, changes.join(", "));

        return NextResponse.json(publicSettings(settings));
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
