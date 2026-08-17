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
 * Scroll-reveal wrapper. Fades + slides content in the first time it enters the
 * viewport. Pure CSS transition driven by an IntersectionObserver — no animation
 * library. Honors `prefers-reduced-motion`.
 *
 * Content starts visible and is only hidden once JavaScript confirms the element
 * is below the fold, so server-rendered HTML paints without waiting for hydration.
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
    // "shown"  — painted as-is (server HTML, and anything above the fold)
    // "hidden" — pulled back off-screen, waiting to be scrolled to
    // "revealed" — animated in after intersecting
    const [phase, setPhase] = useState<"shown" | "hidden" | "revealed">("shown");

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced || typeof IntersectionObserver === "undefined") return;

        // Already on screen: leave it painted rather than hiding content the
        // visitor is looking at.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) return;

        setPhase("hidden");

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPhase("revealed");
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const horizontal = direction === "left" || direction === "right";
    const sign = direction === "left" || direction === "top" ? -1 : 1;
    const isHidden = phase === "hidden";

    const revealStyle: CSSProperties = {
        opacity: isHidden ? 0 : 1,
        // Once revealed, reset to `none` — NOT `translate(0)` — and don't keep
        // `will-change`. A lingering transform (or will-change: transform) makes
        // this element the containing block/stacking context for `position: fixed`
        // descendants, which would trap the fixed site header and make it
        // unclickable. `none` avoids that entirely.
        transform: isHidden ? `translate${horizontal ? "X" : "Y"}(${sign * distance}px)` : "none",
        // No transition in the initial "shown" phase.
        transition:
            phase === "shown"
                ? undefined
                : `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        ...style,
    };

    return (
        <div ref={ref} className={className} style={revealStyle} {...props}>
            {children}
        </div>
    );
}
