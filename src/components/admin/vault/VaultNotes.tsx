"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Star, Trash2, FileText, Lock, Code, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultNote } from "@/lib/vault/types";
import { AdminAddButton, Badge, ConfirmDialog } from "@/components/ui";
import { glassItem } from "./glass";
import NoteModal from "./NoteModal";

const typeIcon = { rich: FileText, code: Code, checklist: ListChecks };

export default function VaultNotes({ folderId, query }: Readonly<{ folderId?: string | null; query?: string }>) {
    const queryClient = useQueryClient();
    const [modal, setModal] = useState<{ open: boolean; note?: VaultNote | null }>({ open: false });
    const [toDelete, setToDelete] = useState<VaultNote | null>(null);

    const searching = !!query?.trim();
    const lowerQ = (query ?? "").trim().toLowerCase();

    const { data: raw, isLoading } = useQuery<VaultNote[]>({
        queryKey: ["vault-notes", searching ? "search" : folderId ?? null],
        queryFn: () => vault.notes.getAll(searching ? {} : { folderId }),
    });

    const notes = searching
        ? (raw ?? []).filter((n) => `${n.title} ${n.category} ${n.content} ${n.tags.join(" ")}`.toLowerCase().includes(lowerQ))
        : raw;

    const toggleFavorite = async (note: VaultNote) => {
        await vault.notes.update(note._id, { isFavorite: !note.isFavorite });
        queryClient.invalidateQueries({ queryKey: ["vault-notes"] });
        queryClient.invalidateQueries({ queryKey: ["vault-dashboard"] });
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        await vault.notes.delete(toDelete._id);
        toast.success("Note deleted");
        queryClient.invalidateQueries({ queryKey: ["vault-notes"] });
        queryClient.invalidateQueries({ queryKey: ["vault-dashboard"] });
        setToDelete(null);
    };

    const preview = (note: VaultNote) => {
        if (note.type === "checklist") {
            const done = note.checklistItems.filter((c) => c.done).length;
            return `${done}/${note.checklistItems.length} done`;
        }
        return note.content.slice(0, 120);
    };

    if (searching && !isLoading && !notes?.length) return null;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#26262B]" />
                    <h3 className="text-[16px] font-semibold text-[#26262B]">Notes</h3>
                </div>
                {!searching && <AdminAddButton label="New Note" onClick={() => setModal({ open: true, note: null })} />}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#9a978f]" /></div>
            ) : !notes?.length ? (
                <p className="text-sm text-[#9a978f] py-8 text-center">No notes yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {notes.map((note) => {
                        const Icon = typeIcon[note.type] || FileText;
                        return (
                            <div key={note._id} className={`${glassItem} p-4 flex flex-col`}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Icon className="h-4 w-4 text-[#9a978f] shrink-0" />
                                        <p className="font-medium text-sm truncate text-[#26262B]">{note.title}</p>
                                        {note.isEncrypted && <Lock className="h-3.5 w-3.5 text-[#9a978f] shrink-0" />}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => toggleFavorite(note)} className="p-1.5 rounded-lg text-[#9a978f] transition-colors hover:bg-[#F6F4EF] hover:text-[#26262B]">
                                            <Star className={`h-4 w-4 ${note.isFavorite ? "fill-[#F4C63D] text-[#F4C63D]" : ""}`} />
                                        </button>
                                        <button onClick={() => setModal({ open: true, note })} className="p-1.5 rounded-lg text-[#9a978f] transition-colors hover:bg-[#F6F4EF] hover:text-[#26262B]">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setToDelete(note)} className="p-1.5 rounded-lg text-[#9a978f] transition-colors hover:bg-[#F6F4EF] hover:text-[#EE5D4A]">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-[#9a978f] mt-2 line-clamp-3 whitespace-pre-wrap">{preview(note)}</p>
                                {note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {note.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <NoteModal open={modal.open} onOpenChange={(open) => setModal({ open, note: modal.note })} note={modal.note} folderId={folderId} />
            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(open) => !open && setToDelete(null)}
                title="Delete Note?"
                description={`"${toDelete?.title}" will be permanently removed.`}
                confirmText="Delete"
                variant="danger"
                onConfirm={handleDelete}
            />
        </section>
    );
}
