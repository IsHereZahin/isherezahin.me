import { NextRequest, NextResponse } from "next/server";
import { requireVaultAdmin, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultAccessLogModel } from "@/database/models/vault-access-log-model";
import dbConnect from "@/database/services/mongo";
import { getClientIp, parseSessionInfo } from "@/lib/utils";

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

// Clear the entire activity history (admin only), while preserving the audit
// trail: a single new "activity_cleared" entry is written recording how many
// previous logs were removed, then every OTHER log is deleted. The new audit
// entry is created BEFORE the delete so the trail can never be lost mid-operation.
export async function DELETE(request: NextRequest) {
    try {
        await requireVaultAdmin();
        await dbConnect();

        const removed = await VaultAccessLogModel.countDocuments({});

        const userAgentRaw = request.headers.get("user-agent") || "";
        const ipAddress = getClientIp(request);
        const { deviceType } = parseSessionInfo(userAgentRaw, ipAddress);
        const detail = `Deleted ${removed} previous activity ${removed === 1 ? "log" : "logs"}.`;

        const audit = await VaultAccessLogModel.create({
            action: "activity_cleared",
            ipAddress,
            userAgentRaw,
            deviceType,
            detail,
        });

        await VaultAccessLogModel.deleteMany({ _id: { $ne: audit._id } });

        return NextResponse.json({ removed, detail });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
