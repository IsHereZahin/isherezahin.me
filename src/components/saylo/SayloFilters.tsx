"use client";

import { SortOption } from "@/lib/api";
import { Category } from "@/utils/types";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SayloFiltersProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    selectedSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    totalCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Recent" },
    { value: "popular", label: "Popular" },
    { value: "oldest", label: "Oldest" },
];

export default function SayloFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    selectedSort,
    onSortChange,
    totalCount,
}: Readonly<SayloFiltersProps>) {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setShowCategoryDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === selectedSort)?.label || "Recent";

    return (
        <div className="flex items-center justify-between gap-4">
            {/* Left: Count */}
            <p className="text-sm text-muted-foreground">
                {totalCount} {totalCount === 1 ? "say" : "says"}
            </p>

            {/* Right: Filters */}
            <div className="flex items-center gap-2">
                {/* Category Filter */}
                <div className="relative" ref={categoryRef}>
                    <button
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-accent/30 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                    >
                        {selectedCategory || "All"}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showCategoryDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden">
                            <button
                                onClick={() => {
                                    onCategoryChange(null);
                                    setShowCategoryDropdown(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors cursor-pointer ${selectedCategory === null ? "bg-accent/50 text-foreground font-medium" : "text-muted-foreground"
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        onCategoryChange(cat.name);
                                        setShowCategoryDropdown(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors cursor-pointer ${selectedCategory === cat.name
                                            ? "bg-accent/50 text-foreground font-medium"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {categories.length === 0 && (
                                <p className="px-3 py-2 text-xs text-muted-foreground">No categories yet</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Sort Filter */}
                <div className="relative" ref={sortRef}>
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-accent/30 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                    >
                        {selectedSortLabel}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showSortDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden">
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onSortChange(option.value);
                                        setShowSortDropdown(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors cursor-pointer ${selectedSort === option.value
                                            ? "bg-accent/50 text-foreground font-medium"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
