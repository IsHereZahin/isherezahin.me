"use client";

import { RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function AdminError({
    error,
    reset,
}: {
    readonly error: Error & { digest?: string };
    readonly reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EE5D4A]/12">
                <RefreshCw className="h-5 w-5 text-[#EE5D4A]" />
            </div>
            <p className="mt-4 text-[16px] font-semibold text-[var(--s-text)]">Something went wrong</p>
            <p className="mt-1 max-w-md text-[13px] text-[var(--s-muted)]">
                {error?.message || "An unexpected error occurred in the admin panel."}
            </p>
            <button
                onClick={reset}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 py-2.5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
            >
                <RefreshCw className="h-4 w-4" />
                Try again
            </button>
        </div>
    );
}
