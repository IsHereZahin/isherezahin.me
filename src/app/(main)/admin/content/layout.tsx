"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TABS = [
    { href: "/admin/content/blogs", label: "Blogs" },
    { href: "/admin/content/projects", label: "Projects" },
    { href: "/admin/content/quests", label: "Side Quests" },
];

export default function ContentLayout({ children }: { readonly children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="space-y-5">
            {/* Sub-navigation between blog and project management */}
            <div className="inline-flex rounded-full border border-[var(--s-border)] bg-[var(--s-card)] p-1">
                {TABS.map((tab) => {
                    const active = pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium transition-colors ${active ? "bg-[var(--s-invert)] text-white" : "text-[var(--s-text2)] hover:text-[var(--s-text)]"}`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {children}
        </div>
    );
}
