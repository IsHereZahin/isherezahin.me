"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { SiGithub } from "@icons-pack/react-simple-icons";

interface GitHubSignInButtonProps {
    className?: string;
}

export default function GitHubSignInButton({ className }: Readonly<GitHubSignInButtonProps>) {
    const { loginWithProvider } = useAuth();

    return (
        <button
            type="button"
            onClick={() => loginWithProvider("github")}
            className={`px-5 py-2.5 flex items-center gap-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${className ?? ""}`}
        >
            <SiGithub className="w-4 h-4" />
            <span>Sign in with GitHub</span>
        </button>
    );
}
