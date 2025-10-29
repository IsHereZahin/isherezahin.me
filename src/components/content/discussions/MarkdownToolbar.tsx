"use client"

import {
    AtSign,
    Bold,
    Code,
    Code2,
    Heading,
    Italic,
    Link2,
    List,
    Quote,
} from "lucide-react"

interface MarkdownToolbarProps {
    onInsert: (before: string, after: string, placeholder?: string) => void
    disabled?: boolean
}

export default function MarkdownToolbar({ onInsert, disabled = false }: Readonly<MarkdownToolbarProps>) {
    const tools = [
        { title: "Bold", icon: <Bold className="w-3 h-3 sm:w-4 sm:h-4" />, before: "**", after: "**", placeholder: "bold text" },
        { title: "Italic", icon: <Italic className="w-3 h-3 sm:w-4 sm:h-4" />, before: "*", after: "*", placeholder: "italic text" },
        { title: "Heading", icon: <Heading className="w-3 h-3 sm:w-4 sm:h-4" />, before: "# ", after: "", placeholder: "Heading" },
        { title: "Quote", icon: <Quote className="w-3 h-3 sm:w-4 sm:h-4" />, before: "> ", after: "", placeholder: "Quote" },
        { title: "Inline Code", icon: <Code className="w-3 h-3 sm:w-4 sm:h-4" />, before: "`", after: "`", placeholder: "code" },
        { title: "Code Block", icon: <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />, before: "```\n", after: "\n```", placeholder: "code block" },
        { title: "Link", icon: <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />, before: "[", after: "](url)", placeholder: "link text" },
        { title: "List", icon: <List className="w-3 h-3 sm:w-4 sm:h-4" />, before: "- ", after: "", placeholder: "list item" },
        { title: "Mention", icon: <AtSign className="w-3 h-3 sm:w-4 sm:h-4" />, before: "@", after: "", placeholder: "username" },
    ]

    return (
        <div className="flex items-center gap-1 flex-wrap">
            {tools.map((tool) => (
                <button
                    key={tool.title}
                    type="button"
                    onClick={() => !disabled && onInsert(tool.before, tool.after, tool.placeholder)}
                    disabled={disabled}
                    className={`p-1 sm:p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1
                        ${disabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    title={tool.title}
                    aria-label={`Insert ${tool.title.toLowerCase()}`}
                >
                    {tool.icon}
                </button>
            ))}
        </div>
    )
}