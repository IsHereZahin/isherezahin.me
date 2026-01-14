"use client";

import { FilterDropdown, FilterOption } from "@/components/ui";
import { SortOption, VisibilityOption } from "@/lib/api";
import { Category } from "@/utils/types";
import { Eye, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SayloFiltersProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    selectedSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    selectedVisibility?: VisibilityOption;
    onVisibilityChange?: (visibility: VisibilityOption) => void;
    searchQuery: string;
    onSearchChange: (search: string) => void;
    totalCount: number;
    isAdmin?: boolean;
    distinctCategoriesCount?: number;
    distinctVisibilitiesCount?: number;
}

const SORT_OPTIONS: FilterOption<SortOption>[] = [
    { value: "recent", label: "Recent" },
    { value: "popular", label: "Popular" },
    { value: "oldest", label: "Oldest" },
];

const VISIBILITY_OPTIONS: FilterOption<VisibilityOption>[] = [
    { value: "all", label: "All" },
    { value: "public", label: "Public" },
    { value: "authenticated", label: "Signed In" },
    { value: "private", label: "Private" },
];

export default function SayloFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    selectedSort,
    onSortChange,
    selectedVisibility = "all",
    onVisibilityChange,
    searchQuery,
    onSearchChange,
    totalCount,
    isAdmin = false,
    distinctCategoriesCount = 0,
    distinctVisibilitiesCount = 0,
}: Readonly<SayloFiltersProps>) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Debounce search input (5 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                onSearchChange(localSearch);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [localSearch, searchQuery, onSearchChange]);

    // Handle instant search on Enter key
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearchChange(localSearch);
        }
    };

    // Sync local search with prop when prop changes externally (e.g., clear)
    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    const showCategoryFilter = distinctCategoriesCount >= 2;
    const showVisibilityFilter = isAdmin && onVisibilityChange && distinctVisibilitiesCount >= 2;

    // Check if any filter is active (not default)
    const hasActiveFilters = selectedCategory !== null || selectedSort !== "recent" || selectedVisibility !== "all" || searchQuery.trim() !== "";

    // Count active filters for badge
    const activeFilterCount = [
        selectedCategory !== null,
        selectedSort !== "recent",
        selectedVisibility !== "all",
        searchQuery.trim() !== "",
    ].filter(Boolean).length;

    const handleResetFilters = () => {
        onCategoryChange(null);
        onSortChange("recent");
        if (onVisibilityChange) {
            onVisibilityChange("all");
        }
        setLocalSearch("");
        onSearchChange("");
    };

    // Build category options with "All" as the first option
    const categoryOptions: FilterOption<string>[] = [
        { value: "", label: "All" },
        ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
    ];

    return (
        <div className="space-y-3">
            {/* Row: Count, Filters (desktop inline / mobile below) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left: Count */}
                <p className="text-sm text-muted-foreground shrink-0">
                    {totalCount} {totalCount === 1 ? "say" : "says"}
                </p>

                {/* Right: Filter Toggle Button (when collapsed) */}
                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer rounded-lg border border-border bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground transition"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                )}

                {/* Expanded Filters: Desktop inline, Mobile wraps to new line */}
                {isExpanded && (
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto order-last sm:order-0">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-auto sm:min-w-35 sm:max-w-50">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                            />
                        </div>

                        {/* Category Filter (show only when 2+ categories) */}
                        {showCategoryFilter && (
                            <FilterDropdown
                                options={categoryOptions}
                                value={selectedCategory || ""}
                                onChange={(value) => onCategoryChange(value || null)}
                                icon={<Filter className="w-4 h-4" />}
                            />
                        )}

                        {/* Visibility Filter (Admin only, show only when 2+ visibility types) */}
                        {showVisibilityFilter && (
                            <FilterDropdown
                                options={VISIBILITY_OPTIONS}
                                value={selectedVisibility}
                                onChange={onVisibilityChange}
                                icon={<Eye className="w-4 h-4" />}
                            />
                        )}

                        {/* Sort Filter */}
                        <FilterDropdown
                            options={SORT_OPTIONS}
                            value={selectedSort}
                            onChange={onSortChange}
                        />

                        {/* Reset Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium cursor-pointer rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                            >
                                <X className="w-4 h-4" />
                                Clear
                            </button>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium cursor-pointer rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                        >
                            <X className="w-4 h-4" />
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
