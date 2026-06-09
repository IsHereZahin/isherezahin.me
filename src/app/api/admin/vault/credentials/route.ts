import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultCredentialModel } from "@/database/models/vault-credential-model";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";
import { encryptData } from "@/lib/vault/crypto";
import { serializeCredential, type CredentialDoc } from "@/lib/vault/serialize";

export async function GET(request: NextRequest) {
    try {
        const { dek } = await requireVault();
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get("folderId");
        const favorites = searchParams.get("favorites") === "true";
        const reveal = searchParams.get("reveal") === "true";

        const query: Record<string, unknown> = {};
        if (folderId) query.folderId = folderId === "root" ? null : folderId;
        if (favorites) query.isFavorite = true;

        const creds = await VaultCredentialModel.find(query)
            .sort({ createdAt: -1 })
            .lean<CredentialDoc[]>();

        const serialized = creds.map((c) => {
            const full = serializeCredential(c, dek);
            // Only reveal secrets when explicitly requested; otherwise mask.
            if (!reveal) {
                return { ...full, password: full.password ? "********" : "", notes: "" };
            }
            return full;
        });

        return NextResponse.json(serialized);
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
        const enc = encryptData(
            JSON.stringify({ password: data.password || "", notes: data.notes || "" }),
            dek
        );

        const cred = await VaultCredentialModel.create({
            title: data.title,
            username: data.username || "",
            enc,
            urlHint: data.urlHint || "",
            tags,
            folderId: data.folderId || null,
            isFavorite: data.isFavorite ?? false,
        });
        await syncVaultTags(tags);

        return NextResponse.json(serializeCredential(cred.toObject() as CredentialDoc, dek), {
            status: 201,
        });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
