"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Fades + rises the page content in on mount and on every route change. The
 * wrapper is keyed by pathname so the CSS animation replays on each navigation.
 * Pure CSS (see `.page-transition` in globals.css) — no animation library, and
 * it respects `prefers-reduced-motion`.
 */
export default function PageTransition({
    children,
    className = "",
}: {
    readonly children: ReactNode;
    readonly className?: string;
}) {
    const pathname = usePathname();
    return (
        <div key={pathname} className={`page-transition ${className}`.trim()}>
            {children}
        </div>
    );
}
