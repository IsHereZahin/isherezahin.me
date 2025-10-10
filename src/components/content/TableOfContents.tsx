// ui - Thanks to nelson and clarence
// Copyright (c) 2023 Nelson Lai & Theodorus Clarence
// Source: https://github.com/nelsonlaidev & https://github.com/theodorusclarence
//
// Modified by: Zahin Mohammad

"use client";

import LikeButton from "@/components/content/like-button";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TOCItem {
    id: string;
    title: string;
    indent?: number;
}

interface TableOfContentsProps {
    tocItems: TOCItem[];
    showMobileTOC: boolean;
    setShowMobileTOC: (state: boolean) => void;
}

export default function TableOfContents({
    tocItems,
    showMobileTOC,
    setShowMobileTOC,
}: Readonly<TableOfContentsProps>) {
    const [activeId, setActiveId] = useState<string>("");
    const [indicatorStyle, setIndicatorStyle] = useState<{
        top: number;
        height: number;
    }>({ top: 0, height: 0 });
    const containerRef = useRef<HTMLUListElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Helper function to find the active TOC id
    function getActiveTocId(tocItems: TOCItem[]): string {
        let current = "";
        let minDistance = Infinity;

        tocItems.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) {
                const rect = el.getBoundingClientRect();
                // Calculate distance from viewport top, adjusted for header offset (e.g., 100px)
                const distance = Math.abs(rect.top - 100);
                if (distance < minDistance) {
                    minDistance = distance;
                    current = item.id;
                }
            }
        });

        return current;
    }

    useEffect(() => {
        let ticking = false;

        const updateActiveId = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const current = getActiveTocId(tocItems);
                setActiveId(current);
                ticking = false;
            });
        };

        window.addEventListener("scroll", updateActiveId, { passive: true });
        updateActiveId(); // Initial calculation

        return () => {
            window.removeEventListener("scroll", updateActiveId);
        };
    }, [tocItems]);

    // Update indicator position dynamically
    useEffect(() => {
        if (!containerRef.current) return;

        const activeEl = containerRef.current.querySelector(
            `a[data-id="${activeId}"]`
        ) as HTMLElement | null;

        if (activeEl) {
            const { offsetTop, offsetHeight } = activeEl;
            setIndicatorStyle({ top: offsetTop, height: offsetHeight });
        }
    }, [activeId]);

    // Keyboard navigation for mobile overlay
    useEffect(() => {
        if (!showMobileTOC || !overlayRef.current) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowMobileTOC(false);
                return;
            }

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const links = overlayRef.current?.querySelectorAll('a[role="menuitem"]') as NodeListOf<HTMLAnchorElement>;
                if (links.length === 0) return;

                const currentFocus = document.activeElement as HTMLAnchorElement;
                const currentIndex = Array.from(links).indexOf(currentFocus);
                const nextIndex = e.key === "ArrowDown"
                    ? (currentIndex + 1) % links.length
                    : (currentIndex - 1 + links.length) % links.length;

                links[nextIndex].focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        // Focus the first link on open
        setTimeout(() => {
            const firstLink = overlayRef.current?.querySelector('a[role="menuitem"]') as HTMLAnchorElement;
            firstLink?.focus();
        }, 100);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [showMobileTOC, overlayRef, setShowMobileTOC]);

    const isActive = (id: string) => activeId === id;

    const handleItemClick = (id: string) => {
        setShowMobileTOC(false);
        // Smooth scroll to section
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* Desktop Sidebar (Unchanged) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 pt-4 pb-6 text-sm">
                    <h4 className="text-foreground font-semibold mb-4 text-lg">
                        On this page
                    </h4>

                    <div className="relative">
                        {/* Left border */}
                        <div className="absolute left-0 top-0 bottom-0 border-l border-border" />

                        {/* Animated active indicator */}
                        {indicatorStyle.height > 0 && (
                            <motion.div
                                layout
                                animate={{ top: indicatorStyle.top, height: indicatorStyle.height }}
                                className="absolute left-0 border-l-2 border-foreground"
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                            />
                        )}

                        <ul ref={containerRef} className="flex flex-col gap-1 pl-4">
                            {tocItems.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        data-id={item.id}
                                        className={`block px-3 py-1.5 rounded-md cursor-pointer font-medium transition-colors ${isActive(item.id)
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-accent-foreground"
                                            }`}
                                        style={{
                                            paddingLeft: `${(item.indent || 0) + 8}px`,
                                        }}
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6">
                        <LikeButton />
                    </div>
                </div>
            </aside>

            {/* Enhanced Mobile Overlay with Blurred Backdrop */}
            <motion.div
                ref={overlayRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="toc-title"
                className={`fixed inset-0 z-[50] ${showMobileTOC ? "bg-black/10 backdrop-blur-xs" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showMobileTOC ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ pointerEvents: showMobileTOC ? "auto" : "none" }}
                onClick={() => setShowMobileTOC(false)}
            >
                <motion.div
                    className={`fixed left-0 right-0 bottom-0 rounded-t-[12px] bg-background shadow-2xl backdrop-blur-md border-t border-border transition-all duration-300 ${showMobileTOC ? "bg-muted/80 backdrop-blur-md" : ""}"`}
                    initial={{ y: "100%", scale: 0.95 }}
                    animate={{
                        y: showMobileTOC ? 0 : "100%",
                        scale: showMobileTOC ? 1 : 0.95
                    }}
                    exit={{ y: "100%", scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Enhanced Drag Handle */}
                    <div className="mx-auto w-10 h-1.5 shrink-0 rounded-full bg-gradient-to-r from-foreground/30 to-foreground/50 mt-4 mb-4 opacity-80" />

                    {/* Header with Improved Spacing */}
                    <div className="flex items-center justify-between px-6 pb-2">
                        <h2
                            id="toc-title"
                            className="text-lg font-semibold text-foreground leading-tight"
                        >
                            Table of Contents
                        </h2>
                        <button
                            onClick={() => setShowMobileTOC(false)}
                            aria-label="Close table of contents"
                            className="p-2.5 rounded-lg hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ring-offset-1 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-foreground" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Scrollable Content with Better Structure */}
                    <div className="overflow-auto px-6 pb-6 max-h-[80vh]">
                        <ul ref={listRef} className="flex flex-col space-y-2.5 text-sm leading-relaxed">
                            {tocItems.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        role="menuitem"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleItemClick(item.id);
                                        }}
                                        style={{ marginLeft: `${item.indent || 0}px` }}
                                        className={`block py-1 px-2 rounded-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ring-offset-1 ${isActive(item.id)
                                                ? "text-foreground bg-accent/10 font-semibold bg-muted/20"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/15"
                                            }`}
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}