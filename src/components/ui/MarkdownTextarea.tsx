"use client"

import { markdownTools, parseMarkdown, type MarkdownTool } from "@/lib/markdown"
import { Bold, ChevronDown } from "lucide-react"
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
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [useDropdown, setUseDropdown] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const toolbarRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownOpen])

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

        setDropdownOpen(false)
    }, [value, onChange])

    const isToolDisabled = disabled || showPreview

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
    )

    return (
        <div className={`rounded-lg border bg-background ${className}`}>
            {/* Toolbar */}
            <div ref={toolbarRef} className="flex items-center justify-between gap-2 px-2 py-1.5 border-b bg-muted/30">
                {useDropdown ? (
                    /* Dropdown mode for small screens */
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => !isToolDisabled && setDropdownOpen(p => !p)}
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
                            <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] max-h-[200px] overflow-y-auto rounded-lg border bg-background shadow-lg py-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
                                {markdownTools.map(tool => renderToolButton(tool, true))}
                            </div>
                        )}
                    </div>
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
                    className="w-full px-3 py-2 text-sm resize-none bg-transparent focus:outline-none disabled:opacity-50 placeholder:text-muted-foreground"
                />
            )}
        </div>
    )
}
