"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isVideoUrl } from "@/utils";
import { MediaItem } from "@/utils/types";

interface MediaGalleryProps {
    images: string[];
    videos: string[];
    onMediaClick: (index: number, media: MediaItem[]) => void;
}

export default function MediaGallery({ images, videos, onMediaClick }: Readonly<MediaGalleryProps>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    // Filter and combine media
    const actualImages = images.filter((url) => !isVideoUrl(url));
    const videosFromImages = images.filter((url) => isVideoUrl(url));
    const combinedVideos = [...videos, ...videosFromImages];

    const allMedia: MediaItem[] = [
        ...actualImages.map((url) => ({ url, type: "image" as const })),
        ...combinedVideos.map((url) => ({ url, type: "video" as const })),
    ];

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < allMedia.length - 1;

    const scrollToIndex = (index: number) => {
        const container = containerRef.current;
        if (!container) return;

        const items = container.children;
        if (items[index]) {
            const item = items[index] as HTMLElement;
            const containerWidth = container.offsetWidth;
            const itemWidth = item.offsetWidth;
            const totalItems = allMedia.length;

            let scrollLeft: number;

            if (index === 0) {
                scrollLeft = 0;
            } else if (index === totalItems - 1) {
                scrollLeft = container.scrollWidth - containerWidth;
            } else {
                const itemLeft = item.offsetLeft;
                scrollLeft = itemLeft - (containerWidth - itemWidth) / 2;
            }

            container.scrollTo({
                left: Math.max(0, scrollLeft),
                behavior: "smooth",
            });
        }
    };

    const goToPrev = () => {
        if (canGoPrev) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            scrollToIndex(newIndex);
        }
    };

    const goToNext = () => {
        if (canGoNext) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            scrollToIndex(newIndex);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return;

        const diff = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0 && canGoNext) {
                goToNext();
            } else if (diff < 0 && canGoPrev) {
                goToPrev();
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    useEffect(() => {
        if (allMedia.length > 2) {
            scrollToIndex(0);
        }
    }, [allMedia.length]);

    if (allMedia.length === 0) return null;

    // Single media - full width
    if (allMedia.length === 1) {
        const item = allMedia[0];
        return (
            <div className="mt-3">
                {item.type === "video" ? (
                    <button
                        onClick={() => onMediaClick(0, allMedia)}
                        className="relative w-full rounded-lg overflow-hidden border border-border/30 hover:border-border/50 transition-colors cursor-pointer"
                    >
                        <video src={item.url} className="w-full max-h-[400px] rounded-lg" muted preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-12 h-12 text-white" />
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={() => onMediaClick(0, allMedia)}
                        className="relative w-full rounded-lg overflow-hidden border border-border/30 hover:border-border/50 transition-colors cursor-pointer"
                    >
                        <Image src={item.url} alt="Image" width={800} height={400} className="w-full h-auto max-h-[400px] object-cover" />
                    </button>
                )}
            </div>
        );
    }

    // 2 media items - side by side
    if (allMedia.length === 2) {
        return (
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                {allMedia.map((item, index) => (
                    <button
                        key={item.url}
                        onClick={() => onMediaClick(index, allMedia)}
                        className="relative aspect-square overflow-hidden border border-border/30 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        {item.type === "image" ? (
                            <Image src={item.url} alt={`Image ${index + 1}`} fill className="object-cover" />
                        ) : (
                            <>
                                <video src={item.url} className="w-full h-full object-cover" muted preload="metadata" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <Play className="w-10 h-10 text-white" />
                                </div>
                            </>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    // 3+ media items - carousel
    return (
        <div className="mt-3 relative group/media rounded-lg overflow-hidden">
            {/* Left Arrow */}
            <button
                onClick={goToPrev}
                disabled={!canGoPrev}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-background/95 backdrop-blur-sm border border-border/50 rounded-full shadow-lg transition-all duration-200 hover:bg-background hover:scale-110 cursor-pointer ${
                    canGoPrev ? "opacity-0 group-hover/media:opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button
                onClick={goToNext}
                disabled={!canGoNext}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-background/95 backdrop-blur-sm border border-border/50 rounded-full shadow-lg transition-all duration-200 hover:bg-background hover:scale-110 cursor-pointer ${
                    canGoNext ? "opacity-0 group-hover/media:opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel Container */}
            <div
                ref={containerRef}
                className="flex gap-2 overflow-x-hidden touch-none scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {allMedia.map((item, index) => (
                    <button
                        key={item.url}
                        onClick={() => onMediaClick(index, allMedia)}
                        className={`relative shrink-0 aspect-square overflow-hidden border border-border/30 rounded-lg transition-all duration-300 cursor-pointer ${
                            index === currentIndex ? "w-[70%] opacity-100 scale-100" : "w-[70%] opacity-70 scale-95"
                        }`}
                    >
                        {item.type === "image" ? (
                            <Image src={item.url} alt={`Image ${index + 1}`} fill className="object-cover" />
                        ) : (
                            <>
                                <video src={item.url} className="w-full h-full object-cover" muted preload="metadata" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <Play className="w-10 h-10 text-white" />
                                </div>
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Dots Indicator */}
            {allMedia.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                    {allMedia.map((_, index) => (
                        <button
                            key={`dot-${index + 1}`}
                            onClick={() => {
                                setCurrentIndex(index);
                                scrollToIndex(index);
                            }}
                            className={`rounded-full transition-all duration-200 cursor-pointer ${
                                index === currentIndex
                                    ? "w-2 h-2 bg-primary"
                                    : "w-1.5 h-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
