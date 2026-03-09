"use client";

import { FormModal } from "@/components/ui";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { INPUT_CLASS } from "./types";

interface ModuleModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
    initialTitle: string;
    isNew: boolean;
}

export default function ModuleModal({ open, onClose, onSave, initialTitle, isNew }: Readonly<ModuleModalProps>) {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => { setTitle(initialTitle); }, [initialTitle]);

    return (
        <FormModal
            open={open}
            onOpenChange={(v) => { if (!v) onClose(); }}
            title={isNew ? "Add Module" : "Edit Module"}
            description={isNew ? "Create a new module for this course" : "Update module details"}
            icon={BookOpen}
            maxWidth="sm:max-w-[500px]"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Module Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="e.g. Introduction to the Course"
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { if (title.trim()) onSave(title.trim()); }}
                        disabled={!title.trim()}
                        className="px-5 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isNew ? "Add Module" : "Save"}
                    </button>
                </div>
            </div>
        </FormModal>
    );
}
