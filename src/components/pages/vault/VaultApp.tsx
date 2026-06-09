"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Link2, FileText, FileIcon, KeyRound, Search, Lock, X, LockKeyhole as VaultIcon } from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import VaultGate from "@/components/admin/vault/VaultGate";
import VaultDashboard from "@/components/admin/vault/VaultDashboard";
import VaultLinks from "@/components/admin/vault/VaultLinks";
import VaultNotes from "@/components/admin/vault/VaultNotes";
import VaultFiles from "@/components/admin/vault/VaultFiles";
import VaultCredentials from "@/components/admin/vault/VaultCredentials";
import VaultFolders from "@/components/admin/vault/VaultFolders";
import { ShadcnButton as Button, Input } from "@/components/ui";

type Tab = "dashboard" | "links" | "notes" | "files" | "credentials";

const TABS: { id: Tab; label: string; icon: typeof Link2 }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "links", label: "Links", icon: Link2 },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "files", label: "Files", icon: FileIcon },
    { id: "credentials", label: "Credentials", icon: KeyRound },
];

const FOLDER_TABS: Tab[] = ["links", "notes", "files", "credentials"];

export default function VaultApp() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState<Tab>("dashboard");
    const [folder, setFolder] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const searching = query.trim().length > 0;

    const handleLock = async () => {
        try {
            await vault.lock();
            toast.success("Vault locked");
            queryClient.invalidateQueries({ queryKey: ["vault-status"] });
        } catch {
            toast.error("Failed to lock vault");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <VaultGate>
                {() => (
                    <section className="space-y-5">
                        {/* Header: title + Lock */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-xl bg-muted border border-border flex items-center justify-center">
                                    <VaultIcon className="h-5 w-5 icon-bw" />
                                </div>
                                <h3 className="text-base font-semibold">Personal Vault</h3>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleLock} className=" bg-muted">
                                <Lock className="h-4 w-4 mr-1.5" /> Lock
                            </Button>
                        </div>

                        {/* Tabs + global search bar on one row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-muted border border-border w-fit shrink-0">
                                {TABS.map((t) => {
                                    const Icon = t.icon;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setTab(t.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${tab === t.id ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search links, notes, files, credentials..."
                                    className="pl-9 pr-9 h-10 bg-muted"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {searching ? (
                            <div className="space-y-6">
                                <VaultLinks query={query} />
                                <VaultNotes query={query} />
                                <VaultFiles query={query} />
                                <VaultCredentials query={query} />
                            </div>
                        ) : (
                            <>
                                {tab === "dashboard" && <VaultDashboard onNavigate={(s) => setTab(s as Tab)} />}

                                {FOLDER_TABS.includes(tab) && (
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <VaultFolders selected={folder} onSelect={setFolder} />
                                        <div className="flex-1 min-w-0">
                                            {tab === "links" && <VaultLinks folderId={folder} />}
                                            {tab === "notes" && <VaultNotes folderId={folder} />}
                                            {tab === "files" && <VaultFiles folderId={folder} />}
                                            {tab === "credentials" && <VaultCredentials folderId={folder} />}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )}
            </VaultGate>
        </div>
    );
}
