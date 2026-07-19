"use client";

import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminTopBar from "@/components/admin/dashboard/AdminTopBar";
import PublicVaultShell from "@/components/admin/vault/PublicVaultShell";
import PageTransition from "@/components/motion/PageTransition";
import { useAuth } from "@/lib/hooks/useAuth";
import { Poppins } from "next/font/google";
import { ReactNode, useEffect, useState } from "react";

// Matches the reference dashboard typography.
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

type Mode = "light" | "dark";

export default function AdminLayout({ children }: { readonly children: ReactNode }) {
    const { isAdmin, status } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("light");

    // The admin panel keeps its OWN theme preference and defaults to LIGHT, so it
    // always opens in the original light design. Dark mode is strictly opt-in via
    // the top-bar toggle — it is never inferred from the OS and is kept separate
    // from the public site's theme. We also mark <body data-admin> so the surface
    // tokens (globals.css) reach the panel *and* Radix content that portals
    // outside this layout (Selects, dialogs, toasts).
    useEffect(() => {
        const root = document.documentElement;
        const saved = localStorage.getItem("admin-theme") as Mode | null;
        const initial: Mode = saved === "dark" ? "dark" : "light";
        root.classList.toggle("dark", initial === "dark");
        setMode(initial);
        document.body.setAttribute("data-admin", "true");
        return () => {
            document.body.removeAttribute("data-admin");
            // Restore the public site's own theme when leaving the admin panel.
            root.classList.toggle("dark", localStorage.getItem("mode") === "dark");
        };
    }, []);

    const toggleMode = () => {
        setMode((prev) => {
            const next: Mode = prev === "light" ? "dark" : "light";
            document.documentElement.classList.toggle("dark", next === "dark");
            localStorage.setItem("admin-theme", next);
            return next;
        });
    };

    let content: ReactNode;

    if (status === "loading") {
        // Session is still resolving — avoid flashing either surface.
        content = (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--s-text)] border-t-transparent" />
            </div>
        );
    } else if (!isAdmin) {
        // Not the admin: the entire admin dashboard is blocked. Non-admins (and
        // anonymous visitors) only ever see the Personal Vault access screen, and
        // — once unlocked — the vault contents. No admin routes, layout, or nav.
        content = <PublicVaultShell />;
    } else {
        // Authenticated admin: the full dashboard.
        content = (
            <div className="flex h-full w-full">
                <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
                <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <div className="shrink-0 px-4 pt-5 md:px-8 md:pt-7">
                        <AdminTopBar onOpenMenu={() => setMobileOpen(true)} mode={mode} onToggleMode={toggleMode} />
                    </div>
                    <div className="pretty-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 md:px-8 md:pb-7">
                        <PageTransition>{children}</PageTransition>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div
            className={`${poppins.className} h-dvh w-full overflow-hidden`}
            style={{ backgroundColor: "var(--s-page)", color: "var(--s-text)" }}
        >
            {content}
        </div>
    );
}
