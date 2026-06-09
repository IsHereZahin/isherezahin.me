import { NextRequest, NextResponse } from "next/server";
import { requireVaultAdmin, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultAccessLogModel } from "@/database/models/vault-access-log-model";

// Paginated access logs for the admin.
export async function GET(request: NextRequest) {
    try {
        await requireVaultAdmin();

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
        const action = searchParams.get("action");

        const query = action ? { action } : {};

        const [logs, total] = await Promise.all([
            VaultAccessLogModel.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            VaultAccessLogModel.countDocuments(query),
        ]);

        return NextResponse.json({
            logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
