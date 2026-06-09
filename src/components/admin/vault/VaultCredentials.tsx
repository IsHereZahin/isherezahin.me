"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2, KeyRound, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultCredential } from "@/lib/vault/types";
import { AdminAddButton, Badge, ConfirmDialog } from "@/components/ui";
import { glassItem } from "./glass";
import CredentialModal from "./CredentialModal";

export default function VaultCredentials({ folderId, query }: Readonly<{ folderId?: string | null; query?: string }>) {
    const queryClient = useQueryClient();
    const [modal, setModal] = useState<{ open: boolean; credential?: VaultCredential | null }>({ open: false });
    const [toDelete, setToDelete] = useState<VaultCredential | null>(null);
    const [revealed, setRevealed] = useState<Record<string, string>>({});

    const searching = !!query?.trim();
    const lowerQ = (query ?? "").trim().toLowerCase();

    const { data: raw, isLoading } = useQuery<VaultCredential[]>({
        queryKey: ["vault-credentials", searching ? "search" : folderId ?? null],
        queryFn: () => vault.credentials.getAll(searching ? {} : { folderId }),
    });

    const creds = searching
        ? (raw ?? []).filter((c) => `${c.title} ${c.username} ${c.urlHint} ${c.tags.join(" ")}`.toLowerCase().includes(lowerQ))
        : raw;

    const toggleReveal = async (cred: VaultCredential) => {
        if (revealed[cred._id]) {
            setRevealed((r) => {
                const next = { ...r };
                delete next[cred._id];
                return next;
            });
            return;
        }
        try {
            const full = await vault.credentials.get(cred._id);
            setRevealed((r) => ({ ...r, [cred._id]: full.password || "(empty)" }));
        } catch {
            toast.error("Failed to reveal secret");
        }
    };

    const copySecret = async (cred: VaultCredential) => {
        try {
            const full = await vault.credentials.get(cred._id);
            await navigator.clipboard.writeText(full.password || "");
            toast.success("Secret copied to clipboard");
        } catch {
            toast.error("Failed to copy");
        }
    };

    const openEdit = async (cred: VaultCredential) => {
        try {
            const full = await vault.credentials.get(cred._id);
            setModal({ open: true, credential: full });
        } catch {
            toast.error("Failed to load credential");
        }
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        await vault.credentials.delete(toDelete._id);
        toast.success("Credential deleted");
        queryClient.invalidateQueries({ queryKey: ["vault-credentials"] });
        queryClient.invalidateQueries({ queryKey: ["vault-dashboard"] });
        setToDelete(null);
    };

    if (searching && !isLoading && !creds?.length) return null;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 icon-bw" />
                    <h3 className="text-base font-semibold">Credentials</h3>
                </div>
                {!searching && <AdminAddButton label="New Credential" onClick={() => setModal({ open: true, credential: null })} />}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : !creds?.length ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No credentials yet. All secrets are encrypted at rest.</p>
            ) : (
                <div className="space-y-2">
                    {creds.map((cred) => (
                        <div key={cred._id} className={`${glassItem} p-4 flex items-start justify-between gap-3`}>
                            <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{cred.title}</p>
                                {cred.username && <p className="text-xs text-muted-foreground">{cred.username}</p>}
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                                        {revealed[cred._id] ?? "••••••••"}
                                    </code>
                                    <button onClick={() => toggleReveal(cred)} className="text-muted-foreground hover:text-foreground" title="Reveal">
                                        {revealed[cred._id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                    </button>
                                    <button onClick={() => copySecret(cred)} className="text-muted-foreground hover:text-foreground" title="Copy">
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                {cred.urlHint && <p className="text-xs text-muted-foreground mt-1">{cred.urlHint}</p>}
                                {cred.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {cred.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => openEdit(cred)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Edit">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => setToDelete(cred)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CredentialModal open={modal.open} onOpenChange={(open) => setModal({ open, credential: modal.credential })} credential={modal.credential} folderId={folderId} />
            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(open) => !open && setToDelete(null)}
                title="Delete Credential?"
                description={`"${toDelete?.title}" will be permanently removed.`}
                confirmText="Delete"
                variant="danger"
                onConfirm={handleDelete}
            />
        </section>
    );
}
