import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultLinkModel } from "@/database/models/vault-link-model";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";

export async function GET(request: NextRequest) {
    try {
        await requireVault();
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get("folderId");
        const favorites = searchParams.get("favorites") === "true";

        const query: Record<string, unknown> = {};
        if (folderId) query.folderId = folderId === "root" ? null : folderId;
        if (favorites) query.isFavorite = true;

        const links = await VaultLinkModel.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json(links);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireVault();
        const data = await request.json();

        if (!data.title || !data.url) {
            return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
        }

        const tags = normalizeTags(data.tags);
        const link = await VaultLinkModel.create({
            title: data.title,
            url: data.url,
            description: data.description || "",
            tags,
            folderId: data.folderId || null,
            isFavorite: data.isFavorite ?? false,
        });
        await syncVaultTags(tags);

        return NextResponse.json(link, { status: 201 });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
