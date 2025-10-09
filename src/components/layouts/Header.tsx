"use client";

import { HEADER_LINKS } from '@/config/links';
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import HeaderActions from "../HeaderActions";
import Logo from '../ui/Logo';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <header className="fixed inset-x-0 top-4 z-40 mx-auto flex h-[60px] max-w-5xl items-center justify-between rounded-2xl bg-background/30 px-4 sm:px-8 shadow-xs saturate-100 backdrop-blur-[10px] transition-colors">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-1 text-foreground font-medium"
                    aria-label="Home"
                >
                    <Logo size={30} type="header" />
                </Link>

                <div className="flex items-center gap-2">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex gap-2">
                            {HEADER_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground capitalize"
                                    >
                                        {link.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Header Actions */}
                    <HeaderActions />

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="shrink-0 gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 has-[>svg]:px-3 flex size-9 items-center justify-center p-0 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-x-0 top-[84px] z-30 bg-background/95 backdrop-blur-sm border-b border-border/50">
                    <nav className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
                        <ul className="flex flex-col gap-2">
                            {HEADER_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground capitalize"
                                    >
                                        {link.key}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-2 border-t border-border">
                            🚀 Ready to collaborate? <a href="https://github.com/IsHereZahin/isherezahin.dev" target='_blank' className="text-primary font-medium hover:underline">Get in touch</a>
                        </div>
                    </nav>
                </div>
            )}

            {/* Spacer for fixed header */}
            <div className="pt-20" id="skip-nav" />
        </>
    );
}