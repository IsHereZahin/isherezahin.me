"use client";

import { markdownTools, parseMarkdown, type MarkdownTool } from "@/lib/markdown";
import { Bold, ChevronDown, Loader2, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    onTyping?: (isTyping: boolean) => void;
    disabled?: boolean;
    placeholder?: string;
    editingMessage?: { id: string; content: string } | null;
    onCancelEdit?: () => void;
    onSaveEdit?: (messageId: string, content: string) => Promise<void>;
}

export default function ChatInput({
    onSend,
    onTyping,
    disabled,
    placeholder = "Type a message...",
    editingMessage,
    onCancelEdit,
    onSaveEdit,
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [useDropdown, setUseDropdown] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update message when editing starts
    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.content);
            setShowPreview(false);
            textareaRef.current?.focus();
        }
    }, [editingMessage]);

    // Check if toolbar needs dropdown mode
    useEffect(() => {
        const checkWidth = () => {
            if (toolbarRef.current) {
                setUseDropdown(toolbarRef.current.offsetWidth < 400);
            }
        };

        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [dropdownOpen]);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea && !showPreview) {
            textarea.style.height = "auto";
            const newHeight = Math.min(textarea.scrollHeight, 150);
            textarea.style.height = `${Math.max(40, newHeight)}px`;
        }
    }, [message, showPreview]);

    const setTyping = useCallback(
        (typing: boolean) => {
            if (isTypingRef.current !== typing) {
                isTypingRef.current = typing;
                onTyping?.(typing);
            }
        },
        [onTyping]
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        if (onTyping && !editingMessage) {
            setTyping(true);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
            }, 2000);
        }
    };

    const insertMarkdown = useCallback(
        (before: string, after: string, placeholder: string) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selected = message.substring(start, end) || placeholder;

            const newText = message.slice(0, start) + before + selected + after + message.slice(end);
            setMessage(newText);

            setTimeout(() => {
                textarea.focus();
                const newCursorPos = start + before.length + selected.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);

            setDropdownOpen(false);
        },
        [message]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || sending || disabled) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setTyping(false);

        setSending(true);
        try {
            if (editingMessage && onSaveEdit) {
                await onSaveEdit(editingMessage.id, message.trim());
                onCancelEdit?.();
            } else {
                await onSend(message.trim());
            }
            setMessage("");
            setShowPreview(false);
            // Auto-focus input for next message
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 0);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
        if (e.key === "Escape" && editingMessage) {
            handleCancelEdit();
        }
    };

    const handleCancelEdit = () => {
        setMessage("");
        setShowPreview(false);
        onCancelEdit?.();
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            setTyping(false);
        };
    }, [setTyping]);

    const isDisabled = disabled || sending;
    const isToolDisabled = isDisabled || showPreview;

    const renderToolButton = (tool: MarkdownTool, showLabel = false) => (
        <button
            key={tool.key}
            type="button"
            onClick={() => !isToolDisabled && insertMarkdown(tool.before, tool.after, tool.placeholder)}
            disabled={isToolDisabled}
            className={`flex items-center gap-2 p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20
                ${showLabel ? "w-full px-3 py-2 hover:bg-muted" : ""}
                ${isToolDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            title={tool.title}
            aria-label={`Insert ${tool.title.toLowerCase()}`}
        >
            {tool.icon}
            {showLabel && <span className="text-sm">{tool.title}</span>}
        </button>
    );

    return (
        <div className="border-t border-border bg-card">
            {editingMessage && (
                <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20">
                    <span className="text-sm text-primary font-medium">Editing message</span>
                    <button
                        onClick={handleCancelEdit}
                        className="p-1 rounded hover:bg-primary/20 transition-colors"
                    >
                        <X className="h-4 w-4 text-primary" />
                    </button>
                </div>
            )}

            {/* Toolbar with Preview toggle */}
            <div
                ref={toolbarRef}
                className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-border/50 bg-muted/30"
            >
                {useDropdown ? (
                    /* Dropdown mode for small screens */
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => !isToolDisabled && setDropdownOpen((p) => !p)}
                            disabled={isToolDisabled}
                            className={`flex items-center gap-1.5 px-2 py-1 text-sm rounded transition-colors
                                ${isToolDisabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Bold className="w-3.5 h-3.5" />
                            <span>Format</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute left-0 bottom-full mb-1 z-50 min-w-[160px] max-h-[200px] overflow-y-auto rounded-lg border bg-background shadow-lg py-1 chat-scrollbar">
                                {markdownTools.map((tool) => renderToolButton(tool, true))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Inline toolbar for larger screens */
                    <div className="flex items-center gap-0.5 flex-wrap">
                        {markdownTools.map((tool) => renderToolButton(tool))}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap hidden sm:inline">
                        Shift+Enter for new line
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowPreview((p) => !p)}
                        disabled={isDisabled}
                        className={`px-2 py-1 text-xs rounded transition-colors shrink-0 ${showPreview
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            } disabled:opacity-50`}
                    >
                        {showPreview ? "Edit" : "Preview"}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-3 p-3">
                <div className="flex-1 relative">
                    {showPreview ? (
                        <div className="min-h-[40px] max-h-[150px] overflow-y-auto px-3 py-2 rounded-lg border border-border bg-background text-sm chat-scrollbar">
                            {message ? (
                                <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(message) }}
                                />
                            ) : (
                                <p className="italic text-muted-foreground">Nothing to preview</p>
                            )}
                        </div>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={editingMessage ? "Edit your message..." : placeholder}
                            disabled={isDisabled}
                            rows={1}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 min-h-[40px] max-h-[150px] leading-relaxed chat-scrollbar"
                            style={{ height: "40px" }}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    disabled={!message.trim() || sending || disabled}
                    className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                    {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </form>
        </div>
    );
}
