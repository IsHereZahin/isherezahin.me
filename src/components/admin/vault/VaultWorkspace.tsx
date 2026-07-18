"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Link2, FileText, FileIcon, KeyRound, Search, Lock, X, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultStatus } from "@/lib/vault/types";
import VaultGate from "./VaultGate";
import VaultDashboard from "./VaultDashboard";
import VaultLinks from "./VaultLinks";
import VaultNotes from "./VaultNotes";
import VaultFiles from "./VaultFiles";
import VaultCredentials from "./VaultCredentials";
import VaultFolders from "./VaultFolders";
import VaultSettingsPanel from "./VaultSettingsPanel";

type ContentTab = "dashboard" | "links" | "notes" | "files" | "credentials";
type Tab = ContentTab | "settings";

const CONTENT_TABS: { id: ContentTab; label: string; icon: typeof Link2 }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "links", label: "Links", icon: Link2 },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "files", label: "Files", icon: FileIcon },
    { id: "credentials", label: "Credentials", icon: KeyRound },
];

const FOLDER_TABS: ContentTab[] = ["links", "notes", "files", "credentials"];

/**
 * The unified Personal Vault surface used across the admin panel.
 *
 * The vault contents (dashboard, links, notes, files, credentials) always require
 * an unlocked vault session — that's the vault password gate, independent of admin
 * login. Settings (enable/disable, password management, access logs) is admin-only
 * and reachable without unlocking, so the vault can still be managed or reset.
 *
 * - `admin`  → tabs (incl. Settings) always visible; only the content is gated.
 * - `public` → the whole surface is gated: non-admins see only the access screen
 *   until they unlock, then the vault contents (no Settings).
 */
export default function VaultWorkspace({ admin = false }: Readonly<{ admin?: boolean }>) {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState<Tab>("dashboard");
    const [folder, setFolder] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const searching = query.trim().length > 0;

    const { data: status } = useQuery<VaultStatus>({
        queryKey: ["vault-status"],
        queryFn: vault.status,
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
    });
    const unlocked = !!status?.unlocked;

    const handleLock = async () => {
        try {
            await vault.lock();
            toast.success("Vault locked");
            queryClient.invalidateQueries({ queryKey: ["vault-status"] });
        } catch {
            toast.error("Failed to lock vault");
        }
    };

    const tabs: { id: Tab; label: string; icon: typeof Link2 }[] = admin
        ? [...CONTENT_TABS, { id: "settings", label: "Settings", icon: SettingsIcon }]
        : CONTENT_TABS;

    const tabBar = (
        <div className="flex flex-wrap items-center gap-3">
            <div className="pretty-scroll inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[#EEEAE2] bg-white p-1">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${active ? "bg-[#26262B] text-white" : "text-[#57544e] hover:text-[#26262B]"}`}
                        >
                            <Icon className="h-4 w-4" />
                            {t.label}
                        </button>
                    );
                })}
            </div>
            {unlocked && (
                <button
                    onClick={handleLock}
                    className="ml-auto inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-[#EEEAE2] bg-white px-4 text-[13px] font-medium text-[#26262B] transition-colors hover:bg-[#F6F4EF]"
                >
                    <Lock className="h-4 w-4" />
                    Lock
                </button>
            )}
        </div>
    );

    const searchBar = (
        <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bdb9b0]" />
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search links, notes, files, credentials…"
                className="h-11 w-full rounded-full border border-[#EEEAE2] bg-white pl-11 pr-11 text-[13px] text-[#26262B] outline-none transition-colors placeholder:text-[#bdb9b0] focus:border-[#26262B]"
            />
            {query && (
                <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a978f] hover:text-[#26262B]"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );

    const body = searching ? (
        <div className="space-y-8">
            <VaultLinks query={query} />
            <VaultNotes query={query} />
            <VaultFiles query={query} />
            <VaultCredentials query={query} />
        </div>
    ) : tab === "dashboard" ? (
        <VaultDashboard onNavigate={(s) => setTab(s as Tab)} />
    ) : FOLDER_TABS.includes(tab as ContentTab) ? (
        <div className="flex flex-col gap-5 md:flex-row">
            <VaultFolders selected={folder} onSelect={setFolder} />
            <div className="min-w-0 flex-1">
                {tab === "links" && <VaultLinks folderId={folder} />}
                {tab === "notes" && <VaultNotes folderId={folder} />}
                {tab === "files" && <VaultFiles folderId={folder} />}
                {tab === "credentials" && <VaultCredentials folderId={folder} />}
            </div>
        </div>
    ) : null;

    const gatedInner = (
        <div className="space-y-5">
            {searchBar}
            {body}
        </div>
    );

    // Non-admin (public): the whole surface is gated. Only the access screen shows
    // until unlocked; then the tab bar + contents appear (never Settings).
    if (!admin) {
        return (
            <div className="mx-auto w-full max-w-5xl">
                <VaultGate>
                    {() => (
                        <div className="space-y-5">
                            {tabBar}
                            {gatedInner}
                        </div>
                    )}
                </VaultGate>
            </div>
        );
    }

    // Admin: tabs always visible; Settings ungated, contents gated.
    return (
        <div className="mx-auto w-full max-w-5xl space-y-5">
            {tabBar}
            {tab === "settings" ? <VaultSettingsPanel /> : <VaultGate>{() => gatedInner}</VaultGate>}
        </div>
    );
}
