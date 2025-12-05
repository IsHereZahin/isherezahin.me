"use client"

import { Toaster } from "@/components/ui"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import AuthProvider from "./AuthProvider"

const queryClient = new QueryClient()

interface ProviderIndexProps {
    children: ReactNode
}

export default function ProviderIndex({ children }: Readonly<ProviderIndexProps>) {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Toaster />
                {children}
            </QueryClientProvider>
        </AuthProvider>
    )
}
