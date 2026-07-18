"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    FormActions,
    FormModal,
    Input,
    Textarea,
    Switch,
} from "@/components/ui";
import { vault } from "@/lib/api";
import type { ChecklistItem, VaultNote, VaultNoteType } from "@/lib/vault/types";

interface NoteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note?: VaultNote | null;
    folderId?: string | null;
}

const TYPE_OPTIONS: { value: VaultNoteType; label: string }[] = [
    { value: "rich", label: "Rich Text" },
    { value: "code", label: "Code Snippet" },
    { value: "checklist", label: "Checklist" },
];

export default function NoteModal({ open, onOpenChange, note, folderId }: Readonly<NoteModalProps>) {
    const queryClient = useQueryClient();
    const isEdit = !!note;

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [type, setType] = useState<VaultNoteType>("rich");
    const [language, setLanguage] = useState("");
    const [content, setContent] = useState("");
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setCategory(note.category);
            setTags(note.tags.join(", "));
            setType(note.type);
            setLanguage(note.language);
            setContent(note.content);
            setChecklist(note.checklistItems?.length ? note.checklistItems : []);
            setIsEncrypted(note.isEncrypted);
        } else {
            setTitle("");
            setCategory("");
            setTags("");
            setType("rich");
            setLanguage("");
            setContent("");
            setChecklist([]);
            setIsEncrypted(false);
        }
    }, [note, open]);

    const updateChecklistItem = (i: number, patch: Partial<ChecklistItem>) =>
        setChecklist((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                title,
                category,
                type,
                language: type === "code" ? language : "",
                content: type === "checklist" ? "" : content,
                checklistItems: type === "checklist" ? checklist.filter((c) => c.text.trim()) : [],
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                isEncrypted,
                folderId: note?.folderId ?? folderId ?? null,
            };
            if (isEdit) {
                await vault.notes.update(note._id, payload);
                toast.success("Note updated");
            } else {
                await vault.notes.create(payload);
                toast.success("Note saved");
            }
            queryClient.invalidateQueries({ queryKey: ["vault-notes"] });
            queryClient.invalidateQueries({ queryKey: ["vault-all"] });
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save note");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit Note" : "New Note"}
            description={isEdit ? "Update your note." : "Save a rich note, code snippet, or checklist."}
            icon={FileText}
            maxWidth="sm:max-w-[750px]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-[13px] font-medium text-[#57544e]">Title</label>
                    <Input className="mt-1" placeholder="Note title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[13px] font-medium text-[#57544e]">Category</label>
                        <Input className="mt-1" placeholder="e.g. Snippets" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[13px] font-medium text-[#57544e]">Type</label>
                        <div className="mt-1 flex gap-1.5">
                            {TYPE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setType(opt.value)}
                                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${type === opt.value ? "bg-[#26262B] text-white" : "bg-[#F6F4EF] text-[#9a978f] hover:text-[#26262B]"}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {type === "rich" && (
                    <div>
                        <label className="text-[13px] font-medium text-[#57544e]">Content</label>
                        <Textarea
                            className="mt-1 min-h-[200px]"
                            placeholder="Write your note... (Markdown supported)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                )}

                {type === "code" && (
                    <div className="space-y-2">
                        <div>
                            <label className="text-[13px] font-medium text-[#57544e]">Language</label>
                            <Input className="mt-1" placeholder="e.g. typescript" value={language} onChange={(e) => setLanguage(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[13px] font-medium text-[#57544e]">Code</label>
                            <Textarea className="mt-1 font-mono text-sm min-h-[200px]" placeholder="Paste your code..." value={content} onChange={(e) => setContent(e.target.value)} />
                        </div>
                    </div>
                )}

                {type === "checklist" && (
                    <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#57544e]">Checklist</label>
                        {checklist.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={item.done}
                                    onChange={(e) => updateChecklistItem(i, { done: e.target.checked })}
                                    className="h-4 w-4 accent-[#26262B]"
                                />
                                <Input
                                    value={item.text}
                                    placeholder="Checklist item"
                                    onChange={(e) => updateChecklistItem(i, { text: e.target.value })}
                                />
                                <button type="button" onClick={() => setChecklist((prev) => prev.filter((_, idx) => idx !== i))} className="text-[#9a978f] hover:text-[#EE5D4A]">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => setChecklist((prev) => [...prev, { text: "", done: false }])} className="flex items-center gap-1 text-sm text-[#9a978f] hover:text-[#26262B]">
                            <Plus className="h-4 w-4" /> Add item
                        </button>
                    </div>
                )}

                <div>
                    <label className="text-[13px] font-medium text-[#57544e]">Tags</label>
                    <Input className="mt-1" placeholder="Comma-separated tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#EEEAE2] bg-[#F6F4EF] p-3.5">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#9a978f]" />
                        <div>
                            <p className="text-[13px] font-medium text-[#26262B]">Encrypt this note</p>
                            <p className="text-xs text-[#9a978f]">Stored encrypted at rest with your vault key.</p>
                        </div>
                    </div>
                    <Switch checked={isEncrypted} onCheckedChange={setIsEncrypted} />
                </div>

                <FormActions
                    onCancel={() => onOpenChange(false)}
                    submitText={submitting ? "Saving..." : "Save Note"}
                    isSubmitting={submitting}
                />
            </form>
        </FormModal>
    );
}
