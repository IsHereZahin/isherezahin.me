import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultFileModel } from "@/database/models/vault-file-model";
import { uploadVaultFile } from "@/lib/vault/files";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";
import { logVaultAccess } from "@/lib/vault/log";
import { VAULT_MAX_FILE_SIZE_MB } from "@/lib/vault/config";

function getExtension(name: string): string {
    const match = /\.([^.]+)$/.exec(name);
    return match ? match[1].toLowerCase() : "";
}

export async function GET(request: NextRequest) {
    try {
        await requireVault();
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get("folderId");
        const favorites = searchParams.get("favorites") === "true";

        const query: Record<string, unknown> = {};
        if (folderId) query.folderId = folderId === "root" ? null : folderId;
        if (favorites) query.isFavorite = true;

        const files = await VaultFileModel.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json(files);
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireVault();

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folderId = (formData.get("folderId") as string) || null;
        const tags = normalizeTags(
            (formData.get("tags") as string)?.split(",").map((t) => t.trim()) || []
        );

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate size against the static limit. All file types are allowed.
        const maxBytes = VAULT_MAX_FILE_SIZE_MB * 1024 * 1024;
        if (file.size > maxBytes) {
            return NextResponse.json(
                { error: `File exceeds the ${VAULT_MAX_FILE_SIZE_MB}MB limit` },
                { status: 400 }
            );
        }

        const extension = getExtension(file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const storageKey = await uploadVaultFile(buffer, file.name, file.type);

        const doc = await VaultFileModel.create({
            name: file.name,
            originalName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
            storageKey,
            resourceType: "gridfs",
            extension,
            tags,
            folderId: folderId || null,
        });
        await syncVaultTags(tags);
        await logVaultAccess("file_upload", request, `${file.name} (${file.size} bytes)`);

        return NextResponse.json(doc, { status: 201 });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
