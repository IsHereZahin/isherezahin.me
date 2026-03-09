"use client";

import MarkdownPreview from "@/components/content/discussions/MarkdownPreview";
import MarkdownToolbar from "@/components/content/discussions/MarkdownToolbar";
import { Eye, Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface LessonDescriptionProps {
    value: string;
    onChange: (val: string) => void;
    inputClass: string;
    placeholder?: string;
    rows?: number;
}

export default function LessonDescription({
    value,
    onChange,
    inputClass,
    placeholder = "Description note (optional) — Markdown supported",
    rows = 2,
}: Readonly<LessonDescriptionProps>) {
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, []);

    useEffect(() => {
        autoResize();
    }, [value, autoResize]);

    const insertMarkdown = useCallback((before: string, after: string, placeholder = "") => {
        const input = textareaRef.current;
        if (!input) return;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selected = value.substring(start, end) || placeholder;
        const newContent = value.slice(0, start) + before + selected + after + value.slice(end);
        onChange(newContent);
        setTimeout(() => {
            input.focus();
            const pos = start + before.length + selected.length;
            input.setSelectionRange(pos, pos);
        }, 0);
    }, [value, onChange]);

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-muted/30 border-b border-border px-2 py-1">
                <div className="flex-1">
                    {!showPreview && <MarkdownToolbar onInsert={insertMarkdown} />}
                </div>
                <button
                    type="button"
                    onClick={() => setShowPreview((p) => !p)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title={showPreview ? "Edit" : "Preview"}
                >
                    {showPreview ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
            </div>
            {showPreview ? (
                <div className="p-3 min-h-16 text-xs">
                    {value ? (
                        <MarkdownPreview content={value} />
                    ) : (
                        <p className="italic text-xs text-muted-foreground">No content</p>
                    )}
                </div>
            ) : (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        autoResize();
                    }}
                    className={`${inputClass} text-xs min-h-16 resize-none border-0 rounded-none focus:ring-0 overflow-hidden`}
                    placeholder={placeholder}
                    rows={rows}
                />
            )}
        </div>
    );
}
