// Most of the design is from @nelsonlaidev and @theodorusclarence
// ui concept | component - Thanks to @nelsonlaidev and @theodorusclarence
// Source: https://github.com/nelsonlaidev & https://theodorusclarence.com
// Modified by: Zahin Mohammad

"use client";

import { HEADER_LINKS } from "@/config/links";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import HeaderActions from "../header/HeaderActions";
import MobileNav from "../header/MobileNav";
import MotionWrapper from "../motion/MotionWrapper";
import Logo from "../ui/Logo";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const controlHeader = useCallback(() => {
        if (typeof window !== "undefined") {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 50 && !isMenuOpen) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        }
    }, [isMenuOpen]);

    useEffect(() => {
        window.addEventListener("scroll", controlHeader, { passive: true });
        return () => window.removeEventListener("scroll", controlHeader);
    }, [controlHeader]);

    return (
        <MotionWrapper direction="top" delay={0.2}>
            <header
                className={`fixed inset-x-0 top-4 z-40 mx-auto flex h-[60px] max-w-5xl items-center justify-between rounded-2xl bg-background/30 px-4 sm:px-8 shadow-xs saturate-100 backdrop-blur-[10px] transition-all duration-300 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
                    }`}
            >
                <Link href="/" className="flex items-center justify-center gap-1 text-foreground font-medium" aria-label="Home">
                    <Logo size={20} type="header" />
                </Link>

                <div className="flex items-center gap-2">
                    <nav className="hidden md:block">
                        <ul className="flex gap-1">
                            {HEADER_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-secondary-foreground hover:text-foreground capitalize"
                                    >
                                        {link.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <HeaderActions />

                    <button
                        ref={buttonRef}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-foreground cursor-pointer shrink-0 gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 has-[>svg]:px-3 flex size-9 items-center justify-center p-0 md:hidden"
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                    </button>
                </div>

                <MobileNav
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    buttonRef={buttonRef}
                />
            </header>

            <div className="pt-20" id="skip-nav" />
        </MotionWrapper>
    );
}