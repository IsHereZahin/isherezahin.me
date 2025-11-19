"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommentsLoading } from "@/components/ui/Loading"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { Settings2 } from "lucide-react"
import CommentCard from "./CommentCard"

interface SortOption {
    value: string
    label: string
}

export default function CommentsList() {
    const { comments, loading, sortBy, setSortBy } = useDiscussion()

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

    if (loading) {
        return (
            <CommentsLoading />
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer rounded-lg border border-border bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground transition">
                            <Settings2 className="w-4 h-4" />
                            {sortLabel}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {sortOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setSortBy(option.value as typeof sortBy)}
                                className={`cursor-pointer ${currentSort === option.value
                                        ? "bg-secondary text-secondary-foreground"
                                        : ""
                                    }`}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
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