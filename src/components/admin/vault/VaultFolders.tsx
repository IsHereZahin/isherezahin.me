"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Folder, FolderOpen, Plus, Trash2, Inbox, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultFolder } from "@/lib/vault/types";
import { ConfirmDialog, Input } from "@/components/ui";
import { glassCard } from "./glass";

interface VaultFoldersProps {
    selected: string | null; // null = all, "root" = unfiled, otherwise folder id
    onSelect: (value: string | null) => void;
}

export default function VaultFolders({ selected, onSelect }: Readonly<VaultFoldersProps>) {
    const queryClient = useQueryClient();
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [toDelete, setToDelete] = useState<VaultFolder | null>(null);

    const { data: folders } = useQuery<VaultFolder[]>({
        queryKey: ["vault-folders"],
        queryFn: vault.folders.getAll,
    });

    const createFolder = async () => {
        if (!name.trim()) return;
        await vault.folders.create({ name: name.trim() });
        toast.success("Folder created");
        setName("");
        setAdding(false);
        queryClient.invalidateQueries({ queryKey: ["vault-folders"] });
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        await vault.folders.delete(toDelete._id);
        toast.success("Folder deleted (items kept)");
        queryClient.invalidateQueries({ queryKey: ["vault-folders"] });
        if (selected === toDelete._id) onSelect(null);
        setToDelete(null);
    };

    const itemClass = (active: boolean) =>
        `flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[13px] transition-colors ${active ? "bg-[#26262B] text-white hover:bg-[#26262B]" : "text-[#57544e] hover:bg-[#F6F4EF]"}`;

    return (
        <div className={`w-full md:w-56 shrink-0 h-fit p-3 space-y-1 ${glassCard}`}>
            <button onClick={() => onSelect(null)} className={itemClass(selected === null)}>
                <LayoutGrid className="h-4 w-4" /> All Items
            </button>
            <button onClick={() => onSelect("root")} className={itemClass(selected === "root")}>
                <Inbox className="h-4 w-4" /> Unfiled
            </button>

            <div className="pt-2 mt-2 border-t border-[#EEEAE2]">
                <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-xs font-medium text-[#9a978f] uppercase tracking-wide">Folders</span>
                    <button onClick={() => setAdding((a) => !a)} className="p-1 rounded hover:bg-[#F6F4EF] text-[#9a978f]">
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                </div>

                {adding && (
                    <div className="flex gap-1 mb-2">
                        <Input
                            value={name}
                            placeholder="Folder name"
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") createFolder(); }}
                            className="h-8 text-sm"
                            autoFocus
                        />
                    </div>
                )}

                <div className="space-y-1">
                    {folders?.map((folder) => {
                        const active = selected === folder._id;
                        return (
                            <div key={folder._id} className="group flex items-center">
                                <button onClick={() => onSelect(folder._id)} className={`${itemClass(active)} flex-1`}>
                                    {active ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                                    <span className="truncate">{folder.name}</span>
                                </button>
                                <button onClick={() => setToDelete(folder)} className="opacity-0 group-hover:opacity-100 p-1 text-[#9a978f] hover:text-[#EE5D4A] transition-opacity">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(open) => !open && setToDelete(null)}
                title="Delete Folder?"
                description={`"${toDelete?.name}" will be deleted. Items inside it are kept and moved to Unfiled.`}
                confirmText="Delete Folder"
                variant="danger"
                onConfirm={handleDelete}
            />
        </div>
    );
}
