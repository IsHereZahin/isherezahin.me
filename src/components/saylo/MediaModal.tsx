"use client";

import { MediaItem } from "@/utils/types";
import { ChevronLeft, ChevronRight, Download, Grid3X3, Play, Square, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface MediaModalContentProps {
    media: MediaItem[];
    initialIndex: number;
    onClose: () => void;
}

function MediaModalContent({ media, initialIndex, onClose }: Readonly<MediaModalContentProps>) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [viewMode, setViewMode] = useState<"single" | "grid">("single");
    const videoRef = useRef<HTMLVideoElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const currentItem = media[currentIndex];
    const canGoNext = currentIndex < media.length - 1;
    const canGoPrev = currentIndex > 0;

    // Keyboard navigation and body scroll lock
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowRight" && canGoNext) {
                setCurrentIndex((prev) => prev + 1);
            } else if (e.key === "ArrowLeft" && canGoPrev) {
                setCurrentIndex((prev) => prev - 1);
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        globalThis.addEventListener("keydown", handleKeyDown);
        return () => {
            globalThis.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [onClose, canGoNext, canGoPrev]);

    // Pause video when changing slides
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    }, [currentIndex]);

    const handleDownload = async () => {
        try {
            const response = await fetch(currentItem.url);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const extension = currentItem.type === "video" ? "mp4" : "jpg";
            a.download = `media-${currentIndex + 1}.${extension}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Download started");
        } catch {
            toast.error("Failed to download");
        }
    };

    const goToIndex = (index: number) => {
        setCurrentIndex(index);
        setViewMode("single");
    };

    // Touch swipe handlers
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
                setCurrentIndex((prev) => prev + 1);
            } else if (diff < 0 && canGoPrev) {
                setCurrentIndex((prev) => prev - 1);
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Grid View
    if (viewMode === "grid") {
        return (
            <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col" onClick={onClose}>
                <div className="flex items-center justify-between p-4 bg-black/50" onClick={(e) => e.stopPropagation()}>
                    <div className="text-white text-sm">{media.length} items</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode("single")}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                            title="Single view"
                        >
                            <Square className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-6xl mx-auto">
                        {media.map((item, index) => (
                            <button
                                key={`grid-${item.url}`}
                                onClick={() => goToIndex(index)}
                                className="relative aspect-square overflow-hidden rounded-lg group hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                            >
                                {item.type === "video" ? (
                                    <>
                                        <video src={item.url} className="w-full h-full object-cover" muted preload="metadata" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Play className="w-8 h-8 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <Image src={item.url} alt={`Media ${index + 1}`} fill className="object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Single View
    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col" onClick={onClose}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-linear-to-b from-black/80 to-transparent" onClick={(e) => e.stopPropagation()}>
                <div className="text-white text-sm">
                    {currentIndex + 1} / {media.length}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        title="Download"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    {media.length > 1 && (
                        <button
                            onClick={() => setViewMode("grid")}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                            title="Grid view"
                        >
                            <Grid3X3 className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div
                className="flex-1 flex items-center justify-center relative px-4"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {canGoPrev && (
                    <button
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                <div className="max-w-5xl max-h-[70vh] w-full flex items-center justify-center">
                    {currentItem.type === "video" ? (
                        <video
                            ref={videoRef}
                            key={currentItem.url}
                            src={currentItem.url}
                            controls
                            autoPlay
                            playsInline
                            className="max-w-full max-h-[70vh] rounded-lg"
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <Image
                            src={currentItem.url}
                            alt={`Media ${currentIndex + 1}`}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg"
                            priority
                        />
                    )}
                </div>

                {canGoNext && (
                    <button
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Thumbnail Strip */}
            {media.length > 1 && (
                <div className="p-4 bg-linear-to-t from-black/80 to-transparent" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none py-2">
                        {media.map((item, index) => (
                            <button
                                key={`thumb-${item.url}`}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all cursor-pointer ${index === currentIndex ? "ring-2 ring-primary scale-105" : "opacity-60 hover:opacity-100"
                                    }`}
                            >
                                {item.type === "video" ? (
                                    <>
                                        <video src={item.url} className="w-full h-full object-cover" muted preload="metadata" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Play className="w-4 h-4 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <Image src={item.url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

interface MediaModalProps {
    media: MediaItem[];
    initialIndex: number;
    onClose: () => void;
}

export default function MediaModal(props: Readonly<MediaModalProps>) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(<MediaModalContent {...props} />, document.body);
}
