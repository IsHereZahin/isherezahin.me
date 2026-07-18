"use client";

import { useState, type FormEvent } from "react";
import {
    ChevronDown, FileIcon, FileText, Folder, Inbox, KeyRound, LayoutGrid,
    Link2, Lock, LockKeyhole, Plus, Settings as SettingsIcon, Star, Trash2,
} from "lucide-react";
import type { VaultFolder } from "@/lib/vault/types";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui";

export const LIBRARY_SCOPES = [
    { id: "all", label: "All Items", icon: LayoutGrid },
    { id: "links", label: "Links", icon: Link2 },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "files", label: "Files", icon: FileIcon },
    { id: "credentials", label: "Credentials", icon: KeyRound },
] as const;

const FAVORITES = { id: "favorites", label: "Favorites", icon: Star } as const;

export interface RailProps {
    scope: string;
    onScope: (scope: string) => void;
    counts: Record<string, number>;
    folders: VaultFolder[];
    onCreateFolder: (name: string) => Promise<void>;
    onDeleteFolder: (folder: VaultFolder) => void;
    admin: boolean;
    unlocked: boolean;
    autoLockMinutes?: number;
    onLock: () => void;
}

function count(counts: Record<string, number>, id: string) {
    return counts[id] ?? 0;
}

/* ---------------------------------------------------------------- rows */

function RailRow({ icon: Icon, label, count: c, active, onClick }: Readonly<{
    icon: typeof Link2; label: string; count?: number; active: boolean; onClick: () => void;
}>) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={active}
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition-colors ${active ? "bg-[var(--s-invert)] text-white" : "text-[var(--s-text2)] hover:bg-[var(--s-soft)]"}`}
        >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--s-muted)]"}`} />
            <span className="flex-1 truncate text-left font-medium">{label}</span>
            {c !== undefined && c > 0 && (
                <span className={`text-[12px] tabular-nums ${active ? "text-white/55" : "text-[var(--s-muted)]"}`}>{c}</span>
            )}
        </button>
    );
}

// Folder rows can be deleted, so they are a div-role-button to avoid nesting a
// <button> (the delete) inside another <button>.
function FolderRow({ folder, count: c, active, onSelect, onDelete }: Readonly<{
    folder: VaultFolder; count: number; active: boolean; onSelect: () => void; onDelete: () => void;
}>) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
            aria-current={active}
            className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] outline-none transition-colors focus-visible:bg-[var(--s-soft)] ${active ? "bg-[var(--s-invert)] text-white" : "text-[var(--s-text2)] hover:bg-[var(--s-soft)]"}`}
        >
            <Folder className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[var(--s-muted)]"}`} />
            <span className="flex-1 truncate text-left font-medium">{folder.name}</span>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                aria-label={`Delete folder ${folder.name}`}
                className={`hidden rounded p-0.5 group-hover:block ${active ? "text-white/70 hover:text-white" : "text-[var(--s-muted)] hover:text-[#EE5D4A]"}`}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
            {c > 0 && (
                <span className={`text-[12px] tabular-nums group-hover:hidden ${active ? "text-white/55" : "text-[var(--s-muted)]"}`}>{c}</span>
            )}
        </div>
    );
}

function FolderAdder({ onCreate }: Readonly<{ onCreate: (name: string) => Promise<void> }>) {
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || busy) return;
        setBusy(true);
        try { await onCreate(name.trim()); setName(""); setAdding(false); }
        finally { setBusy(false); }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2.5 pb-1 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--s-muted)]">Folders</span>
                <button
                    type="button"
                    onClick={() => setAdding((a) => !a)}
                    aria-label="New folder"
                    className="rounded-md p-0.5 text-[var(--s-muted)] transition-colors hover:bg-[var(--s-soft)] hover:text-[var(--s-text)]"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            {adding && (
                <form onSubmit={submit} className="px-1.5 pb-1.5">
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Escape") { setAdding(false); setName(""); } }}
                        placeholder="Folder name"
                        className="h-9 w-full rounded-lg border border-[var(--s-border)] bg-[var(--s-soft)] px-2.5 text-[13px] text-[var(--s-text)] outline-none placeholder:text-[var(--s-faint)] focus:border-[var(--s-invert)] focus:bg-[var(--s-card)]"
                    />
                </form>
            )}
        </>
    );
}

/* ---------------------------------------------------------------- desktop rail */

export default function VaultRail(props: Readonly<RailProps>) {
    const { scope, onScope, counts, folders, onCreateFolder, onDeleteFolder, admin, unlocked, autoLockMinutes, onLock } = props;

    return (
        <aside className="hidden shrink-0 flex-col self-start rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:sticky md:top-0 md:flex md:w-56">
            {/* Identity */}
            <div className="flex items-center gap-2.5 px-2 py-1.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--s-invert)]">
                    <LockKeyhole className="h-4 w-4 text-[#F4C63D]" />
                </div>
                <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight text-[var(--s-text)]">Vault</p>
                    <p className="truncate text-[11px] text-[var(--s-muted)]">
                        {unlocked ? (autoLockMinutes ? `Locks after ${autoLockMinutes}m idle` : "Unlocked") : "Locked"}
                    </p>
                </div>
            </div>

            <div className="my-1.5 h-px bg-[var(--s-track)]" />

            <nav className="space-y-0.5">
                {LIBRARY_SCOPES.map((s) => (
                    <RailRow key={s.id} icon={s.icon} label={s.label} count={count(counts, s.id)} active={scope === s.id} onClick={() => onScope(s.id)} />
                ))}
                <div className="my-2 h-px bg-[var(--s-track)]" />
                <RailRow icon={FAVORITES.icon} label={FAVORITES.label} count={count(counts, "favorites")} active={scope === "favorites"} onClick={() => onScope("favorites")} />
            </nav>

            <div className="mt-1">
                <FolderAdder onCreate={onCreateFolder} />
                <div className="space-y-0.5">
                    <RailRow icon={Inbox} label="Unfiled" count={count(counts, "unfiled")} active={scope === "unfiled"} onClick={() => onScope("unfiled")} />
                    {folders.map((f) => (
                        <FolderRow
                            key={f._id}
                            folder={f}
                            count={count(counts, `folder:${f._id}`)}
                            active={scope === `folder:${f._id}`}
                            onSelect={() => onScope(`folder:${f._id}`)}
                            onDelete={() => onDeleteFolder(f)}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-3 space-y-1 border-t border-[var(--s-border-soft)] pt-2">
                {admin && (
                    <RailRow icon={SettingsIcon} label="Settings" active={scope === "settings"} onClick={() => onScope("settings")} />
                )}
                <button
                    type="button"
                    onClick={onLock}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[var(--s-border)] bg-[var(--s-card)] text-[13px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                >
                    <Lock className="h-4 w-4" /> Lock
                </button>
            </div>
        </aside>
    );
}

/* ---------------------------------------------------------------- mobile scope bar */

export function VaultMobileScopes(props: Readonly<RailProps>) {
    const { scope, onScope, counts, folders, onCreateFolder, onDeleteFolder, admin, onLock } = props;
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");

    const pills = [...LIBRARY_SCOPES, FAVORITES];
    const inFolder = scope.startsWith("folder:") || scope === "unfiled";
    const activeFolderLabel = scope === "unfiled"
        ? "Unfiled"
        : folders.find((f) => `folder:${f._id}` === scope)?.name;

    const submitFolder = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await onCreateFolder(name.trim());
        setName("");
        setAdding(false);
    };

    return (
        <div className="space-y-3 md:hidden">
            <div className="flex items-center gap-2">
                <div className="pretty-scroll -mx-1 flex flex-1 items-center gap-1.5 overflow-x-auto px-1 pb-1">
                    {pills.map((s) => {
                        const active = scope === s.id;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => onScope(s.id)}
                                className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors ${active ? "border-[var(--s-invert)] bg-[var(--s-invert)] text-white" : "border-[var(--s-border)] bg-[var(--s-card)] text-[var(--s-text2)]"}`}
                            >
                                <s.icon className="h-3.5 w-3.5" />
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                {/* Folders + Settings + Lock in a dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={`inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3 text-[13px] font-medium transition-colors ${inFolder ? "border-[var(--s-invert)] bg-[var(--s-invert)] text-white" : "border-[var(--s-border)] bg-[var(--s-card)] text-[var(--s-text2)]"}`}
                        >
                            <Folder className="h-3.5 w-3.5" />
                            <span className="max-w-[80px] truncate">{inFolder ? activeFolderLabel : "Folders"}</span>
                            <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 rounded-xl border-[var(--s-border)]">
                        <DropdownMenuItem onClick={() => onScope("unfiled")}><Inbox className="mr-2 h-4 w-4" /> Unfiled</DropdownMenuItem>
                        {folders.map((f) => (
                            <DropdownMenuItem key={f._id} onClick={() => onScope(`folder:${f._id}`)}>
                                <Folder className="mr-2 h-4 w-4" />
                                <span className="flex-1 truncate">{f.name}</span>
                                <button
                                    type="button"
                                    aria-label={`Delete folder ${f.name}`}
                                    onClick={(e) => { e.stopPropagation(); onDeleteFolder(f); }}
                                    className="ml-2 rounded p-0.5 text-[var(--s-muted)] hover:text-[#EE5D4A]"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); setAdding(true); }}><Plus className="mr-2 h-4 w-4" /> New folder</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {admin && <DropdownMenuItem onClick={() => onScope("settings")}><SettingsIcon className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>}
                        <DropdownMenuItem onClick={onLock}><Lock className="mr-2 h-4 w-4" /> Lock vault</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {adding && (
                <form onSubmit={submitFolder} className="flex items-center gap-2">
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Escape") { setAdding(false); setName(""); } }}
                        placeholder="Folder name"
                        className="h-9 flex-1 rounded-full border border-[var(--s-border)] bg-[var(--s-soft)] px-3.5 text-[13px] text-[var(--s-text)] outline-none placeholder:text-[var(--s-faint)] focus:border-[var(--s-invert)] focus:bg-[var(--s-card)]"
                    />
                    <button type="submit" className="h-9 shrink-0 rounded-full bg-[var(--s-invert)] px-4 text-[13px] font-medium text-white">Add</button>
                </form>
            )}
        </div>
    );
}
