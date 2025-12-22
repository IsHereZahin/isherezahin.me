"use client";

import LoginModal from "@/components/auth/LoginModal";
import { MY_MAIL } from "@/lib/constants";
import { AuthContext } from "@/lib/contexts";
import { AuthContextType } from "@/lib/github/types";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Main AuthProvider
export default function AuthProvider({ children }: { readonly children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProviderInner>{children}</AuthProviderInner>
        </SessionProvider>
    );
}

// Inner AuthProvider for SessionProvider
function AuthProviderInner({ children }: { readonly children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Check if session is revoked (expired date in the past or no user id)
    useEffect(() => {
        if (session && status === "authenticated") {
            const isRevoked =
                (session.expires && new Date(session.expires) < new Date()) ||
                !session.user?.id;

            if (isRevoked) {
                signOut({ redirect: true, callbackUrl: "/" });
            }
        }
    }, [session, status]);

    const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
    const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

    const login = useCallback(() => {
        openLoginModal();
    }, [openLoginModal]);

    const loginWithProvider = useCallback(async (provider: "github" | "google") => {
        closeLoginModal();
        await signIn(provider);
    }, [closeLoginModal]);

    const logout = useCallback(async () => {
        // Update presence to offline before signing out
        try {
            await fetch("/api/chat/presence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isOnline: false }),
            });
        } catch {
            // Ignore errors, proceed with logout
        }
        signOut();
    }, []);

    const isAdmin = session?.user?.email?.toLowerCase() === MY_MAIL.toLowerCase();
    const isGitHubUser = session?.user?.provider === "github";

    const value: AuthContextType = useMemo(
        () => ({
            user: session?.user || null,
            status,
            login,
            loginWithProvider,
            logout,
            isAdmin,
            isGitHubUser,
            openLoginModal,
            closeLoginModal,
            isLoginModalOpen,
        }),
        [session, status, login, loginWithProvider, logout, isAdmin, isGitHubUser, openLoginModal, closeLoginModal, isLoginModalOpen]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </AuthContext.Provider>
    );
}
