"use client"

import { markdownTools, parseMarkdown, type MarkdownTool } from "@/lib/markdown"
import ToolDropdown from "./ToolDropdown"
import { useCallback, useEffect, useRef, useState } from "react"

interface MarkdownTextareaProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    rows?: number
    showPreview?: boolean
    className?: string
    id?: string
}

export default function MarkdownTextarea({
    value,
    onChange,
    placeholder = "Write something...",
    disabled = false,
    rows = 4,
    showPreview: initialShowPreview = false,
    className = "",
    id,
}: Readonly<MarkdownTextareaProps>) {
    const [showPreview, setShowPreview] = useState(initialShowPreview)
    const [useDropdown, setUseDropdown] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const toolbarRef = useRef<HTMLDivElement>(null)

    // Check if toolbar needs dropdown mode
    useEffect(() => {
        const checkWidth = () => {
            if (toolbarRef.current) {
                // If container width is less than ~320px, use dropdown
                setUseDropdown(toolbarRef.current.offsetWidth < 320)
            }
        }

        checkWidth()
        window.addEventListener('resize', checkWidth)
        return () => window.removeEventListener('resize', checkWidth)
    }, [])

    const insertMarkdown = useCallback((before: string, after: string, placeholder: string) => {
        const input = textareaRef.current
        if (!input) return

        const start = input.selectionStart
        const end = input.selectionEnd
        const selected = value.substring(start, end) || placeholder

        const newText = value.slice(0, start) + before + selected + after + value.slice(end)
        onChange(newText)

        setTimeout(() => {
            input.focus()
            const newCursorPos = start + before.length + selected.length
            input.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
    }, [value, onChange])

    // Auto-resize textarea based on content
    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.style.height = "auto"
        textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`
    }, [])

    useEffect(() => {
        adjustTextareaHeight()
    }, [value, adjustTextareaHeight])

    const isToolDisabled = disabled || showPreview

    const renderToolButton = (tool: MarkdownTool) => (
        <button
            key={tool.key}
            type="button"
            onClick={() => !isToolDisabled && insertMarkdown(tool.before, tool.after, tool.placeholder)}
            disabled={isToolDisabled}
            className={`flex items-center gap-2 p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20
                ${isToolDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            title={tool.title}
            aria-label={`Insert ${tool.title.toLowerCase()}`}
        >
            {tool.icon}
        </button>
    )

    return (
        <div className={`rounded-lg border bg-background ${className}`}>
            {/* Toolbar */}
            <div ref={toolbarRef} className="flex items-center justify-between gap-2 px-2 py-1.5 border-b bg-muted/30">
                {useDropdown ? (
                    /* Dropdown mode for small screens */
                    <ToolDropdown
                        onInsert={insertMarkdown}
                        disabled={isToolDisabled}
                    />
                ) : (
                    /* Inline toolbar for larger screens */
                    <div className="flex items-center gap-0.5 flex-wrap">
                        {markdownTools.map(tool => renderToolButton(tool))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setShowPreview(p => !p)}
                    disabled={disabled}
                    className={`px-2 py-1 text-xs rounded transition-colors shrink-0 ${showPreview
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        } disabled:opacity-50`}
                >
                    {showPreview ? "Edit" : "Preview"}
                </button>
            </div>

            {/* Content area */}
            {showPreview ? (
                <div className="p-3 min-h-[100px] text-sm prose prose-sm max-w-none">
                    {value ? (
                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }} />
                    ) : (
                        <p className="italic text-muted-foreground">Nothing to preview</p>
                    )}
                </div>
            ) : (
                <textarea
                    ref={textareaRef}
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm resize-none bg-transparent focus:outline-none disabled:opacity-50 placeholder:text-muted-foreground modal-scrollbar"
                />
            )}
        </div>
    )
}
