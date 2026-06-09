import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultNoteModel } from "@/database/models/vault-note-model";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";
import { encryptData } from "@/lib/vault/crypto";
import { serializeNote, type NoteDoc } from "@/lib/vault/serialize";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { dek } = await requireVault();
        const { id } = await params;
        const data = await request.json();

        const note = await VaultNoteModel.findById(id);
        if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

        if (data.title !== undefined) note.title = data.title;
        if (data.category !== undefined) note.category = data.category;
        if (data.type !== undefined) note.type = data.type;
        if (data.language !== undefined) note.language = data.language;
        if (data.folderId !== undefined) note.folderId = data.folderId || null;
        if (data.isFavorite !== undefined) note.isFavorite = data.isFavorite;
        if (data.tags !== undefined) {
            note.tags = normalizeTags(data.tags);
            await syncVaultTags(note.tags);
        }

        // Re-evaluate encryption whenever body or the flag changes.
        const bodyChanged =
            data.content !== undefined ||
            data.checklistItems !== undefined ||
            data.isEncrypted !== undefined;

        if (bodyChanged) {
            const isEncrypted = data.isEncrypted ?? note.isEncrypted;
            const content = data.content !== undefined ? data.content : note.content;
            const checklistItems =
                data.checklistItems !== undefined ? data.checklistItems : note.checklistItems;

            note.isEncrypted = isEncrypted;
            if (isEncrypted) {
                note.enc = encryptData(JSON.stringify({ content, checklistItems }), dek);
                note.content = "";
                note.checklistItems = [];
            } else {
                note.content = content;
                note.checklistItems = checklistItems;
                note.enc = { ciphertext: "", iv: "", authTag: "" };
            }
        }

        await note.save();
        return NextResponse.json(serializeNote(note.toObject() as NoteDoc, dek));
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;
        const note = await VaultNoteModel.findByIdAndDelete(id);
        if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
