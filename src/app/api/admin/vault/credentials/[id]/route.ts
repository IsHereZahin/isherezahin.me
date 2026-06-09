import { NextRequest, NextResponse } from "next/server";
import { requireVault, vaultErrorResponse } from "@/lib/vault/guard";
import { VaultCredentialModel } from "@/database/models/vault-credential-model";
import { normalizeTags, syncVaultTags } from "@/lib/vault/tags";
import { encryptData } from "@/lib/vault/crypto";
import { serializeCredential, type CredentialDoc } from "@/lib/vault/serialize";

// Single credential with secrets revealed (used when opening the edit modal).
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { dek } = await requireVault();
        const { id } = await params;
        const cred = await VaultCredentialModel.findById(id).lean<CredentialDoc>();
        if (!cred) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(serializeCredential(cred, dek));
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { dek } = await requireVault();
        const { id } = await params;
        const data = await request.json();

        const cred = await VaultCredentialModel.findById(id);
        if (!cred) return NextResponse.json({ error: "Not found" }, { status: 404 });

        if (data.title !== undefined) cred.title = data.title;
        if (data.username !== undefined) cred.username = data.username;
        if (data.urlHint !== undefined) cred.urlHint = data.urlHint;
        if (data.folderId !== undefined) cred.folderId = data.folderId || null;
        if (data.isFavorite !== undefined) cred.isFavorite = data.isFavorite;
        if (data.tags !== undefined) {
            cred.tags = normalizeTags(data.tags);
            await syncVaultTags(cred.tags);
        }
        if (data.password !== undefined || data.notes !== undefined) {
            // Re-read existing secret to allow partial updates.
            const existing = serializeCredential(cred.toObject() as CredentialDoc, dek);
            cred.enc = encryptData(
                JSON.stringify({
                    password: data.password !== undefined ? data.password : existing.password,
                    notes: data.notes !== undefined ? data.notes : existing.notes,
                }),
                dek
            );
        }

        await cred.save();
        return NextResponse.json(serializeCredential(cred.toObject() as CredentialDoc, dek));
    } catch (error) {
        return vaultErrorResponse(error);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireVault();
        const { id } = await params;
        const cred = await VaultCredentialModel.findByIdAndDelete(id);
        if (!cred) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return vaultErrorResponse(error);
    }
}
