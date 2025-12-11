"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function generateFingerprint(): string {
    const nav = window.navigator;
    const screen = window.screen;

    const data = [
        nav.userAgent,
        nav.language,
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        nav.hardwareConcurrency || "",
        (nav as Navigator & { deviceMemory?: number }).deviceMemory || "",
    ].join("|");

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

export default function VisitorTracker() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;
        tracked.current = true;

        const trackVisit = async () => {
            try {
                const fingerprint = generateFingerprint();
                const ref = searchParams.get("ref");

                await fetch("/api/visitors/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fingerprint,
                        ref,
                        path: pathname,
                    }),
                });
            } catch (error) {
                console.error("Failed to track visit:", error);
            }
        };

        trackVisit();
    }, [searchParams, pathname]);

    return null;
}
