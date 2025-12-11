"use client"

import {
    CommentsLoading,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    SingleCommentLoading,
} from "@/components/ui"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { Settings2 } from "lucide-react"
import { useEffect, useRef } from "react"
import CommentCard from "./CommentCard"

interface SortOption {
    value: string
    label: string
}

const ITEMS_PER_PAGE = 10
const PRELOAD_THRESHOLD = 3

export default function CommentsList() {
    const {
        comments,
        loading,
        loadingMore,
        sortBy,
        setSortBy,
        total,
        hasNextPage,
        fetchMoreComments
    } = useDiscussion()
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const sortOptions: SortOption[] = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "popular", label: "Most Popular" },
    ]

    const currentSort = sortBy || "newest"
    const remainingCount = Math.min(ITEMS_PER_PAGE, total - comments.length)

    // Intersection observer for lazy loading from backend
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !loadingMore) {
                    fetchMoreComments()
                }
            },
            { threshold: 0.1 }
        )
        if (loadMoreRef.current) observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [hasNextPage, loadingMore, fetchMoreComments])

    if (loading) {
        return <CommentsLoading />
    }

    const sortLabel = sortOptions.find((o) => o.value === currentSort)?.label || "Sort"

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-row justify-between gap-4 mt-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-medium text-foreground">Comments</h2>
                    <span className="text-secondary-foreground font-medium">
                        ({total})
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
                {comments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="font-medium text-foreground">No comments yet</p>
                        <p className="text-sm mt-1">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <>
                        {comments.map((comment, index) => (
                            <div
                                key={comment.id}
                                ref={index === comments.length - PRELOAD_THRESHOLD ? loadMoreRef : null}
                            >
                                <CommentCard comment={comment} />
                            </div>
                        ))}
                        {(hasNextPage || loadingMore) && remainingCount > 0 && (
                            <div className="gap-4 flex flex-col py-4">
                                {[...Array(remainingCount)].map((_, idx) => (
                                    <SingleCommentLoading key={idx} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}