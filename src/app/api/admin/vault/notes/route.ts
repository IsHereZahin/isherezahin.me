import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultNoteModel } from "@/database/models/vault-note-model";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";
import { encryptData } from "@/lib/vault/crypto";
import { serializeNote, type NoteDoc } from "@/lib/vault/serialize";

export async function GET(request: NextRequest) {
    try {
        const { dek } = await requireVault();
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get("folderId");
        const favorites = searchParams.get("favorites") === "true";

        const query: Record<string, unknown> = {};
        if (folderId) query.folderId = folderId === "root" ? null : folderId;
        if (favorites) query.isFavorite = true;

        const notes = await VaultNoteModel.find(query).sort({ createdAt: -1 }).lean<NoteDoc[]>();
        return NextResponse.json(notes.map((n) => serializeNote(n, dek)));
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const { dek } = await requireVault();
        const data = await request.json();

        if (!data.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const tags = normalizeTags(data.tags);
        const isEncrypted = !!data.isEncrypted;
        const content = data.content || "";
        const checklistItems = Array.isArray(data.checklistItems) ? data.checklistItems : [];

        const doc: Record<string, unknown> = {
            title: data.title,
            category: data.category || "",
            type: data.type || "rich",
            language: data.language || "",
            tags,
            folderId: data.folderId || null,
            isFavorite: data.isFavorite ?? false,
            isEncrypted,
        };

        if (isEncrypted) {
            doc.enc = encryptData(JSON.stringify({ content, checklistItems }), dek);
            doc.content = "";
            doc.checklistItems = [];
        } else {
            doc.content = content;
            doc.checklistItems = checklistItems;
        }

        const note = await VaultNoteModel.create(doc);
        await syncVaultTags(tags);

        return NextResponse.json(serializeNote(note.toObject() as NoteDoc, dek), { status: 201 });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
