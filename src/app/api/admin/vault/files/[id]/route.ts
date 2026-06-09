import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultFileModel } from "@/database/models/vault-file-model";
import { deleteVaultFile } from "@/lib/vault/files";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";

// Rename / move / favorite: metadata only (bytes are immutable).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;
        const data = await request.json();

        const update: Record<string, unknown> = {};
        if (data.name !== undefined) update.name = data.name;
        if (data.folderId !== undefined) update.folderId = data.folderId || null;
        if (data.isFavorite !== undefined) update.isFavorite = data.isFavorite;
        if (data.tags !== undefined) {
            update.tags = normalizeTags(data.tags);
            await syncVaultTags(update.tags as string[]);
        }

        const file = await VaultFileModel.findByIdAndUpdate(id, update, { new: true });
        if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(file);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;

        const file = await VaultFileModel.findById(id);
        if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

        await deleteVaultFile(file.storageKey);
        await file.deleteOne();

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
