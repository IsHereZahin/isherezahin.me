"use client"

import { markdownTools, type MarkdownTool } from "@/lib/markdown"
import { Bold, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ToolDropdownProps {
    onInsert: (before: string, after: string, placeholder: string) => void
    disabled?: boolean
    size?: "sm" | "md"
}

export default function ToolDropdown({ onInsert, disabled = false, size = "md" }: Readonly<ToolDropdownProps>) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const handleToolClick = (tool: MarkdownTool) => {
        onInsert(tool.before, tool.after, tool.placeholder)
        setIsOpen(false)
    }

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(prev => !prev)}
                disabled={disabled}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors
                    ${disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
            >
                <Bold className={size === "sm" ? "w-3.5 h-3.5" : "w-3.5 h-3.5"} />
                <span className={size === "sm" ? "text-xs" : "text-sm"}>Format</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] max-h-[200px] overflow-y-auto rounded-lg border border-border bg-popover shadow-lg py-1 modal-scrollbar">
                    {markdownTools.map((tool) => (
                        <button
                            key={tool.key}
                            type="button"
                            onClick={() => handleToolClick(tool)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors cursor-pointer text-muted-foreground hover:bg-accent/50 hover:text-foreground whitespace-nowrap"
                        >
                            <span className="shrink-0">{tool.icon}</span>
                            <span className="truncate">{tool.title}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
