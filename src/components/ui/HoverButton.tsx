"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

export interface HoverButtonProps {
    href: string;
    title: string;
}

export default function HoverButton({ href, title }: Readonly<HoverButtonProps>) {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCursorPos({ x, y });
    };

    const buttonBgColor = isDark ? '#242424' : '#f8f9fa';
    const radialStart = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const radialEnd = isDark ? 'rgba(40, 40, 40, 1)' : 'rgba(255, 255, 255, 1)';
    const glowColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)';
    const gradientBg = isDark
        ? "linear-gradient(to bottom right, rgba(23, 23, 23, 0.7) 0%, #525252 62%, rgba(23, 23, 23, 0.7) 100%)"
        : "linear-gradient(to bottom right, rgba(255, 255, 255, 0.7) 0%, #e5e7eb 62%, rgba(255, 255, 255, 0.7) 100%)";

    return (
        <a
            href={href}
            className="shadow-feature-card relative group px-6 py-3 rounded-xl backdrop-blur-sm border border-transparent inline-flex items-center gap-3 supports-safari:[&_.glass-icon]:backdrop-blur-[0px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            style={{
                "--cursorX": `${cursorPos.x}px`,
                "--cursorY": `${cursorPos.y}px`
            } as React.CSSProperties}
            onMouseMove={handleMouseMove}
        >
            <div className="pointer-events-none select-none isolate absolute inset-0 z-[-1] overflow-hidden rounded-[inherit] group-active:opacity-80 transition-opacity">
                <div
                    className="absolute top-0 left-0 w-[200%] h-[400%]"
                    style={{
                        background: `radial-gradient(${glowColor}, transparent 40%)`,
                        opacity: 0.7,
                        transform: `translateX(calc(var(--cursorX) - 50%)) translateY(calc(var(--cursorY) - 50%)) scale(1.7) rotate(-45deg) translateZ(0)`,
                    }}
                />
            </div>
            <div
                className="pointer-events-none select-none absolute inset-[-1px] p-px composite-exclude group-active:opacity-80 transition-opacity overflow-hidden"
                style={{ borderRadius: "13px" }}
            >
                <div
                    className="w-[250px] h-[650px]"
                    style={{
                        transform: `translate(calc(var(--cursorX) - 50%), calc(var(--cursorY) - 50%)) rotate(80deg)`,
                        background: `${buttonBgColor} radial-gradient(ellipse at center center, ${radialStart}, ${radialEnd} 22%)`,
                    }}
                />
            </div>
            <span className="relative z-10 text-foreground font-medium">{title}</span>
            <div
                className="isolate before:transition-opacity glass-icon size-6 rounded-lg flex items-center justify-center relative bg-white/5 dark:bg-black/5 backdrop-blur-sm z-10"
                style={{
                    "--borderWidth": 1,
                    "--background": gradientBg,
                    border: "1px solid transparent",
                } as React.CSSProperties}
            >
                <ArrowDown className="lucide lucide-arrow-down size-[70%] transition-transform group-hover:translate-y-0.5 text-foreground" />
            </div>
        </a>
    );
}