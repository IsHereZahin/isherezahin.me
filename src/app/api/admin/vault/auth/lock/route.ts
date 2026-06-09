import { NextRequest, NextResponse } from "next/server";
import { vaultErrorResponse } from "@/lib/vault/guard";
import { clearVaultSession } from "@/lib/vault/session";
import { logVaultAccess } from "@/lib/vault/log";

// Lock the vault (clear the unlocked session). Requires re-entry afterwards.
// Password-only context: clearing your own session needs no admin login.
export async function POST(request: NextRequest) {
    try {
        await clearVaultSession();
        await logVaultAccess("lock", request);
        return NextResponse.json({ success: true });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
