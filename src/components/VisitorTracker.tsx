"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function VisitorTracker() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;
        tracked.current = true;

        const trackVisit = async () => {
            try {
                const ref = searchParams.get("ref");

                await fetch("/api/visitors/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
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
