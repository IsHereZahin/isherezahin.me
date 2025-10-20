"use client";

import { AuthContext, AuthContextType } from "@/lib/contexts";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { useMemo } from "react";

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

    const login = () => signIn("github");
    const logout = () => signOut();

    const value: AuthContextType = useMemo(
        () => ({
            user: session?.user || null,
            status,
            login,
            logout,
        }),
        [session, status]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}