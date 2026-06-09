// src/lib/vault/serialize.ts
// Shared serializers that decrypt vault records for the (gated) client.

import { decryptData, type EncBlob } from "@/lib/vault/crypto";

export interface NoteDoc {
    _id: unknown;
    title: string;
    category: string;
    type: string;
    content: string;
    checklistItems: { text: string; done: boolean }[];
    language: string;
    tags: string[];
    folderId: unknown;
    isFavorite: boolean;
    isEncrypted: boolean;
    enc?: EncBlob;
    createdAt?: Date;
    updatedAt?: Date;
}

// Return a note with its body decrypted (the `enc` blob is never sent to the client).
export function serializeNote(note: NoteDoc, dek: Buffer) {
    const base = {
        _id: note._id,
        title: note.title,
        category: note.category,
        type: note.type,
        language: note.language,
        tags: note.tags,
        folderId: note.folderId,
        isFavorite: note.isFavorite,
        isEncrypted: note.isEncrypted,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        content: note.content,
        checklistItems: note.checklistItems,
    };

    if (note.isEncrypted && note.enc?.ciphertext) {
        try {
            const decrypted = JSON.parse(decryptData(note.enc, dek));
            base.content = decrypted.content || "";
            base.checklistItems = decrypted.checklistItems || [];
        } catch {
            base.content = "";
            base.checklistItems = [];
        }
    }

    return base;
}

export interface CredentialDoc {
    _id: unknown;
    title: string;
    username: string;
    enc?: EncBlob;
    urlHint: string;
    tags: string[];
    folderId: unknown;
    isFavorite: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Decrypt a credential's secret blob ({ password, notes }).
export function serializeCredential(cred: CredentialDoc, dek: Buffer) {
    let secret: { password?: string; notes?: string } = {};
    if (cred.enc?.ciphertext) {
        try {
            secret = JSON.parse(decryptData(cred.enc, dek));
        } catch {
            secret = {};
        }
    }
    return {
        _id: cred._id,
        title: cred.title,
        username: cred.username,
        password: secret.password || "",
        notes: secret.notes || "",
        urlHint: cred.urlHint,
        tags: cred.tags,
        folderId: cred.folderId,
        isFavorite: cred.isFavorite,
        createdAt: cred.createdAt,
        updatedAt: cred.updatedAt,
    };
}
