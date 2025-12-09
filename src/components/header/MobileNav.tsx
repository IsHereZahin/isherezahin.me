"use client";

import MotionPopup from "@/components/motion/MotionPopup";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    links: { key: string; href: string; icon: React.ReactNode }[];
}

export default function MobileNav({ isOpen, onClose, buttonRef, links }: Readonly<MobileNavProps>) {
    const navRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const isActiveLink = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node) &&
                !buttonRef.current?.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;

    return (
        <MotionPopup
            isOpen={isOpen}
            className="md:hidden absolute top-full right-10 z-50 min-w-40 bg-background/80 p-1 shadow-featured-card rounded-md"
        >
            <div ref={navRef}>
                <ul className="flex flex-col">
                    {links.map((link) => {
                        const isActive = isActiveLink(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`relative cursor-pointer rounded-sm px-2 py-1.5 text-xs sm:text-sm flex items-center gap-3 sm:gap-4 w-full transition-colors ${isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-foreground hover:bg-foreground/30"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.key}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </MotionPopup>
    );
}