import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultLinkModel } from "@/database/models/vault-link-model";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;
        const data = await request.json();

        const update: Record<string, unknown> = {};
        if (data.title !== undefined) update.title = data.title;
        if (data.url !== undefined) update.url = data.url;
        if (data.description !== undefined) update.description = data.description;
        if (data.folderId !== undefined) update.folderId = data.folderId || null;
        if (data.isFavorite !== undefined) update.isFavorite = data.isFavorite;
        if (data.tags !== undefined) {
            update.tags = normalizeTags(data.tags);
            await syncVaultTags(update.tags as string[]);
        }

        const link = await VaultLinkModel.findByIdAndUpdate(id, update, { new: true });
        if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(link);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;
        const link = await VaultLinkModel.findByIdAndDelete(id);
        if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
