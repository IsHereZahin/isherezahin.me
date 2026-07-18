"use client";

// Shared data layer for the Personal Vault "Quiet Vault" surface: ONE merged
// query is the single source of truth. Scope, rail counts, and the unified list
// are all derived from it CLIENT-side so switching scopes never triggers a fetch.
// Every mutation must invalidate VAULT_ALL_KEY (see the modals + workspace).

import { useQuery } from "@tanstack/react-query";
import { vault } from "@/lib/api";
import type { VaultLink, VaultNote, VaultFile, VaultCredential } from "@/lib/vault/types";

export type VaultKind = "link" | "note" | "file" | "credential";

export interface UnifiedItem {
    kind: VaultKind;
    id: string;
    title: string;
    tags: string[];
    folderId: string | null;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
    /** The original record — passed to the type's modal. Credentials are MASKED here. */
    raw: VaultLink | VaultNote | VaultFile | VaultCredential;
}

export interface VaultAllData {
    links: VaultLink[];
    notes: VaultNote[];
    files: VaultFile[];
    credentials: VaultCredential[];
}

export const VAULT_ALL_KEY = ["vault-all"] as const;

/** The single merged fetch that powers the whole vault surface. */
export function useVaultAll(enabled = true) {
    return useQuery<VaultAllData>({
        queryKey: VAULT_ALL_KEY,
        enabled,
        queryFn: async () => {
            const [links, notes, files, credentials] = await Promise.all([
                vault.links.getAll(),
                vault.notes.getAll(),
                vault.files.getAll(),
                vault.credentials.getAll(),
            ]);
            return { links, notes, files, credentials };
        },
    });
}

/** Flatten the four typed arrays into one list, newest-updated first. */
export function toUnifiedItems(data: VaultAllData): UnifiedItem[] {
    const items: UnifiedItem[] = [
        ...data.links.map((l): UnifiedItem => ({ kind: "link", id: l._id, title: l.title, tags: l.tags, folderId: l.folderId, isFavorite: l.isFavorite, createdAt: l.createdAt, updatedAt: l.updatedAt, raw: l })),
        ...data.notes.map((n): UnifiedItem => ({ kind: "note", id: n._id, title: n.title, tags: n.tags, folderId: n.folderId, isFavorite: n.isFavorite, createdAt: n.createdAt, updatedAt: n.updatedAt, raw: n })),
        ...data.files.map((f): UnifiedItem => ({ kind: "file", id: f._id, title: f.name, tags: f.tags, folderId: f.folderId, isFavorite: f.isFavorite, createdAt: f.createdAt, updatedAt: f.updatedAt, raw: f })),
        ...data.credentials.map((c): UnifiedItem => ({ kind: "credential", id: c._id, title: c.title, tags: c.tags, folderId: c.folderId, isFavorite: c.isFavorite, createdAt: c.createdAt, updatedAt: c.updatedAt, raw: c })),
    ];
    return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/** Lowercased search haystack per kind. NEVER includes a credential password. */
export function itemSearchText(it: UnifiedItem): string {
    switch (it.kind) {
        case "link": { const r = it.raw as VaultLink; return `${r.title} ${r.url} ${r.description} ${r.tags.join(" ")}`; }
        case "note": { const r = it.raw as VaultNote; return `${r.title} ${r.category} ${r.content} ${r.tags.join(" ")}`; }
        case "file": { const r = it.raw as VaultFile; return `${r.name} ${r.originalName} ${r.extension} ${r.tags.join(" ")}`; }
        case "credential": { const r = it.raw as VaultCredential; return `${r.title} ${r.username} ${r.urlHint} ${r.tags.join(" ")}`; }
        default: return it.title;
    }
}

/** Compact relative time, e.g. "just now", "3h ago", "2d ago". */
export function relativeTime(iso: string): string {
    const then = new Date(iso).getTime();
    if (!then) return "";
    const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
    if (s < 45) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${Math.max(1, m)}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    const w = Math.floor(d / 7);
    if (w < 5) return `${w}w ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.floor(d / 365)}y ago`;
}
