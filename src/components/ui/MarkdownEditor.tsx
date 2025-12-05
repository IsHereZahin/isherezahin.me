"use client";

import { MarkdownPreview, MarkdownToolbar } from "@/components/content";
import { useCallback, useRef, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";
import { Textarea } from "./textarea";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    minHeight?: string;
    disabled?: boolean;
}

export default function MarkdownEditor({
    value,
    onChange,
    label = "Content",
    placeholder = "Write your content here...",
    minHeight = "min-h-[200px]",
    disabled = false,
}: Readonly<MarkdownEditorProps>) {
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = useCallback((before: string, after: string, placeholderText = "") => {
        const input = textareaRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selected = value.substring(start, end) || placeholderText;

        const newContent = value.slice(0, start) + before + selected + after + value.slice(end);
        onChange(newContent);

        setTimeout(() => {
            input.focus();
            const newCursorPos = start + before.length + selected.length;
            input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [value, onChange]);

    return (
        <FormItem>
            <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">{label}</FormLabel>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Markdown supported</span>
                    <button
                        type="button"
                        onClick={() => setShowPreview((p) => !p)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${showPreview
                            ? "bg-foreground text-background"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                    >
                        {showPreview ? "Edit" : "Preview"}
                    </button>
                </div>
            </div>
            <FormControl>
                <div className="space-y-2">
                    {showPreview ? (
                        <div className={`${minHeight} rounded-lg border p-4 bg-card`}>
                            {value ? (
                                <MarkdownPreview content={value} />
                            ) : (
                                <p className="italic text-sm text-muted-foreground">Nothing to preview</p>
                            )}
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/50 border-b px-3 py-2">
                                <MarkdownToolbar onInsert={insertMarkdown} />
                            </div>
                            <Textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                className={`border-0 rounded-none focus-visible:ring-0 ${minHeight} resize-none`}
                                disabled={disabled}
                            />
                        </div>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
