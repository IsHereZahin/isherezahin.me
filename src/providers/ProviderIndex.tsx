"use client";

import BannedUserCheck from "@/components/auth/BannedUserCheck";
import { Toaster } from "@/components/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense, useState } from "react";
import AuthProvider from "./AuthProvider";
import { ChatProvider } from "./ChatProvider";

interface ProviderIndexProps {
    children: ReactNode;
}

export default function ProviderIndex({
    children,
}: Readonly<ProviderIndexProps>) {
    // One client per browser session. Sensible caching defaults so navigating
    // between pages reuses data instead of refetching every mount, and tab
    // refocus doesn't trigger a network storm. Per-query staleTime still wins.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5,
                        gcTime: 1000 * 60 * 30,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Toaster />
                <Suspense fallback={null}>
                    <BannedUserCheck />
                </Suspense>
                <ChatProvider>
                    {children}
                </ChatProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
}
