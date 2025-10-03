"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import HeaderActions from "../HeaderActions";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <a
                href="#skip-nav"
                className="fixed top-4 left-4 -translate-y-20 rounded border bg-background p-2 font-medium shadow transition-transform focus-visible:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                <span className="sr-only">Skip to main content</span>
            </a>
            <header className="fixed inset-x-0 top-4 z-40 mx-auto flex h-[60px] max-w-5xl items-center justify-between rounded-2xl bg-background/30 px-4 sm:px-8 shadow-xs saturate-100 backdrop-blur-[10px] transition-colors">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-1 text-foreground font-medium"
                    aria-label="Home"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        id="z"
                        aria-hidden="true"
                        className="w-10 h-10 text-primary mt-4"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.927 1039.363a1.001 1.001 0 0 0 .102 2h3.984l-4.781 6.402a1 1 0 0 0 .8 1.597h5.98a1 1 0 1 0 0-2H7.028l4.781-6.397a1 1 0 0 0-.8-1.601h-5.98a1 1 0 0 0-.102 0z"
                            fill="currentColor"
                            transform="translate(0 -1036.362)"
                        />
                    </svg>
                    <span className="sr-only">Zahin Mohammad</span>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex gap-2">
                            <li className="relative flex h-[60px] items-center justify-center">
                                <a
                                    href="#about"
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    About
                                </a>
                            </li>
                            <li className="relative flex h-[60px] items-center justify-center">
                                <a
                                    href="#projects"
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Projects
                                </a>
                            </li>
                            <li className="relative flex h-[60px] items-center justify-center">
                                <a
                                    href="#blog"
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Blog
                                </a>
                            </li>
                            <li className="relative flex h-[60px] items-center justify-center">
                                <a
                                    href="#contact"
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Contact
                                </a>
                            </li>
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
                            <li>
                                <a
                                    href="#about"
                                    onClick={toggleMenu}
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#projects"
                                    onClick={toggleMenu}
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#blog"
                                    onClick={toggleMenu}
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    onClick={toggleMenu}
                                    className="rounded-sm px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 pt-2 border-t border-border">
                            🚀 Ready to collaborate? <Link href="/contact" className="text-primary font-medium hover:underline">Let’s connect</Link>.
                        </div>
                    </nav>
                </div>
            )}

            {/* Spacer for fixed header */}
            <div className="pt-20" id="skip-nav" />
        </>
    );
}