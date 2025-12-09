"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { X } from "lucide-react";
import { useState } from "react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { loginWithProvider } = useAuth();
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleLogin = async (provider: "github" | "google") => {
        setLoadingProvider(provider);
        try {
            await loginWithProvider(provider);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoadingProvider(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-background border border-border rounded-xl p-6 shadow-xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Choose your preferred login method
                    </p>
                </div>


                {/* Login buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleLogin("github")}
                        disabled={loadingProvider !== null}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <SiGithub className="h-5 w-5" />
                        <span className="font-medium">
                            {loadingProvider === "github" ? "Connecting..." : "Continue with GitHub"}
                        </span>
                    </button>

                    <button
                        onClick={() => handleLogin("google")}
                        disabled={loadingProvider !== null}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <SiGoogle className="h-5 w-5" />
                        <span className="font-medium">
                            {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
                        </span>
                    </button>
                </div>

                {/* Footer note */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                    Note: Guestbook interactions require GitHub login
                </p>
            </div>
        </div>
    );
}
