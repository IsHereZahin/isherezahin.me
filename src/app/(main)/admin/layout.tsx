"use client";

import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminTopBar from "@/components/admin/dashboard/AdminTopBar";
import { D } from "@/components/admin/dashboard/palette";
import { useAuth } from "@/lib/hooks/useAuth";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

// Matches the reference dashboard typography.
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

// Keep token-based page content on the light (cream) theme regardless of the
// visitor's global light/dark preference, so the whole admin panel stays visually
// consistent with the dashboard shell.
const lightTokens = {
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--primary": "#000000",
    "--primary-foreground": "#ffffff",
    "--ring": "oklch(0.708 0 0)",
    backgroundColor: D.page,
} as React.CSSProperties;

export default function AdminLayout({ children }: { readonly children: ReactNode }) {
    const { user, isAdmin, status } = useAuth();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && !isAdmin) {
            router.push("/");
        }
    }, [status, isAdmin, router]);

    if (status === "loading" || !user || !isAdmin) {
        return (
            <div
                className="flex min-h-screen items-center justify-center"
                style={{ backgroundColor: D.page }}
            >
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#26262B] border-t-transparent" />
            </div>
        );
    }

    return (
        <div
            className={`${poppins.className} flex h-dvh w-full overflow-hidden text-[#26262B]`}
            style={lightTokens}
        >
            <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="shrink-0 px-4 pt-5 md:px-8 md:pt-7">
                    <AdminTopBar onOpenMenu={() => setMobileOpen(true)} />
                </div>
                <div className="pretty-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 md:px-8 md:pb-7">
                    {children}
                </div>
            </main>
        </div>
    );
}
