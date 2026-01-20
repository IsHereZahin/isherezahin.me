"use client";

import ComingSoon from "@/components/ComingSoon";
import SayCard from "@/components/saylo/SayCard";
import SayloComposer from "@/components/saylo/SayloComposer";
import SayloFilters from "@/components/saylo/SayloFilters";
import { PageTitle, Section } from "@/components/ui";
import EmptyState from "@/components/ui/EmptyState";
import { publicSettings, saylo, SortOption, VisibilityOption } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SayloIndex() {
    const { isAdmin, status, user } = useAuth();
    const isLoggedIn = status === "authenticated";
    const isAuthLoading = status === "loading";
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<SortOption>("recent");
    const [selectedVisibility, setSelectedVisibility] = useState<VisibilityOption>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [openCommentId, setOpenCommentId] = useState<string | null>(null);

    // Check if Saylo page is public
    const { data: settingsData, isLoading: isSettingsLoading } = useQuery({
        queryKey: ["publicSettings"],
        queryFn: publicSettings.get,
    });

    // Only determine page visibility after settings are loaded
    // Use undefined until settings are loaded to prevent premature API calls
    const isSayloPagePublic = settingsData ? (settingsData.settings?.sayloPagePublic ?? true) : undefined;

    // Only fetch data if:
    // 1. Settings are loaded (!isSettingsLoading)
    // 2. Auth status is determined (!isAuthLoading)
    // 3. AND (user is admin OR page is public)
    // If isSayloPagePublic is undefined (still loading), don't fetch
    const shouldFetchData = !isSettingsLoading && !isAuthLoading && (isAdmin === true || isSayloPagePublic === true);

    const { data: categoriesData } = useQuery({
        queryKey: ["sayloCategories"],
        queryFn: () => saylo.getCategories(),
        enabled: shouldFetchData,
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ["saylos", selectedCategory, selectedSort, selectedVisibility, searchQuery],
        queryFn: ({ pageParam = 1 }) => saylo.getAll(pageParam, 3, selectedCategory, selectedSort, selectedVisibility, searchQuery),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new
        enabled: shouldFetchData,
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
    const distinctCategoriesCount = data?.pages[0]?.distinctCategoriesCount || 0;
    const distinctVisibilitiesCount = data?.pages[0]?.distinctVisibilitiesCount || 0;

    // Show loading while checking settings or auth status
    if (isSettingsLoading || isAuthLoading) {
        return (
            <Section id="saylo" className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </Section>
        );
    }

    // Show Coming Soon for non-admin users when page is private
    if (isAdmin !== true && isSayloPagePublic === false) {
        return <ComingSoon />;
    }

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
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <SayloFilters
                                categories={categoriesData?.categories || []}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                selectedSort={selectedSort}
                                onSortChange={setSelectedSort}
                                selectedVisibility={selectedVisibility}
                                onVisibilityChange={setSelectedVisibility}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                totalCount={totalCount}
                                isAdmin={isAdmin}
                                distinctCategoriesCount={distinctCategoriesCount}
                                distinctVisibilitiesCount={distinctVisibilitiesCount}
                            />
                        </div>
                        {/* Show subtle loading indicator when refetching due to filter change */}
                        {isFetching && !isLoading && !isFetchingNextPage && (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                    </div>
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
                    <div className={`space-y-4 transition-opacity duration-200 ${isFetching && !isLoading && !isFetchingNextPage ? "opacity-60" : "opacity-100"}`}>
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
