"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ChevronDown, FileText, HardDriveUpload, KeyRound, Link2, Search, Star, X,
} from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultCredential, VaultFile, VaultFolder, VaultLink, VaultNote, VaultStatus } from "@/lib/vault/types";
import {
    ConfirmDialog, Dialog, DialogContent, DialogHeader, DialogTitle, DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, ShadcnButton as Button,
} from "@/components/ui";
import VaultGate from "./VaultGate";
import VaultRail, { VaultMobileScopes, LIBRARY_SCOPES } from "./VaultRail";
import VaultRow, { isImageFile, isPreviewableFile } from "./VaultRow";
import VaultSettingsPanel from "./VaultSettingsPanel";
import LinkModal from "./LinkModal";
import NoteModal from "./NoteModal";
import CredentialModal from "./CredentialModal";
import {
    itemSearchText, toUnifiedItems, useVaultAll, VAULT_ALL_KEY,
    type UnifiedItem, type VaultAllData, type VaultKind,
} from "./vaultData";

const KIND_TO_ARRAY: Record<VaultKind, keyof VaultAllData> = { link: "links", note: "notes", file: "files", credential: "credentials" };
const KIND_TO_SCOPE: Record<VaultKind, string> = { link: "links", note: "notes", file: "files", credential: "credentials" };

// Optimistically flip a favorite in the merged cache (typed, no `any`).
function flipFavorite(data: VaultAllData, kind: VaultKind, id: string, value: boolean): VaultAllData {
    const upd = <T extends { _id: string; isFavorite: boolean }>(arr: T[]) => arr.map((x) => (x._id === id ? { ...x, isFavorite: value } : x));
    switch (kind) {
        case "link": return { ...data, links: upd(data.links) };
        case "note": return { ...data, notes: upd(data.notes) };
        case "file": return { ...data, files: upd(data.files) };
        case "credential": return { ...data, credentials: upd(data.credentials) };
        default: return data;
    }
}

export default function VaultWorkspace({ admin = false }: Readonly<{ admin?: boolean }>) {
    const queryClient = useQueryClient();
    const [scope, setScope] = useState("all");
    const [query, setQuery] = useState("");
    const searching = query.trim().length > 0;
    const searchRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: status } = useQuery<VaultStatus>({
        queryKey: ["vault-status"],
        queryFn: vault.status,
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
    });
    const unlocked = !!status?.unlocked;

    const { data: allData, isLoading: allLoading } = useVaultAll(unlocked);
    const { data: folders = [] } = useQuery<VaultFolder[]>({
        queryKey: ["vault-folders"],
        queryFn: vault.folders.getAll,
        enabled: unlocked,
    });

    // Modal / dialog state (centralized so any row can trigger them).
    const [linkModal, setLinkModal] = useState<{ open: boolean; link: VaultLink | null }>({ open: false, link: null });
    const [noteModal, setNoteModal] = useState<{ open: boolean; note: VaultNote | null }>({ open: false, note: null });
    const [credModal, setCredModal] = useState<{ open: boolean; credential: VaultCredential | null }>({ open: false, credential: null });
    const [filePreview, setFilePreview] = useState<VaultFile | null>(null);
    const [fileRename, setFileRename] = useState<VaultFile | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<UnifiedItem | null>(null);
    const [folderDelete, setFolderDelete] = useState<VaultFolder | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const items = useMemo(() => (allData ? toUnifiedItems(allData) : []), [allData]);

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: items.length, links: 0, notes: 0, files: 0, credentials: 0, favorites: 0, unfiled: 0 };
        for (const it of items) {
            c[KIND_TO_SCOPE[it.kind]]++;
            if (it.isFavorite) c.favorites++;
            if (it.folderId === null) c.unfiled++;
            else c[`folder:${it.folderId}`] = (c[`folder:${it.folderId}`] ?? 0) + 1;
        }
        return c;
    }, [items]);

    // Search overrides scope: a query filters ALL items; otherwise filter by scope.
    const filtered = useMemo(() => {
        if (searching) {
            const q = query.trim().toLowerCase();
            return items.filter((it) => itemSearchText(it).toLowerCase().includes(q));
        }
        if (scope === "all") return items;
        if (scope === "favorites") return items.filter((it) => it.isFavorite);
        if (scope === "unfiled") return items.filter((it) => it.folderId === null);
        if (scope.startsWith("folder:")) { const id = scope.slice(7); return items.filter((it) => it.folderId === id); }
        return items.filter((it) => KIND_TO_SCOPE[it.kind] === scope); // links/notes/files/credentials
    }, [items, scope, query, searching]);

    const activeFolderId = scope.startsWith("folder:") ? scope.slice(7) : null;

    const scopeTitle = (() => {
        if (searching) return `Results for “${query.trim()}”`;
        if (scope === "all") return "All Items";
        if (scope === "favorites") return "Favorites";
        if (scope === "unfiled") return "Unfiled";
        if (scope.startsWith("folder:")) return folders.find((f) => `folder:${f._id}` === scope)?.name ?? "Folder";
        return LIBRARY_SCOPES.find((s) => s.id === scope)?.label ?? "Items";
    })();

    const refresh = () => queryClient.invalidateQueries({ queryKey: VAULT_ALL_KEY });

    /* -------------------------------------------------------------- handlers */

    const handleLock = async () => {
        try {
            await vault.lock();
            toast.success("Vault locked");
            queryClient.invalidateQueries({ queryKey: ["vault-status"] });
        } catch { toast.error("Failed to lock vault"); }
    };

    const onEdit = async (item: UnifiedItem) => {
        if (item.kind === "link") setLinkModal({ open: true, link: item.raw as VaultLink });
        else if (item.kind === "note") setNoteModal({ open: true, note: item.raw as VaultNote });
        else if (item.kind === "credential") {
            try {
                const full = await vault.credentials.get(item.id); // fetch the real (unmasked) record
                setCredModal({ open: true, credential: full });
            } catch { toast.error("Failed to load credential"); }
        } else if (item.kind === "file") { setFileRename(item.raw as VaultFile); setRenameValue((item.raw as VaultFile).name); }
    };

    const onToggleFavorite = async (item: UnifiedItem) => {
        queryClient.setQueryData<VaultAllData>(VAULT_ALL_KEY, (old) => (old ? flipFavorite(old, item.kind, item.id, !item.isFavorite) : old));
        try {
            const api = { link: vault.links, note: vault.notes, file: vault.files, credential: vault.credentials }[item.kind];
            await api.update(item.id, { isFavorite: !item.isFavorite });
        } catch {
            toast.error("Failed to update favorite");
        } finally {
            refresh();
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const api = { link: vault.links, note: vault.notes, file: vault.files, credential: vault.credentials }[deleteTarget.kind];
        await api.delete(deleteTarget.id);
        toast.success("Item deleted");
        setDeleteTarget(null);
        refresh();
    };

    const handleRename = async () => {
        if (!fileRename || !renameValue.trim()) return;
        await vault.files.update(fileRename._id, { name: renameValue.trim() });
        toast.success("File renamed");
        setFileRename(null);
        refresh();
    };

    const uploadFiles = async (list: FileList | File[]) => {
        const arr = Array.from(list);
        if (!arr.length) return;
        setUploading(true);
        try {
            for (const file of arr) await vault.files.upload(file, { folderId: activeFolderId });
            toast.success(`Uploaded ${arr.length} file${arr.length === 1 ? "" : "s"}`);
            refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const createFolder = async (name: string) => {
        try {
            await vault.folders.create({ name });
            toast.success("Folder created");
            queryClient.invalidateQueries({ queryKey: ["vault-folders"] });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create folder");
        }
    };

    const confirmFolderDelete = async () => {
        if (!folderDelete) return;
        await vault.folders.delete(folderDelete._id);
        toast.success("Folder deleted");
        if (scope === `folder:${folderDelete._id}`) setScope("all");
        setFolderDelete(null);
        queryClient.invalidateQueries({ queryKey: ["vault-folders"] });
        refresh(); // items may have moved to Unfiled
    };

    // Keyboard: "/" or Cmd/Ctrl+K focuses search.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement | null;
            const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
            if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const railProps = {
        scope, onScope: setScope, counts, folders,
        onCreateFolder: createFolder, onDeleteFolder: setFolderDelete,
        admin, unlocked, autoLockMinutes: status?.sessionTimeoutMinutes, onLock: handleLock,
    };

    /* -------------------------------------------------------------- list panel */

    const newMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button type="button" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#26262B] px-4 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]">
                    New <ChevronDown className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl border-[#EEEAE2]">
                <DropdownMenuItem onClick={() => setLinkModal({ open: true, link: null })}><Link2 className="mr-2 h-4 w-4" /> New link</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNoteModal({ open: true, note: null })}><FileText className="mr-2 h-4 w-4" /> New note</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCredModal({ open: true, credential: null })}><KeyRound className="mr-2 h-4 w-4" /> New credential</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}><HardDriveUpload className="mr-2 h-4 w-4" /> Upload file</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const quickAdd = [
        { label: "Link", icon: Link2, onClick: () => setLinkModal({ open: true, link: null }) },
        { label: "Note", icon: FileText, onClick: () => setNoteModal({ open: true, note: null }) },
        { label: "Credential", icon: KeyRound, onClick: () => setCredModal({ open: true, credential: null }) },
        { label: "Upload", icon: HardDriveUpload, onClick: () => fileInputRef.current?.click() },
    ];

    let listBody: React.ReactNode;
    if (allLoading) {
        listBody = (
            <div className="animate-pulse divide-y divide-[#f1ede5]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F1EDE5]" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/3 rounded bg-[#F1EDE5]" />
                            <div className="h-2.5 w-1/2 rounded bg-[#EFEAE2]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    } else if (filtered.length > 0) {
        listBody = (
            <div className="divide-y divide-[#f1ede5]">
                {filtered.map((it) => (
                    <VaultRow
                        key={`${it.kind}-${it.id}`}
                        item={it}
                        onEdit={onEdit}
                        onDelete={setDeleteTarget}
                        onToggleFavorite={onToggleFavorite}
                        onPreviewFile={setFilePreview}
                        onRenameFile={(f) => { setFileRename(f); setRenameValue(f.name); }}
                    />
                ))}
            </div>
        );
    } else if (searching) {
        listBody = (
            <div className="px-6 py-16 text-center">
                <p className="text-[14px] font-medium text-[#26262B]">No matches for “{query.trim()}”</p>
                <p className="mx-auto mt-1 max-w-xs text-[13px] text-[#9a978f]">Try a different term, or clear the search to browse.</p>
                <button onClick={() => setQuery("")} className="mt-5 inline-flex h-10 items-center rounded-full border border-[#EEEAE2] bg-white px-5 text-[13px] font-medium text-[#26262B] hover:bg-[#F6F4EF]">Clear search</button>
            </div>
        );
    } else if (items.length === 0) {
        // First run — whole vault empty.
        listBody = (
            <div className="px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6F4EF]"><Star className="h-6 w-6 text-[#9a978f]" /></div>
                <p className="text-[15px] font-semibold text-[#26262B]">Your vault is empty</p>
                <p className="mx-auto mt-1 max-w-sm text-[13px] text-[#9a978f]">Save a link, jot a note, upload a file, or store a credential. Everything is encrypted at rest.</p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {quickAdd.map((q) => (
                        <button key={q.label} onClick={q.onClick} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#EEEAE2] bg-white px-4 text-[13px] font-medium text-[#26262B] hover:bg-[#F6F4EF]">
                            <q.icon className="h-4 w-4 text-[#9a978f]" /> {q.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    } else {
        // Scope is empty but the vault has items elsewhere.
        listBody = (
            <div className="px-6 py-16 text-center">
                <p className="text-[14px] font-medium text-[#26262B]">Nothing here yet</p>
                <p className="mx-auto mt-1 max-w-xs text-[13px] text-[#9a978f]">
                    {scope === "favorites" ? "Star an item to pin it to your favorites." : scope === "credentials" ? "No credentials in this view. Secrets are encrypted at rest." : "This view has no items yet."}
                </p>
            </div>
        );
    }

    const listPanel = (
        <main
            className="relative min-w-0 flex-1 overflow-hidden rounded-[24px] border border-[#EEEAE2] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            onDragOver={(e) => { e.preventDefault(); if (!dragOver) setDragOver(true); }}
            onDragLeave={(e) => { if (e.currentTarget === e.target) setDragOver(false); }}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files); }}
        >
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-[#f1ede5] p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <h2 className="truncate text-[16px] font-semibold text-[#26262B]">{scopeTitle}</h2>
                    <p className="mt-0.5 text-[12px] text-[#9a978f]">{filtered.length} {filtered.length === 1 ? "item" : "items"}{uploading ? " · uploading…" : ""}</p>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                    <div className="relative flex-1 sm:w-60 sm:flex-none">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bdb9b0]" />
                        <input
                            ref={searchRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); searchRef.current?.blur(); } }}
                            placeholder="Search vault…"
                            className="h-10 w-full rounded-full border border-[#EEEAE2] bg-[#F6F4EF] pl-10 pr-9 text-[13px] text-[#26262B] outline-none transition-colors placeholder:text-[#bdb9b0] focus:border-[#26262B] focus:bg-white"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a978f] hover:text-[#26262B]"><X className="h-4 w-4" /></button>
                        )}
                    </div>
                    {newMenu}
                </div>
            </div>

            {listBody}

            {/* Full-surface drag overlay, only while dragging. */}
            {dragOver && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[24px] border-2 border-dashed border-[#26262B] bg-[#F6F4EF]/90">
                    <div className="text-center text-[#26262B]">
                        <HardDriveUpload className="mx-auto mb-2 h-7 w-7" />
                        <p className="text-[13px] font-medium">Drop files to upload</p>
                    </div>
                </div>
            )}

            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ""; }} />
        </main>
    );

    /* -------------------------------------------------------------- assembled body */

    const body = (
        <div className="space-y-4">
            <VaultMobileScopes {...railProps} />
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <VaultRail {...railProps} />
                {scope === "settings" && admin ? (
                    <div className="min-w-0 flex-1"><VaultSettingsPanel /></div>
                ) : (
                    listPanel
                )}
            </div>
        </div>
    );

    const modals = (
        <>
            <LinkModal open={linkModal.open} onOpenChange={(open) => setLinkModal({ open, link: open ? linkModal.link : null })} link={linkModal.link} folderId={activeFolderId} />
            <NoteModal open={noteModal.open} onOpenChange={(open) => setNoteModal({ open, note: open ? noteModal.note : null })} note={noteModal.note} folderId={activeFolderId} />
            <CredentialModal open={credModal.open} onOpenChange={(open) => setCredModal({ open, credential: open ? credModal.credential : null })} credential={credModal.credential} folderId={activeFolderId} />

            {/* File preview */}
            <Dialog open={!!filePreview} onOpenChange={(open) => !open && setFilePreview(null)}>
                <DialogContent className="max-h-[85vh] overflow-auto sm:max-w-[800px]">
                    <DialogHeader><DialogTitle className="truncate pr-6">{filePreview?.name}</DialogTitle></DialogHeader>
                    {filePreview && isImageFile(filePreview) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={vault.files.fileUrl(filePreview._id)} alt={filePreview.name} className="max-w-full rounded-lg" />
                    )}
                    {filePreview && filePreview.extension === "pdf" && (
                        <iframe src={vault.files.fileUrl(filePreview._id)} title={filePreview.name} className="h-[70vh] w-full rounded-lg border border-[#EEEAE2]" />
                    )}
                </DialogContent>
            </Dialog>

            {/* File rename */}
            <Dialog open={!!fileRename} onOpenChange={(open) => !open && setFileRename(null)}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader><DialogTitle>Rename file</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setFileRename(null)}>Cancel</Button>
                            <Button onClick={handleRename}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Delete item?"
                description={`“${deleteTarget?.title || "This item"}” will be permanently removed.${deleteTarget?.kind === "credential" ? " Its encrypted secret is destroyed." : ""}`}
                confirmText="Delete"
                variant="danger"
                onConfirm={confirmDelete}
            />
            <ConfirmDialog
                open={!!folderDelete}
                onOpenChange={(open) => !open && setFolderDelete(null)}
                title="Delete folder?"
                description={`“${folderDelete?.name}” will be removed. Items inside it move to Unfiled — they are not deleted.`}
                confirmText="Delete Folder"
                variant="danger"
                onConfirm={confirmFolderDelete}
            />
        </>
    );

    // Public (non-admin): the whole surface is gated — only the access screen shows
    // until unlocked, then the vault (no Settings). Admin: rail always visible,
    // Settings ungated, content gated so a locked admin can still reach Settings.
    if (!admin) {
        return (
            <div className="mx-auto w-full max-w-5xl">
                <VaultGate>{() => <>{body}{modals}</>}</VaultGate>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl">
            {scope === "settings"
                ? <>{body}{modals}</>
                : <VaultGate>{() => <>{body}{modals}</>}</VaultGate>}
        </div>
    );
}
