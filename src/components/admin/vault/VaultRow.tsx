"use client";

import { useState } from "react";
import {
    Code, Copy, Download, ExternalLink, FileIcon, FileText, KeyRound,
    ListChecks, Link2, Lock, MoreHorizontal, Pencil, Star, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultCredential, VaultFile, VaultLink, VaultNote } from "@/lib/vault/types";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui";
import { relativeTime, type UnifiedItem } from "./vaultData";

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp"];
const noteTypeIcon = { rich: FileText, code: Code, checklist: ListChecks } as const;

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const isImageFile = (f: VaultFile) => IMAGE_EXT.includes(f.extension);
const isPreviewableFile = (f: VaultFile) => isImageFile(f) || f.extension === "pdf";

/** Image thumbnail: placeholder icon instantly, lazy image fades in when ready. */
function FileThumb({ file, onClick }: Readonly<{ file: VaultFile; onClick: () => void }>) {
    const [loaded, setLoaded] = useState(false);
    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            title="Preview"
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[var(--s-border)] bg-[var(--s-soft)]"
        >
            {!loaded && <FileIcon className="absolute inset-0 m-auto h-4 w-4 text-[var(--s-muted)]" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={vault.files.fileUrl(file._id)}
                alt={file.name}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
        </button>
    );
}

function IconTile({ item }: Readonly<{ item: UnifiedItem }>) {
    let Icon = Link2;
    if (item.kind === "note") Icon = noteTypeIcon[(item.raw as VaultNote).type] ?? FileText;
    else if (item.kind === "file") Icon = FileIcon;
    else if (item.kind === "credential") Icon = KeyRound;
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--s-border)] bg-[var(--s-soft)]">
            <Icon className="h-[18px] w-[18px] text-[var(--s-text2)]" />
        </div>
    );
}

function secondaryText(item: UnifiedItem): string {
    switch (item.kind) {
        case "link":
            return (item.raw as VaultLink).url;
        case "note": {
            const n = item.raw as VaultNote;
            if (n.type === "checklist") {
                const done = n.checklistItems.filter((c) => c.done).length;
                return `${done}/${n.checklistItems.length} done`;
            }
            if (n.isEncrypted && !n.content) return "Encrypted note";
            if (n.content) return n.content.replace(/\s+/g, " ").slice(0, 140);
            return n.type === "code" ? (n.language || "Code snippet") : "Empty note";
        }
        case "file": {
            const f = item.raw as VaultFile;
            return `${f.extension.toUpperCase()} · ${formatBytes(f.sizeBytes)}`;
        }
        case "credential": {
            const c = item.raw as VaultCredential;
            return c.username || c.urlHint || "No username";
        }
        default:
            return "";
    }
}

interface VaultRowProps {
    item: UnifiedItem;
    onEdit: (item: UnifiedItem) => void;
    onDelete: (item: UnifiedItem) => void;
    onToggleFavorite: (item: UnifiedItem) => void;
    onPreviewFile: (file: VaultFile) => void;
    onRenameFile: (file: VaultFile) => void;
}

export default function VaultRow({ item, onEdit, onDelete, onToggleFavorite, onPreviewFile, onRenameFile }: Readonly<VaultRowProps>) {
    const note = item.kind === "note" ? (item.raw as VaultNote) : null;
    const file = item.kind === "file" ? (item.raw as VaultFile) : null;

    const openLink = () => window.open((item.raw as VaultLink).url, "_blank", "noopener,noreferrer");

    const copyText = async (text: string, label: string) => {
        try { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); }
        catch { toast.error("Failed to copy"); }
    };

    const copyPassword = async () => {
        try {
            const full = await vault.credentials.get(item.id);
            await navigator.clipboard.writeText(full.password || "");
            toast.success("Password copied");
        } catch { toast.error("Failed to copy password"); }
    };

    const downloadFile = () => {
        if (!file) return;
        const a = document.createElement("a");
        a.href = vault.files.fileUrl(file._id, true);
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    // Row click = the item's most natural primary action.
    const handleOpen = () => {
        if (item.kind === "link") openLink();
        else if (item.kind === "file") { if (file && isPreviewableFile(file)) onPreviewFile(file); else downloadFile(); }
        else onEdit(item); // note + credential open their edit modal
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
            className="group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-[var(--s-soft)] focus-visible:bg-[var(--s-soft)]"
        >
            {file && isImageFile(file)
                ? <FileThumb file={file} onClick={() => onPreviewFile(file)} />
                : <IconTile item={item} />}

            <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="truncate text-[14px] font-medium text-[var(--s-text)]">{item.title || "Untitled"}</p>
                    {note?.isEncrypted && <Lock className="h-3 w-3 shrink-0 text-[var(--s-muted)]" />}
                </div>
                <p className="truncate text-[12px] text-[var(--s-muted)]">{secondaryText(item)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
                <span className="mr-1 hidden text-[11px] tabular-nums text-[var(--s-muted)] sm:inline">{relativeTime(item.updatedAt)}</span>

                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(item); }}
                    className="rounded-lg p-1.5 text-[var(--s-muted)] transition-colors hover:bg-[var(--s-border)]"
                    aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <Star className={`h-4 w-4 ${item.isFavorite ? "fill-[#F4C63D] text-[#F4C63D]" : "hover:text-[var(--s-text)]"}`} />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="rounded-lg p-1.5 text-[var(--s-muted)] transition-colors hover:bg-[var(--s-border)] hover:text-[var(--s-text)] data-[state=open]:bg-[var(--s-border)] data-[state=open]:text-[var(--s-text)]"
                            aria-label="More actions"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl border-[var(--s-border)]">
                        {item.kind === "link" && (
                            <>
                                <DropdownMenuItem onClick={openLink}><ExternalLink className="mr-2 h-4 w-4" /> Open link</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyText((item.raw as VaultLink).url, "URL")}><Copy className="mr-2 h-4 w-4" /> Copy URL</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(item)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            </>
                        )}
                        {item.kind === "note" && (
                            <DropdownMenuItem onClick={() => onEdit(item)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        )}
                        {item.kind === "credential" && (
                            <>
                                <DropdownMenuItem onClick={copyPassword}><Copy className="mr-2 h-4 w-4" /> Copy password</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(item)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            </>
                        )}
                        {item.kind === "file" && file && (
                            <>
                                {isPreviewableFile(file) && <DropdownMenuItem onClick={() => onPreviewFile(file)}><ExternalLink className="mr-2 h-4 w-4" /> Preview</DropdownMenuItem>}
                                <DropdownMenuItem onClick={downloadFile}><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onRenameFile(file)}><Pencil className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(item)} className="text-[#EE5D4A] focus:text-[#EE5D4A]">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export { isPreviewableFile, isImageFile };
