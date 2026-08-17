"use client";

import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminTopBar from "@/components/admin/dashboard/AdminTopBar";
import PublicVaultShell from "@/components/admin/vault/PublicVaultShell";
import PageTransition from "@/components/motion/PageTransition";
import { AuthContext } from "@/lib/contexts";
import { useAuth } from "@/lib/hooks/useAuth";
import { applyMode, resolveInitialMode, setMode, subscribeToMode } from "@/lib/theme";
import { Poppins } from "next/font/google";
import { ReactNode, useEffect, useMemo, useState } from "react";

// Matches the reference dashboard typography.
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

type Mode = "light" | "dark";

export default function AdminShell({
    children,
    initialIsAdmin,
}: {
    readonly children: ReactNode;
    /**
     * Resolved on the server from the session cookie, so the panel knows which
     * surface to render on its first paint.
     */
    readonly initialIsAdmin: boolean;
}) {
    const auth = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    // Mirrors the shared preference for the top-bar toggle icon.
    const [mode, setLocalMode] = useState<Mode>("light");

    // Server answer until the client session resolves.
    const isAdmin = auth.status === "loading" ? initialIsAdmin : auth.isAdmin;

    // Re-provide isAdmin so admin queries can start on mount.
    const authValue = useMemo(
        () => (auth.isAdmin === isAdmin ? auth : { ...auth, isAdmin }),
        [auth, isAdmin]
    );

    // Shares the public dark/light preference. data-admin scopes the surface tokens.
    useEffect(() => {
        const initial = resolveInitialMode();
        applyMode(initial);
        setLocalMode(initial);
        document.body.setAttribute("data-admin", "true");

        // Follow changes made elsewhere (another tab) without a reload.
        const unsubscribe = subscribeToMode((next) => {
            applyMode(next);
            setLocalMode(next);
        });

        return () => {
            document.body.removeAttribute("data-admin");
            unsubscribe();
        };
    }, []);

    const toggleMode = () => {
        const next: Mode = mode === "light" ? "dark" : "light";
        setLocalMode(next);
        setMode(next);
    };

    // Non-admins only ever see the Personal Vault screen.
    const content = isAdmin ? (
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
    ) : (
        <PublicVaultShell />
    );

    return (
        <AuthContext.Provider value={authValue}>
            <div
                className={`${poppins.className} h-dvh w-full overflow-hidden`}
                style={{ backgroundColor: "var(--s-page)", color: "var(--s-text)" }}
            >
                {content}
            </div>
        </AuthContext.Provider>
    );
}
