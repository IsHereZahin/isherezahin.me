import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultFolderModel } from "@/database/models/vault-folder-model";
import { VaultLinkModel } from "@/database/models/vault-link-model";
import { VaultNoteModel } from "@/database/models/vault-note-model";
import { VaultFileModel } from "@/database/models/vault-file-model";
import { VaultCredentialModel } from "@/database/models/vault-credential-model";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;
        const data = await request.json();

        const update: Record<string, unknown> = {};
        if (data.name !== undefined) update.name = data.name;
        if (data.color !== undefined) update.color = data.color;
        if (data.order !== undefined) update.order = data.order;
        if (data.parentId !== undefined) update.parentId = data.parentId || null;

        const folder = await VaultFolderModel.findByIdAndUpdate(id, update, { new: true });
        if (!folder) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(folder);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

// Deleting a folder detaches its items (sets folderId back to null); never deletes content.
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;

        const folder = await VaultFolderModel.findByIdAndDelete(id);
        if (!folder) return NextResponse.json({ error: "Not found" }, { status: 404 });

        await Promise.all([
            VaultLinkModel.updateMany({ folderId: id }, { folderId: null }),
            VaultNoteModel.updateMany({ folderId: id }, { folderId: null }),
            VaultFileModel.updateMany({ folderId: id }, { folderId: null }),
            VaultCredentialModel.updateMany({ folderId: id }, { folderId: null }),
            VaultFolderModel.updateMany({ parentId: id }, { parentId: null }),
        ]);

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
