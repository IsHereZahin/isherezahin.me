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
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition-colors ${active ? "bg-[#26262B] text-white" : "text-[#57544e] hover:bg-[#F6F4EF]"}`}
        >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#9a978f]"}`} />
            <span className="flex-1 truncate text-left font-medium">{label}</span>
            {c !== undefined && c > 0 && (
                <span className={`text-[12px] tabular-nums ${active ? "text-white/55" : "text-[#9a978f]"}`}>{c}</span>
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
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
            aria-current={active}
            className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] outline-none transition-colors focus-visible:bg-[#F6F4EF] ${active ? "bg-[#26262B] text-white" : "text-[#57544e] hover:bg-[#F6F4EF]"}`}
        >
            <Folder className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#9a978f]"}`} />
            <span className="flex-1 truncate text-left font-medium">{folder.name}</span>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                aria-label={`Delete folder ${folder.name}`}
                className={`hidden rounded p-0.5 group-hover:block ${active ? "text-white/70 hover:text-white" : "text-[#9a978f] hover:text-[#EE5D4A]"}`}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
            {c > 0 && (
                <span className={`text-[12px] tabular-nums group-hover:hidden ${active ? "text-white/55" : "text-[#9a978f]"}`}>{c}</span>
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
                <span className="text-[11px] font-medium uppercase tracking-wide text-[#9a978f]">Folders</span>
                <button
                    type="button"
                    onClick={() => setAdding((a) => !a)}
                    aria-label="New folder"
                    className="rounded-md p-0.5 text-[#9a978f] transition-colors hover:bg-[#F6F4EF] hover:text-[#26262B]"
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
                        className="h-9 w-full rounded-lg border border-[#EEEAE2] bg-[#F6F4EF] px-2.5 text-[13px] text-[#26262B] outline-none placeholder:text-[#bdb9b0] focus:border-[#26262B] focus:bg-white"
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
        <aside className="hidden shrink-0 flex-col self-start rounded-[24px] border border-[#EEEAE2] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:sticky md:top-0 md:flex md:w-56">
            {/* Identity */}
            <div className="flex items-center gap-2.5 px-2 py-1.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#26262B]">
                    <LockKeyhole className="h-4 w-4 text-[#F4C63D]" />
                </div>
                <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight text-[#26262B]">Vault</p>
                    <p className="truncate text-[11px] text-[#9a978f]">
                        {unlocked ? (autoLockMinutes ? `Locks after ${autoLockMinutes}m idle` : "Unlocked") : "Locked"}
                    </p>
                </div>
            </div>

            <div className="my-1.5 h-px bg-[#f1ede5]" />

            <nav className="space-y-0.5">
                {LIBRARY_SCOPES.map((s) => (
                    <RailRow key={s.id} icon={s.icon} label={s.label} count={count(counts, s.id)} active={scope === s.id} onClick={() => onScope(s.id)} />
                ))}
                <div className="my-2 h-px bg-[#f1ede5]" />
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

            <div className="mt-3 space-y-1 border-t border-[#f1ede5] pt-2">
                {admin && (
                    <RailRow icon={SettingsIcon} label="Settings" active={scope === "settings"} onClick={() => onScope("settings")} />
                )}
                <button
                    type="button"
                    onClick={onLock}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#EEEAE2] bg-white text-[13px] font-medium text-[#26262B] transition-colors hover:bg-[#F6F4EF]"
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
                                className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors ${active ? "border-[#26262B] bg-[#26262B] text-white" : "border-[#EEEAE2] bg-white text-[#57544e]"}`}
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
                            className={`inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3 text-[13px] font-medium transition-colors ${inFolder ? "border-[#26262B] bg-[#26262B] text-white" : "border-[#EEEAE2] bg-white text-[#57544e]"}`}
                        >
                            <Folder className="h-3.5 w-3.5" />
                            <span className="max-w-[80px] truncate">{inFolder ? activeFolderLabel : "Folders"}</span>
                            <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 rounded-xl border-[#EEEAE2]">
                        <DropdownMenuItem onClick={() => onScope("unfiled")}><Inbox className="mr-2 h-4 w-4" /> Unfiled</DropdownMenuItem>
                        {folders.map((f) => (
                            <DropdownMenuItem key={f._id} onClick={() => onScope(`folder:${f._id}`)}>
                                <Folder className="mr-2 h-4 w-4" />
                                <span className="flex-1 truncate">{f.name}</span>
                                <Trash2
                                    className="ml-2 h-3.5 w-3.5 text-[#9a978f] hover:text-[#EE5D4A]"
                                    onClick={(e) => { e.stopPropagation(); onDeleteFolder(f); }}
                                />
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
                        className="h-9 flex-1 rounded-full border border-[#EEEAE2] bg-[#F6F4EF] px-3.5 text-[13px] text-[#26262B] outline-none placeholder:text-[#bdb9b0] focus:border-[#26262B] focus:bg-white"
                    />
                    <button type="submit" className="h-9 shrink-0 rounded-full bg-[#26262B] px-4 text-[13px] font-medium text-white">Add</button>
                </form>
            )}
        </div>
    );
}
