"use client"

import {
    AtSign,
    Bold,
    ChevronDown,
    Code,
    Code2,
    Heading,
    Italic,
    Link2,
    List,
    Quote,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface Tool {
    key: string
    title: string
    icon: React.ReactNode
    before: string
    after: string
    placeholder: string
}

const allTools: Tool[] = [
    { key: 'bold', title: "Bold", icon: <Bold className="w-3.5 h-3.5" />, before: "**", after: "**", placeholder: "bold text" },
    { key: 'italic', title: "Italic", icon: <Italic className="w-3.5 h-3.5" />, before: "*", after: "*", placeholder: "italic text" },
    { key: 'heading', title: "Heading", icon: <Heading className="w-3.5 h-3.5" />, before: "# ", after: "", placeholder: "Heading" },
    { key: 'quote', title: "Quote", icon: <Quote className="w-3.5 h-3.5" />, before: "> ", after: "", placeholder: "Quote" },
    { key: 'inlineCode', title: "Inline Code", icon: <Code className="w-3.5 h-3.5" />, before: "`", after: "`", placeholder: "code" },
    { key: 'codeBlock', title: "Code Block", icon: <Code2 className="w-3.5 h-3.5" />, before: "```\n", after: "\n```", placeholder: "code block" },
    { key: 'link', title: "Link", icon: <Link2 className="w-3.5 h-3.5" />, before: "(", after: ")[url]", placeholder: "display text" },
    { key: 'list', title: "List", icon: <List className="w-3.5 h-3.5" />, before: "- ", after: "", placeholder: "list item" },
    { key: 'mention', title: "Mention", icon: <AtSign className="w-3.5 h-3.5" />, before: "@", after: "", placeholder: "username" },
]

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

function parseMarkdown(text: string): string {
    let html = text

    // Escape HTML
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    // Headers
    html = html.replace(/^### (.*?)$/gm, "<h3 class='text-lg font-semibold mt-4 mb-2 text-foreground'>$1</h3>")
    html = html.replace(/^## (.*?)$/gm, "<h2 class='text-xl font-semibold mt-4 mb-2 text-foreground'>$1</h2>")
    html = html.replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-semibold mt-4 mb-2 text-foreground'>$1</h1>")

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-foreground'>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em class='italic text-foreground'>$1</em>")

    // Code blocks
    html = html.replace(
        /```([\s\S]*?)```/g,
        "<pre class='bg-muted p-3 rounded-lg text-sm overflow-x-auto text-secondary-foreground my-2'><code>$1</code></pre>"
    )

    // Inline code
    html = html.replace(
        /`([^`]+)`/g,
        "<code class='bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-secondary-foreground'>$1</code>"
    )

    // Custom link format: (display text)[url]
    html = html.replace(
        /\(([^)]+)\)\[([^\]]+)\]/g,
        "<a href='$2' class='text-primary hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>"
    )

    // Standard markdown links: [display text](url)
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        "<a href='$2' class='text-primary hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>"
    )

    // Blockquotes
    html = html.replace(
        /^&gt; (.*?)$/gm,
        "<blockquote class='border-l-2 border-primary pl-3 italic text-muted-foreground my-2'>$1</blockquote>"
    )

    // Lists
    html = html.replace(/^- (.*?)$/gm, "<li class='ml-4 text-secondary-foreground'>$1</li>")
    html = html.replace(/(<li[\s\S]*?<\/li>)/g, "<ul class='list-disc my-1'>$1</ul>")

    // Mentions
    html = html.replace(/@(\w+)/g, "<span class='text-primary font-semibold'>@$1</span>")

    // Line breaks
    html = html.replace(/\n/g, "<br />")

    return html
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

    const renderToolButton = (tool: Tool, showLabel = false) => (
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
                                {allTools.map(tool => renderToolButton(tool, true))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Inline toolbar for larger screens */
                    <div className="flex items-center gap-0.5 flex-wrap">
                        {allTools.map(tool => renderToolButton(tool))}
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
