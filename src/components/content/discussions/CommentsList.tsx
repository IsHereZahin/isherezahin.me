"use client"

import {
    CommentsLoading,
    FilterDropdown,
    FilterOption,
    SingleCommentLoading,
} from "@/components/ui"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { useEffect, useRef } from "react"
import CommentCard from "./CommentCard"

const ITEMS_PER_PAGE = 10
const PRELOAD_THRESHOLD = 3

type SortValue = "newest" | "oldest" | "popular"

const SORT_OPTIONS: FilterOption<SortValue>[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "popular", label: "Most Popular" },
]

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

    const currentSort = (sortBy || "newest") as SortValue
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
                <FilterDropdown
                    options={SORT_OPTIONS}
                    value={currentSort}
                    onChange={(value) => setSortBy(value as typeof sortBy)}
                />
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
