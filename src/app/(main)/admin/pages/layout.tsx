"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TABS = [
    { href: "/admin/pages/home", label: "Home" },
    { href: "/admin/pages/about", label: "About" },
    { href: "/admin/pages/legal", label: "Legal" },
];

export default function PagesLayout({ children }: { readonly children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="space-y-5">
            {/* Sub-navigation between the editable site pages */}
            <div className="inline-flex rounded-full border border-[#EEEAE2] bg-white p-1">
                {TABS.map((tab) => {
                    const active = pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium transition-colors ${active ? "bg-[#26262B] text-white" : "text-[#57544e] hover:text-[#26262B]"}`}
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
