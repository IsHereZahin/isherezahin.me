// src/lib/vault/types.ts
// Client-side types for the Personal Vault UI.

export interface VaultStatus {
    enabled: boolean;
    configured: boolean;
    unlocked: boolean;
    sessionTimeoutMinutes: number;
}

export interface VaultSettings {
    enabled: boolean;
    isConfigured: boolean;
    sessionTimeoutMinutes: number;
    maxFileSizeMB: number;
    allowedFileTypes: string[];
}

export interface VaultFolder {
    _id: string;
    name: string;
    parentId: string | null;
    color?: string;
    order?: number;
}

export interface VaultTag {
    _id: string;
    name: string;
    color?: string;
}

export interface VaultLink {
    _id: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    folderId: string | null;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

export type VaultNoteType = "rich" | "code" | "checklist";

export interface ChecklistItem {
    text: string;
    done: boolean;
}

export interface VaultNote {
    _id: string;
    title: string;
    category: string;
    type: VaultNoteType;
    content: string;
    checklistItems: ChecklistItem[];
    language: string;
    tags: string[];
    folderId: string | null;
    isFavorite: boolean;
    isEncrypted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VaultCredential {
    _id: string;
    title: string;
    username: string;
    password: string;
    notes: string;
    urlHint: string;
    tags: string[];
    folderId: string | null;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VaultFile {
    _id: string;
    name: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
    extension: string;
    tags: string[];
    folderId: string | null;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VaultAccessLog {
    _id: string;
    action: string;
    ipAddress: string | null;
    deviceType: string;
    detail: string;
    createdAt: string;
}

export type VaultSection = "dashboard" | "links" | "notes" | "files" | "credentials" | "settings";
