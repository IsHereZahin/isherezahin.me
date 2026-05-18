"use client";

import { useEffect, useRef, useState } from "react";

let globalMuted = false;
const muteListeners = new Set<(muted: boolean) => void>();

function setGlobalMuted(muted: boolean) {
    if (globalMuted === muted) return;
    globalMuted = muted;
    muteListeners.forEach((listener) => listener(muted));
}

let openModalCount = 0;
const modalListeners = new Set<(open: boolean) => void>();

function notifyModalListeners() {
    const isOpen = openModalCount > 0;
    modalListeners.forEach((listener) => listener(isOpen));
}

export function notifySayloModalOpen() {
    openModalCount += 1;
    notifyModalListeners();
}

export function notifySayloModalClose() {
    openModalCount = Math.max(0, openModalCount - 1);
    notifyModalListeners();
}

interface AutoPlayVideoProps {
    src: string;
    className?: string;
    isActive?: boolean;
    threshold?: number;
}

export default function AutoPlayVideo({
    src,
    className = "",
    isActive = true,
    threshold = 0.5,
}: Readonly<AutoPlayVideoProps>) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [muted, setMuted] = useState(globalMuted);
    const [showControls, setShowControls] = useState(false);
    const [modalOpen, setModalOpen] = useState(openModalCount > 0);

    useEffect(() => {
        const listener = (m: boolean) => setMuted(m);
        muteListeners.add(listener);
        return () => {
            muteListeners.delete(listener);
        };
    }, []);

    useEffect(() => {
        const listener = (open: boolean) => setModalOpen(open);
        modalListeners.add(listener);
        return () => {
            modalListeners.delete(listener);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, [threshold]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isInView && isActive && !modalOpen) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay-with-sound blocked by browser; fall back to muted.
                    if (!video.muted) {
                        video.muted = true;
                        setGlobalMuted(true);
                        video.play().catch(() => {});
                    }
                });
            }
        } else {
            video.pause();
        }
    }, [isInView, isActive, modalOpen]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = muted;
    }, [muted]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onVolumeChange = () => setGlobalMuted(video.muted);
        video.addEventListener("volumechange", onVolumeChange);
        return () => video.removeEventListener("volumechange", onVolumeChange);
    }, []);

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    const clearHideTimer = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    const handleMouseEnter = () => {
        clearHideTimer();
        setShowControls(true);
    };

    const handleMouseLeave = () => {
        clearHideTimer();
        setShowControls(false);
    };

    const handleTouchStart = () => {
        clearHideTimer();
        setShowControls(true);
        hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    return (
        <video
            ref={videoRef}
            src={src}
            className={className}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            controls={showControls}
            controlsList="nodownload"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
        />
    );
}
