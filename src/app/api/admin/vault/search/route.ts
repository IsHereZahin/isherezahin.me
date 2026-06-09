import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultLinkModel } from "@/database/models/vault-link-model";
import { VaultNoteModel } from "@/database/models/vault-note-model";
import { VaultFileModel } from "@/database/models/vault-file-model";
import { VaultCredentialModel } from "@/database/models/vault-credential-model";
import { serializeNote, type NoteDoc } from "@/lib/vault/serialize";

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Global search across links, notes, files, and credentials.
// Note: encrypted note/credential BODIES are not searchable (ciphertext); we
// match on titles, tags, and other plaintext metadata.
export async function GET(request: NextRequest) {
    try {
        const { dek } = await requireVault();
        const { searchParams } = new URL(request.url);

        const q = (searchParams.get("q") || "").trim();
        const tag = (searchParams.get("tag") || "").trim().toLowerCase();
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const type = searchParams.get("type"); // links|notes|files|credentials|all

        // Shared date-range filter on createdAt.
        const dateFilter: Record<string, Date> = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) {
            const end = new Date(to);
            end.setHours(23, 59, 59, 999);
            dateFilter.$lte = end;
        }
        const hasDate = Object.keys(dateFilter).length > 0;

        const rx = q ? new RegExp(escapeRegex(q), "i") : null;
        const baseAnd = (orClauses: Record<string, unknown>[]) => {
            const and: Record<string, unknown>[] = [];
            if (rx && orClauses.length) and.push({ $or: orClauses });
            if (tag) and.push({ tags: tag });
            if (hasDate) and.push({ createdAt: dateFilter });
            return and.length ? { $and: and } : {};
        };

        const want = (t: string) => !type || type === "all" || type === t;
        const results: Record<string, unknown[]> = { links: [], notes: [], files: [], credentials: [] };

        if (want("links")) {
            results.links = await VaultLinkModel.find(
                baseAnd(rx ? [{ title: rx }, { url: rx }, { description: rx }] : [])
            )
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
        }

        if (want("notes")) {
            const notes = await VaultNoteModel.find(
                baseAnd(rx ? [{ title: rx }, { category: rx }, { content: rx }] : [])
            )
                .sort({ createdAt: -1 })
                .limit(50)
                .lean<NoteDoc[]>();
            results.notes = notes.map((n) => serializeNote(n, dek));
        }

        if (want("files")) {
            results.files = await VaultFileModel.find(
                baseAnd(rx ? [{ name: rx }, { originalName: rx }] : [])
            )
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
        }

        if (want("credentials")) {
            // Secrets stay masked in search results.
            const creds = await VaultCredentialModel.find(
                baseAnd(rx ? [{ title: rx }, { username: rx }, { urlHint: rx }] : [])
            )
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
            results.credentials = creds.map((c) => ({
                _id: c._id,
                title: c.title,
                username: c.username,
                urlHint: c.urlHint,
                tags: c.tags,
                folderId: c.folderId,
                isFavorite: c.isFavorite,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
            }));
        }

        return NextResponse.json(results);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
