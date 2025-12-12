"use client";

import { BASE_DOMAIN } from "@/lib/constants";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";

interface ReferralLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
}

export default function ReferralLink({ href = "", children, ...props }: Readonly<ReferralLinkProps>) {
    const refId = BASE_DOMAIN;
    const separator = href.includes("?") ? "&" : "?";
    const referralHref = `${href}${separator}ref=${encodeURIComponent(refId)}`;

    const internalRef = useRef<HTMLAnchorElement>(null);
    const [vPosition, setVPosition] = useState<"top" | "bottom">("top");
    const [hShift, setHShift] = useState(0);

    const handleMouseEnter = useCallback(() => {
        if (!internalRef.current) return;
        const rect = internalRef.current.getBoundingClientRect();

        // Vertical position
        setVPosition(rect.top < 62 ? "bottom" : "top");

        // Horizontal shift clamped
        const tooltipWidth = internalRef.current.offsetWidth;
        const centerX = rect.left + rect.width / 2;
        const preferredLeft = centerX - tooltipWidth / 2;

        const edgeMargin = 8;
        let shift = 0;

        if (preferredLeft < edgeMargin) shift = edgeMargin - preferredLeft;
        else if (preferredLeft + tooltipWidth > window.innerWidth - edgeMargin)
            shift = window.innerWidth - edgeMargin - (preferredLeft + tooltipWidth);

        setHShift(shift);
    }, []);

    const vClasses = vPosition === "top"
        ? "bottom-full mb-3 group-hover:-translate-y-2"
        : "top-full mt-3 group-hover:translate-y-2";

    const arrowVClasses = vPosition === "top"
        ? "border-t-background/95 border-b-transparent bottom-0"
        : "border-b-background/95 border-t-transparent top-0";

    return (
        <span
            className={`relative inline-flex items-center group ${props.className || ""}`}
            onMouseEnter={handleMouseEnter}
        >
            <Link
                ref={internalRef}
                href={referralHref}
                target="_blank"
                {...props}
                className={`relative z-10 group-hover:text-primary hover:opacity-90 transition-colors ${props.className || ""}`}
            >
                {children}
            </Link>

            {/* Tooltip */}
            <span
                className={`absolute left-1/2 px-4 py-2.5 bg-background/95 text-foreground/80 text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 pointer-events-none border border-border/50 backdrop-blur-md transition-all duration-300 ease-out ${vClasses}`}
                style={{
                    transform: `translateX(calc(-50% + ${hShift}px))`,
                    maxWidth: '90vw'
                }}
            >
                <span className="flex items-center gap-2">
                    <span className="truncate font-medium">{href}</span>
                    <ExternalLink className="size-3 flex-shrink-0 text-muted-foreground" />
                </span>
                <span
                    className={`absolute left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-b-4 border-transparent ${arrowVClasses} -z-10`}
                    style={{ transform: `translateX(calc(-50% + ${hShift}px))` }}
                />
            </span>
        </span>
    );
}
