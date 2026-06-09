import { NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultTagModel } from "@/database/models/vault-tag-model";

export async function GET() {
    try {
        await requireVault();
        const tags = await VaultTagModel.find().sort({ name: 1 }).lean();
        return NextResponse.json(tags);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
