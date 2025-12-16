"use client";

import AddBlogModal from "@/components/admin/AddBlogModal";
import Article from "@/components/Article";
import BlogSubscribe from "@/components/content/BlogSubscribe";
import MotionWrapper from "@/components/motion/MotionWrapper";
import {
    AdminAddButton,
    AdminEmptyState,
    BlogsLoading,
    EmptyState,
    ErrorState,
    PageTitle,
    Section,
    Tags,
    TagsLoading,
} from "@/components/ui";
import { getBlogs, getBlogTags } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Blog } from "@/utils/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ITEMS_PER_PAGE = 5;

export default function BlogIndex() {
    const { isAdmin } = useAuth();
    const isInitialRender = useRef(true);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchQuery = searchParams.get("search") || "";
    const [searchInput, setSearchInput] = useState(searchQuery);

    const selectedTags = useMemo(() => {
        const tagsParam = searchParams.get("tags");
        return tagsParam ? tagsParam.split(",").filter(Boolean) : [];
    }, [searchParams]);

    useEffect(() => {
        if (searchQuery) setIsSearchOpen(true);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
    }, [isSearchOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchInput.trim()) {
                params.set("search", searchInput.trim());
            } else {
                params.delete("search");
            }
            router.push(`?${params.toString()}`, { scroll: false });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const updateTagsURL = useCallback((tags: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (tags.length > 0) {
            params.set("tags", tags.join(","));
        } else {
            params.delete("tags");
        }
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    useEffect(() => {
        if (isInitialRender.current) isInitialRender.current = false;
    }, [selectedTags, searchQuery]);

    const { data: tagsData, isLoading: isTagsLoading } = useQuery({
        queryKey: ["blogTags"],
        queryFn: getBlogTags,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data, isLoading, isError, error, refetch,
        fetchNextPage, hasNextPage, isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["blogs", "infinite", selectedTags, searchQuery],
        queryFn: ({ pageParam = 1 }) => getBlogs(pageParam, ITEMS_PER_PAGE, selectedTags, searchQuery),
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.length * ITEMS_PER_PAGE;
            return totalLoaded < lastPage.total ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
            },
            { threshold: 0.1 }
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allBlogs = useMemo(() => {
        return data?.pages.flatMap((page) => page.blogs) || [];
    }, [data?.pages]);

    const { allTags, clickableTags } = useMemo(() => {
        const allTags: string[] = tagsData?.tags || [];
        if (selectedTags.length === 0) return { allTags, clickableTags: allTags };
        const availableTagsSet = new Set<string>();
        allBlogs.forEach((blog: Blog) => {
            blog.tags?.forEach((tag) => availableTagsSet.add(tag));
        });
        const clickable = allTags.filter(
            (tag) => selectedTags.includes(tag) || availableTagsSet.has(tag)
        );
        return { allTags, clickableTags: clickable };
    }, [tagsData?.tags, allBlogs, selectedTags]);

    const handleTagClick = (tag: string) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];
        updateTagsURL(newTags);
    };

    const clearSearch = () => {
        setSearchInput("");
        setIsSearchOpen(false);
    };

    if (isError) {
        return (
            <Section id="blogs">
                <PageTitle
                    title="Ideas, insights, & inspiration"
                    subtitle="Thoughts on web design, freelancing, and creative growth, shared to inform, encourage, and spark new perspectives"
                />
                <ErrorState
                    title="Failed to load blogs"
                    message={error instanceof Error ? error.message : "We couldn't load the blog posts. Please check your connection and try again."}
                    onRetry={() => refetch()}
                />
            </Section>
        );
    }

    const hasBlogs = allBlogs.length > 0;
    const hasTags = allTags.length > 0;
    const hasFilters = selectedTags.length > 0 || searchQuery.trim().length > 0;
    const totalItems = data?.pages[0]?.total || 0;
    const loadedItems = allBlogs.length;
    const remainingItems = Math.min(ITEMS_PER_PAGE, totalItems - loadedItems);

    // Search button styled like a tag
    const searchElement = isSearchOpen ? (
        <div className="relative inline-flex items-center" data-tag="search">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-32 sm:w-40 h-7 pl-7 pr-6 text-sm rounded-md bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
            />
            <button onClick={clearSearch} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3 h-3" />
            </button>
        </div>
    ) : (
        <button
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Search blogs"
            data-tag="search"
        >
            <Search className="w-3.5 h-3.5" />
        </button>
    );

    return (
        <Section id="blogs">
            {(isLoading || hasBlogs || hasFilters) && (
                <PageTitle
                    title="Ideas, insights, & inspiration"
                    subtitle="Thoughts on web design, freelancing, and creative growth, shared to inform, encourage, and spark new perspectives"
                />
            )}

            {isAdmin && hasBlogs && (
                <AdminAddButton onClick={() => setIsModalOpen(true)} label="Add Blog" className="mb-4" />
            )}

            {/* Tags with inline search */}
            <div className="mb-6">
                {isTagsLoading ? (
                    <TagsLoading />
                ) : hasTags ? (
                    <MotionWrapper direction="left" delay={0.2}>
                        <Tags
                            tags={allTags}
                            selected={selectedTags}
                            clickableTags={clickableTags}
                            onTagClick={handleTagClick}
                            maxLines={2}
                            searchElement={searchElement}
                        />
                    </MotionWrapper>
                ) : (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {searchElement}
                    </div>
                )}
            </div>

            {isLoading ? (
                <BlogsLoading count={5} />
            ) : hasBlogs ? (
                <div className="space-y-6 sm:space-y-8">
                    {allBlogs.map((blog: Blog, index: number) => (
                        <Article
                            key={`blog-${blog.id}-${index}`}
                            {...blog}
                            showUnpublishedBadge={isAdmin && !blog.published}
                            disableAnimation={!isInitialRender.current}
                        />
                    ))}
                    <div ref={loadMoreRef} className="py-4">
                        {isFetchingNextPage && remainingItems > 0 && <BlogsLoading count={remainingItems} />}
                    </div>
                </div>
            ) : hasFilters ? (
                <EmptyState type="blogs" subtitle="No matching blogs" description="No blogs found matching your search or filters. Try adjusting your criteria." />
            ) : isAdmin ? (
                <AdminEmptyState type="blogs" onAdd={() => setIsModalOpen(true)} />
            ) : (
                <EmptyState type="blogs" />
            )}

            <BlogSubscribe variant="blog" />
            <AddBlogModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </Section>
    );
}
