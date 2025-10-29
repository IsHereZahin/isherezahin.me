"use client"

import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { ChevronDown, Settings2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import CommentCard from "./CommentCard"

interface SortOption {
    value: string
    label: string
}

export default function CommentsList() {
    const { comments, loading, sortBy, setSortBy } = useDiscussion()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const sortOptions: SortOption[] = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "popular", label: "Most Popular" },
    ]

    const currentSort = sortBy || "newest"

    // Sort comments based on selected sort option
    const sortedComments = [...comments].sort((a, b) => {
        switch (currentSort) {
            case "newest":
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case "oldest":
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            case "popular":
                const aScore = (a.reactions["+1"] || 0) - (a.reactions["-1"] || 0)
                const bScore = (b.reactions["+1"] || 0) - (b.reactions["-1"] || 0)
                return bScore - aScore
            default:
                return 0
        }
    })

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-secondary rounded w-3/4"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
                <div className="h-20 bg-secondary rounded"></div>
            </div>
        )
    }

    const sortLabel = sortOptions.find((o) => o.value === currentSort)?.label || "Sort"

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-row justify-between gap-4 mt-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-medium text-foreground">Comments</h2>
                    <span className="text-secondary-foreground font-medium">
                        ({comments.length})
                    </span>
                </div>

                {/* Sort Dropdown */}
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer rounded-lg border border-border bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground transition"
                    >
                        <Settings2 className="w-4 h-4" />
                        {sortLabel}
                        <ChevronDown className={`w-4 h-4 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div
                        className={`absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-feature-card z-20 transition-all duration-200 ease-out
                            ${isDropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
                    >
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                aria-pressed={currentSort === option.value}
                                onClick={() => {
                                    setSortBy(option.value as typeof sortBy)
                                    setIsDropdownOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors
                                    ${currentSort === option.value
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {sortedComments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="font-medium text-foreground">No comments yet</p>
                        <p className="text-sm mt-1">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    sortedComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
                )}
            </div>
        </section>
    )
}