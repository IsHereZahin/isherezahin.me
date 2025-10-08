"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { forwardRef, useRef, useState, useCallback } from "react";

export interface CustomLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    variant?: "primary" | "secondary" | "underline" | "button";
}

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
    (
        { href, children, className = "", target = "_self", rel = "", onClick, variant = "underline" },
        ref
    ) => {
        const internalRef = useRef<HTMLAnchorElement>(null);
        const [vPosition, setVPosition] = useState<'top' | 'bottom'>('top');
        const [hShift, setHShift] = useState(0);

        const handleMouseEnter = useCallback(() => {
            if (!internalRef.current) return;
            const rect = internalRef.current.getBoundingClientRect();
            const tooltipHeight = 50;
            const margin = 12;
            setVPosition(rect.top < tooltipHeight + margin ? 'bottom' : 'top');

            const tooltipWidth = 320;
            const halfLinkWidth = rect.width / 2;
            const centerX = rect.left + halfLinkWidth;
            const halfTooltipWidth = tooltipWidth / 2;
            const preferredLeft = centerX - halfTooltipWidth;
            let shift = 0;
            const edgeMargin = 8;
            if (preferredLeft < edgeMargin) {
                shift = edgeMargin - preferredLeft;
            } else {
                const preferredRight = preferredLeft + tooltipWidth;
                if (preferredRight > window.innerWidth - edgeMargin) {
                    shift = window.innerWidth - edgeMargin - preferredRight;
                }
            }
            setHShift(shift);
        }, []);

        const vClasses = vPosition === 'top'
            ? 'bottom-full mb-3 group-hover:-translate-y-2'
            : 'top-full mt-3 group-hover:translate-y-2';

        const arrowVClasses = vPosition === 'top'
            ? 'border-t-background/95 border-b-transparent'
            : 'border-b-background/95 border-t-transparent';

        const arrowVPos = vPosition === 'top' ? 'bottom-0' : 'top-0';

        const transformStyle = { transform: `translateX(calc(-50% + ${hShift}px))` };

        const baseClasses = "relative inline-flex items-center group";
        const variantClasses = {
            primary: "text-primary hover:text-primary/80 font-medium transition-colors duration-200",
            secondary: "text-secondary-foreground hover:text-foreground font-medium transition-colors duration-200",
            underline: "text-foreground hover:underline transition-colors duration-200",
            button: "px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:shadow-lg active:shadow-sm transform active:scale-95 transition-all duration-200 border border-transparent hover:border-primary/20"
        }[variant] || "";

        return (
            <span className={`${baseClasses} ${variantClasses} ${className}`} onMouseEnter={handleMouseEnter}>
                <Link
                    ref={(node) => {
                        internalRef.current = node;
                        if (ref) {
                            if (typeof ref === 'function') {
                                ref(node);
                            } else if (ref) {
                                ref.current = node;
                            }
                        }
                    }}
                    href={href}
                    target={target}
                    rel={rel}
                    onClick={onClick}
                    className="relative z-10"
                >
                    {children}
                </Link>
                <div
                    className={`absolute left-1/2 px-4 py-2.5 bg-background/95 text-foreground/80 text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 pointer-events-none border border-border/50 backdrop-blur-md transition-all duration-300 ease-out ${vClasses} max-w-xs`}
                    style={transformStyle}
                >
                    <span className="flex items-center gap-2">
                        <span className="truncate font-medium">{href}</span>
                        <ExternalLink className="size-3 flex-shrink-0 text-muted-foreground" />
                    </span>
                    <div
                        className={`absolute left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-b-4 border-transparent ${arrowVClasses} ${arrowVPos} -z-10`}
                        style={transformStyle}
                    ></div>
                </div>
            </span>
        );
    }
);

CustomLink.displayName = "CustomLink";

export default CustomLink;