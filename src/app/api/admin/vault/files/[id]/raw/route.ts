import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultFileModel } from "@/database/models/vault-file-model";
import { readVaultFile } from "@/lib/vault/files";
import { logVaultAccess } from "@/lib/vault/log";

// The ONLY way to retrieve file bytes. Gated by requireVault(); no public URL exists.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const download = searchParams.get("download") === "true";

        const file = await VaultFileModel.findById(id).lean<{
            name: string;
            mimeType: string;
            storageKey: string;
        }>();
        if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const buffer = await readVaultFile(file.storageKey);
        await logVaultAccess("file_download", request, file.name);

        const disposition = download ? "attachment" : "inline";
        const safeName = encodeURIComponent(file.name);

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type": file.mimeType || "application/octet-stream",
                "Content-Disposition": `${disposition}; filename*=UTF-8''${safeName}`,
                "Content-Length": buffer.length.toString(),
                "Cache-Control": "private, no-store",
            },
        });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
