"use client";

import type { ReactNode } from "react";

interface MotionPopupProps {
    isOpen: boolean;
    children: ReactNode;
    className?: string;
    origin?: string;
}

/**
 * Popup/dropdown wrapper. Animates its content in (fade + scale) on open via a
 * pure-CSS keyframe (`.motion-popup` in globals.css). It unmounts on close, so
 * there is no exit animation — no animation library needed.
 */
export default function MotionPopup({
    isOpen,
    children,
    className = "",
    origin = "top-right",
}: Readonly<MotionPopupProps>) {
    if (!isOpen) return null;

    return (
        <div className={`motion-popup ${className}`.trim()} style={{ transformOrigin: origin }}>
            {children}
        </div>
    );
}
