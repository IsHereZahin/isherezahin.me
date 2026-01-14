"use client";

import SayCard from "@/components/saylo/SayCard";
import SayloComposer from "@/components/saylo/SayloComposer";
import SayloFilters from "@/components/saylo/SayloFilters";
import { PageTitle, Section } from "@/components/ui";
import EmptyState from "@/components/ui/EmptyState";
import { saylo, SortOption } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SayloIndex() {
    const { isAdmin, status, user } = useAuth();
    const isLoggedIn = status === "authenticated";
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<SortOption>("recent");
    const [openCommentId, setOpenCommentId] = useState<string | null>(null);

    const { data: categoriesData } = useQuery({
        queryKey: ["sayloCategories"],
        queryFn: () => saylo.getCategories(),
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["saylos", selectedCategory, selectedSort],
        queryFn: ({ pageParam = 1 }) => saylo.getAll(pageParam, 3, selectedCategory, selectedSort),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
    });

    const observerRef = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const element = observerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 0,
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [handleObserver]);

    const allSaylos = data?.pages.flatMap((page) => page.saylos) || [];
    const totalCount = data?.pages[0]?.total || 0;

    return (
        <Section id="saylo" className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
            {totalCount > 0 && (
                <PageTitle
                    title="Saylo"
                    subtitle="Thoughts, ideas, and moments shared in the moment."
                />
            )}

            <div className={totalCount > 0 ? "mt-8 space-y-6" : "space-y-6"}>
                {/* Admin Composer */}
                {isAdmin && <SayloComposer />}

                {/* Filters Row */}
                {totalCount > 0 && (
                    <SayloFilters
                        categories={categoriesData?.categories || []}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedSort={selectedSort}
                        onSortChange={setSelectedSort}
                        totalCount={totalCount}
                    />
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Failed to load says. Please try again.</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && allSaylos.length === 0 && (
                    isAdmin ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                No says yet. Share your first thought above!
                            </p>
                        </div>
                    ) : (
                        <EmptyState type="saylo" />
                    )
                )}

                {/* Saylo Feed */}
                {allSaylos.length > 0 && (
                    <div className="space-y-4">
                        {allSaylos.map((s) => (
                            <SayCard
                                key={s.id}
                                saylo={s}
                                isAdmin={isAdmin}
                                isLoggedIn={isLoggedIn}
                                userId={user?.id}
                                variant="list"
                                isCommentOpen={openCommentId === s.id}
                                onCommentToggle={(isOpen) => setOpenCommentId(isOpen ? s.id : null)}
                            />
                        ))}
                    </div>
                )}

                {/* Load More Observer */}
                <div ref={observerRef} className="h-4" />

                {/* Loading More */}
                {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
        </Section>
    );
}
