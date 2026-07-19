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

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced || typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisible(true);
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
    const hiddenTransform = `translate${horizontal ? "X" : "Y"}(${sign * distance}px)`;

    const revealStyle: CSSProperties = {
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : hiddenTransform,
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: "opacity, transform",
        ...style,
    };

    return (
        <div ref={ref} className={className} style={revealStyle} {...props}>
            {children}
        </div>
    );
}
