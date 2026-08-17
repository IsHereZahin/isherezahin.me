"use client";

import MotionPopup from "@/components/motion/MotionPopup";
import { useI18n } from "@/i18n/DictionaryProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { useEffect, useRef } from "react";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    links: readonly { key: keyof Dictionary["nav"]; href: string; icon: React.ReactNode }[];
}

export default function MobileNav({ isOpen, onClose, buttonRef, links }: Readonly<MobileNavProps>) {
    const { dict, path: localeHref } = useI18n();
    const navRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const isActiveLink = (href: string) => {
        const target = localeHref(href);
        if (href === "/") return pathname === target;
        return pathname.startsWith(target);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node) &&
                !buttonRef.current?.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
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
                                    href={localeHref(link.href)}
                                    prefetch
                                    onClick={onClose}
                                    className={`relative cursor-pointer rounded-sm px-2 py-1.5 text-xs sm:text-sm flex items-center gap-3 sm:gap-4 w-full transition-colors ${isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-foreground hover:bg-foreground/30"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{dict.nav[link.key]}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </MotionPopup>
    );
}