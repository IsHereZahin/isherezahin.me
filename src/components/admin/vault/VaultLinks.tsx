"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, Pencil, Star, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultLink } from "@/lib/vault/types";
import { AdminAddButton, Badge, ConfirmDialog } from "@/components/ui";
import { glassItem } from "./glass";
import LinkModal from "./LinkModal";

export default function VaultLinks({ folderId, query }: Readonly<{ folderId?: string | null; query?: string }>) {
    const queryClient = useQueryClient();
    const [modal, setModal] = useState<{ open: boolean; link?: VaultLink | null }>({ open: false });
    const [toDelete, setToDelete] = useState<VaultLink | null>(null);

    const searching = !!query?.trim();
    const lowerQ = (query ?? "").trim().toLowerCase();

    const { data: raw, isLoading } = useQuery<VaultLink[]>({
        queryKey: ["vault-links", searching ? "search" : folderId ?? null],
        queryFn: () => vault.links.getAll(searching ? {} : { folderId }),
    });

    const links = searching
        ? (raw ?? []).filter((l) => `${l.title} ${l.url} ${l.description} ${l.tags.join(" ")}`.toLowerCase().includes(lowerQ))
        : raw;

    const toggleFavorite = async (link: VaultLink) => {
        await vault.links.update(link._id, { isFavorite: !link.isFavorite });
        queryClient.invalidateQueries({ queryKey: ["vault-links"] });
        queryClient.invalidateQueries({ queryKey: ["vault-dashboard"] });
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        await vault.links.delete(toDelete._id);
        toast.success("Link deleted");
        queryClient.invalidateQueries({ queryKey: ["vault-links"] });
        queryClient.invalidateQueries({ queryKey: ["vault-dashboard"] });
        setToDelete(null);
    };

    if (searching && !isLoading && !links?.length) return null;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 icon-bw" />
                    <h3 className="text-base font-semibold">Links</h3>
                </div>
                {!searching && <AdminAddButton label="Save Link" onClick={() => setModal({ open: true, link: null })} />}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : !links?.length ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No links yet. Save your first one.</p>
            ) : (
                <div className="space-y-2">
                    {links.map((link) => (
                        <div key={link._id} className={`${glassItem} p-4 flex items-start justify-between gap-3`}>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm truncate">{link.title}</p>
                                    {link.isFavorite && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />}
                                </div>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 truncate">
                                    {link.url} <ExternalLink className="h-3 w-3 shrink-0" />
                                </a>
                                {link.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{link.description}</p>}
                                {link.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {link.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => toggleFavorite(link)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Favorite">
                                    <Star className={`h-4 w-4 ${link.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                </button>
                                <button onClick={() => setModal({ open: true, link })} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Edit">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => setToDelete(link)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <LinkModal open={modal.open} onOpenChange={(open) => setModal({ open, link: modal.link })} link={modal.link} folderId={folderId} />
            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(open) => !open && setToDelete(null)}
                title="Delete Link?"
                description={`"${toDelete?.title}" will be permanently removed.`}
                confirmText="Delete"
                variant="danger"
                onConfirm={handleDelete}
            />
        </section>
    );
}
