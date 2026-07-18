"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const TRACK_URL = "/api/visitors/track";

export default function VisitorTracker() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;
        tracked.current = true;

        const body = JSON.stringify({ path: pathname, ref: searchParams.get("ref") });

        // Fire-and-forget so tracking never blocks rendering or navigation.
        // sendBeacon survives page unload; fall back to a keepalive fetch.
        try {
            if (typeof navigator !== "undefined" && navigator.sendBeacon) {
                const ok = navigator.sendBeacon(TRACK_URL, new Blob([body], { type: "application/json" }));
                if (ok) return;
            }
            void fetch(TRACK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
                keepalive: true,
            }).catch(() => { });
        } catch {
            // Tracking is best-effort; never surface errors to the user.
        }
    }, [searchParams, pathname]);

    return null;
}
