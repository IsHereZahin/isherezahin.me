"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface TagsProps {
    tags: string[];
    className?: string;
    selected?: string[];
    clickableTags?: string[];
    onTagClick?: (tag: string) => void;
    maxLines?: number;
    searchElement?: ReactNode;
}

export default function Tags({
    tags,
    className,
    selected = [],
    clickableTags = [],
    onTagClick,
    maxLines = 2,
    searchElement,
}: Readonly<TagsProps>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [visibleCount, setVisibleCount] = useState(tags.length);
    const [needsExpand, setNeedsExpand] = useState(false);

    const calculateVisibleTags = useCallback(() => {
        const container = containerRef.current;
        if (!container || isExpanded) {
            setVisibleCount(tags.length);
            setNeedsExpand(false);
            return;
        }

        const items = container.querySelectorAll("[data-tag-item]");
        if (items.length === 0) return;

        const firstItem = items[0] as HTMLElement;
        const itemHeight = firstItem.offsetHeight;
        const gap = 8; // gap-2
        const maxHeight = itemHeight * maxLines + gap * (maxLines - 1);

        let visible = 0;
        let lastVisibleTop = 0;
        let lineCount = 1;

        // Count how many tags fit within maxLines
        for (let i = 0; i < items.length; i++) {
            const item = items[i] as HTMLElement;
            const itemTop = item.offsetTop - container.offsetTop;

            // Check if this item starts a new line
            if (itemTop > lastVisibleTop + itemHeight / 2) {
                lineCount++;
                lastVisibleTop = itemTop;
            }

            // If we're still within allowed lines, count this item
            if (lineCount <= maxLines) {
                visible++;
            } else {
                break;
            }
        }

        // Account for search element (first item)
        const tagCount = visible > 0 ? visible - 1 : 0; // -1 for search element
        const hiddenCount = tags.length - tagCount;

        if (hiddenCount > 0) {
            setNeedsExpand(true);
            // Reserve space for the expand button by showing fewer tags
            setVisibleCount(Math.max(0, tagCount - 1));
        } else {
            setNeedsExpand(false);
            setVisibleCount(tags.length);
        }
    }, [tags.length, maxLines, isExpanded]);

    // Calculate on mount and when dependencies change
    useEffect(() => {
        // Small delay to ensure DOM is rendered
        const timer = setTimeout(calculateVisibleTags, 50);
        return () => clearTimeout(timer);
    }, [calculateVisibleTags, tags]);

    // Recalculate on window resize
    useEffect(() => {
        const handleResize = () => {
            if (!isExpanded) {
                calculateVisibleTags();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [calculateVisibleTags, isExpanded]);

    // Use ResizeObserver for container size changes
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            if (!isExpanded) {
                calculateVisibleTags();
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [calculateVisibleTags, isExpanded]);

    const hiddenCount = tags.length - visibleCount;
    const displayedTags = isExpanded ? tags : tags.slice(0, visibleCount);

    return (
        <div className={`${className ?? ""}`}>
            <div
                ref={containerRef}
                className="flex flex-wrap items-center justify-start gap-2 text-sm text-muted-foreground"
            >
                <a
                    href="#skip-tags"
                    className="z-10 inline-block rounded-md px-1.5 py-0.5 font-medium transition bg-muted text-foreground hover:text-foreground focus:outline-none focus-visible:ring focus-visible:ring-primary disabled:cursor-not-allowed pointer-events-none absolute opacity-0 focus:inline-block translate-y-[-1rem] focus:translate-y-0 focus:opacity-100"
                >
                    Skip tag
                </a>

                {/* Search element inline with tags */}
                {searchElement && (
                    <div data-tag-item="search">{searchElement}</div>
                )}

                {displayedTags.map((tag, index) => {
                    const isSelected = selected.includes(tag);
                    const isClickable = clickableTags.includes(tag);

                    return (
                        <button
                            key={`tag-${index}-${tag}`}
                            data-tag-item={tag}
                            onClick={isClickable && onTagClick ? () => onTagClick(tag) : undefined}
                            className={`
                                inline-block rounded-md px-2 py-0.5 font-medium transition
                                ${isSelected
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"}
                                ${isClickable
                                    ? "cursor-pointer hover:text-foreground"
                                    : "cursor-not-allowed opacity-50"}
                                focus:outline-none focus-visible:ring focus-visible:ring-primary-300
                            `}
                            disabled={!isClickable}
                        >
                            {tag}
                        </button>
                    );
                })}

                {/* Expand/Collapse button - always visible when needed */}
                {(needsExpand || isExpanded) && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-block rounded-md px-2 py-0.5 font-medium transition bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-primary-300 whitespace-nowrap"
                        data-tag-item="expand"
                    >
                        {isExpanded ? "Show less" : `+${hiddenCount} more`}
                    </button>
                )}

                <div id="skip-tags" className="hidden" />
            </div>
        </div>
    );
}
