// src/lib/vault/log.ts
// Records vault access events. Best-effort: logging failures never break a request.

import { NextRequest } from "next/server";
import { VaultAccessLogModel } from "@/database/models/vault-access-log-model";
import dbConnect from "@/database/services/mongo";
import { getClientIp, parseSessionInfo } from "@/lib/utils";

export type VaultLogAction =
    | "unlock_success"
    | "unlock_failed"
    | "lock"
    | "logout"
    | "file_upload"
    | "file_download"
    | "password_change"
    | "password_reset"
    | "settings_change"
    | "activity_cleared";

export async function logVaultAccess(
    action: VaultLogAction,
    request: NextRequest,
    detail = ""
): Promise<void> {
    try {
        await dbConnect();
        const userAgentRaw = request.headers.get("user-agent") || "";
        const ipAddress = getClientIp(request);
        const { deviceType } = parseSessionInfo(userAgentRaw, ipAddress);

        await VaultAccessLogModel.create({
            action,
            ipAddress,
            userAgentRaw,
            deviceType,
            detail,
        });
    } catch (error) {
        console.error("Failed to write vault access log:", error);
    }
}
