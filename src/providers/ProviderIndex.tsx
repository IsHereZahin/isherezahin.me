"use client";

import BannedUserCheck from "@/components/auth/BannedUserCheck";
import { Toaster } from "@/components/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import AuthProvider from "./AuthProvider";
import { ChatProvider } from "./ChatProvider";

const queryClient = new QueryClient();

interface ProviderIndexProps {
    children: ReactNode;
}

export default function ProviderIndex({
    children,
}: Readonly<ProviderIndexProps>) {
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
