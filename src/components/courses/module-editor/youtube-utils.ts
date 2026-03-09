"use client";

import { useCallback, useEffect, useRef } from "react";

// YouTube IFrame API types
declare global {
    interface Window {
        YT: {
            Player: new (
                el: string | HTMLElement,
                config: {
                    videoId: string;
                    width?: string | number;
                    height?: string | number;
                    playerVars?: Record<string, unknown>;
                    events?: {
                        onReady?: (event: { target: { getDuration: () => number; destroy: () => void } }) => void;
                        onStateChange?: (event: { data: number; target: { getDuration: () => number; destroy: () => void } }) => void;
                    };
                }
            ) => { getDuration: () => number; destroy: () => void };
            PlayerState: {
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady: (() => void) | undefined;
        _ytApiLoaded?: boolean;
    }
}

export function getYouTubeVideoId(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com") && parsed.pathname === "/watch") {
            return parsed.searchParams.get("v");
        }
        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.slice(1);
        }
        if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
            return parsed.pathname.split("/embed/")[1]?.split("?")[0] || null;
        }
    } catch { /* noop */ }
    return null;
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function loadYouTubeAPI(): Promise<void> {
    return new Promise((resolve) => {
        if (window.YT?.Player) { resolve(); return; }
        const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
        }
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prev?.();
            resolve();
        };
    });
}

export function useFetchDuration() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = "0";
        div.style.height = "0";
        div.style.overflow = "hidden";
        document.body.appendChild(div);
        containerRef.current = div;
        return () => { div.remove(); };
    }, []);

    const fetchDuration = useCallback(async (videoId: string): Promise<string | null> => {
        await loadYouTubeAPI();
        if (!containerRef.current) return null;

        return new Promise((resolve) => {
            const el = document.createElement("div");
            containerRef.current!.appendChild(el);

            const timeout = setTimeout(() => {
                try { player.destroy(); } catch { /* noop */ }
                el.remove();
                resolve(null);
            }, 10000);

            const player = new window.YT.Player(el, {
                videoId,
                playerVars: { autoplay: 0, controls: 0, mute: 1 },
                events: {
                    onReady: (event) => {
                        clearTimeout(timeout);
                        const dur = event.target.getDuration();
                        try { event.target.destroy(); } catch { /* noop */ }
                        el.remove();
                        resolve(dur > 0 ? formatDuration(dur) : null);
                    },
                },
            });
        });
    }, []);

    return fetchDuration;
}
