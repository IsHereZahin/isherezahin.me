import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultFolderModel } from "@/database/models/vault-folder-model";

export async function GET() {
    try {
        await requireVault();
        const folders = await VaultFolderModel.find().sort({ order: 1, name: 1 }).lean();
        return NextResponse.json(folders);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireVault();
        const data = await request.json();
        if (!data.name) {
            return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
        }
        const folder = await VaultFolderModel.create({
            name: data.name,
            parentId: data.parentId || null,
            color: data.color || "",
            order: data.order || 0,
        });
        return NextResponse.json(folder, { status: 201 });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
