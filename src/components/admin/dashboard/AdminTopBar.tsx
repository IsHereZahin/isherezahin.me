"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { ArrowUpRight, Menu, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { D } from "./palette";

interface Header {
    title: string;
    subtitle: string;
    action: { label: string; href: string };
}

function getHeader(path: string, firstName: string): Header {
    const viewSite = { label: "View Site", href: "/" };
    const dashboard: Header = {
        title: `Hi, ${firstName}!`,
        subtitle: "Welcome back — here's what's happening today",
        action: viewSite,
    };
    if (path === "/admin") return dashboard;
    if (path.startsWith("/admin/users")) return { title: "Users", subtitle: "Manage and moderate registered users", action: viewSite };
    if (path.startsWith("/admin/chat")) return { title: "Live Chat", subtitle: "Chat with your visitors in real time", action: viewSite };
    if (path.startsWith("/admin/subscribers")) return { title: "Subscribers", subtitle: "Your newsletter audience", action: viewSite };
    if (path.startsWith("/admin/statistics")) return { title: "Statistics", subtitle: "Control what visitors can see on your public statistics page", action: { label: "View Statistics", href: "/statistics" } };
    if (path.startsWith("/admin/vault")) return { title: "Vault", subtitle: "Your private links, notes, files, and credentials", action: viewSite };
    if (path.startsWith("/admin/settings")) return { title: "Settings", subtitle: "Manage authentication, notifications, and access across your site", action: viewSite };
    if (path.startsWith("/admin/pages/home")) return { title: "Home Page", subtitle: "Edit the testimonials and contact info on your home page", action: { label: "View Home", href: "/" } };
    if (path.startsWith("/admin/pages/about")) return { title: "About Page", subtitle: "Manage your work experience, education, and skills", action: { label: "View About", href: "/about" } };
    if (path.startsWith("/admin/pages/legal")) return { title: "Legal Pages", subtitle: "Manage your Privacy Policy and Terms of Service pages", action: viewSite };
    if (path.startsWith("/admin/pages")) return { title: "Pages", subtitle: "Edit the content of your site pages", action: viewSite };
    return dashboard;
}

export default function AdminTopBar({
    onOpenMenu,
    mode,
    onToggleMode,
}: {
    onOpenMenu: () => void;
    mode: "light" | "dark";
    onToggleMode: () => void;
}) {
    const { user } = useAuth();
    const pathname = usePathname();
    const firstName = user?.name?.split(" ")[0] || "Admin";
    const { title, subtitle, action } = getHeader(pathname, firstName);

    return (
        <header className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    onClick={onOpenMenu}
                    aria-label="Open menu"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--s-card)] text-[var(--s-text)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                    <h1 className="truncate text-[22px] font-bold leading-tight text-[var(--s-text)] md:text-[26px]">
                        {title}
                    </h1>
                    <p className="mt-0.5 truncate text-[13px] text-[var(--s-muted)]">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <label className="hidden h-11 items-center gap-2 rounded-full bg-[var(--s-card)] px-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:flex lg:w-[240px]">
                    <Search className="h-[17px] w-[17px] text-[var(--s-faint)]" />
                    <input
                        type="text"
                        placeholder="Search…"
                        className="w-full bg-transparent text-[13px] text-[var(--s-text)] outline-none placeholder:text-[var(--s-faint)]"
                    />
                </label>

                <button
                    onClick={onToggleMode}
                    aria-label="Toggle dark mode"
                    title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--s-card)] text-[var(--s-text)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors hover:bg-[var(--s-soft)]"
                >
                    {mode === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </button>

                <Link
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: D.dark }}
                >
                    {action.label}
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>
        </header>
    );
}
