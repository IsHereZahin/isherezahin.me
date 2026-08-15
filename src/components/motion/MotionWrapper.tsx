"use client";

import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

type Direction = "left" | "right" | "top" | "bottom";

interface MotionWrapperProps extends HTMLAttributes<HTMLDivElement> {
    direction?: Direction;
    distance?: number;
    duration?: number;
    delay?: number;
    children: ReactNode;
}

/**
 * Scroll-reveal wrapper. Fades + slides its content in the first time it enters
 * the viewport. Pure CSS transition driven by an IntersectionObserver — no
 * animation library. Honors `prefers-reduced-motion` (shows instantly).
 *
 * API kept compatible with the previous (library-based) version so every
 * caller and the `Section` component work unchanged.
 */
export default function MotionWrapper({
    direction = "bottom",
    distance = 10,
    duration = 0.5,
    delay = 0.2,
    children,
    className = "",
    style,
    ...props
}: Readonly<MotionWrapperProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    // Content already on screen when the page mounted is "above the fold" for
    // this navigation. It reveals straight away instead of sitting invisible
    // through the stagger delay, which is what made a freshly navigated page
    // look like it was still loading.
    const [immediate, setImmediate] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced || typeof IntersectionObserver === "undefined") {
            setImmediate(true);
            setVisible(true);
            return;
        }

        // The observer reports once as soon as it starts observing; if that first
        // report already intersects, the element was on screen at mount.
        let firstReport = true;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (firstReport) setImmediate(true);
                    setVisible(true);
                    observer.disconnect();
                }
                firstReport = false;
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const horizontal = direction === "left" || direction === "right";
    const sign = direction === "left" || direction === "top" ? -1 : 1;
    const hiddenTransform = `translate${horizontal ? "X" : "Y"}(${sign * distance}px)`;

    // Scroll-revealed content keeps its authored timing; above-the-fold content
    // drops the stagger delay and uses a shorter fade so a new page feels instant.
    const revealDelay = immediate ? 0 : delay;
    const revealDuration = immediate ? Math.min(duration, 0.3) : duration;

    const revealStyle: CSSProperties = {
        opacity: visible ? 1 : 0,
        // Once revealed, reset to `none` — NOT `translate(0)` — and don't keep
        // `will-change`. A lingering transform (or will-change: transform) makes
        // this element the containing block/stacking context for `position: fixed`
        // descendants, which would trap the fixed site header and make it
        // unclickable. `none` avoids that entirely.
        transform: visible ? "none" : hiddenTransform,
        transition: `opacity ${revealDuration}s ease-out ${revealDelay}s, transform ${revealDuration}s ease-out ${revealDelay}s`,
        ...style,
    };

    return (
        <div ref={ref} className={className} style={revealStyle} {...props}>
            {children}
        </div>
    );
}
