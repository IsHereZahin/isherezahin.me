"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/** Standard white dashboard card shell (matches the rest of the admin panel). */
export const CARD = "rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

export function SectionHeader({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
                <h2 className="text-[15px] font-semibold tracking-tight text-[#26262B]">{title}</h2>
                <p className="mt-0.5 text-[13px] text-[#9a978f]">{subtitle}</p>
            </div>
            {action}
        </div>
    );
}

/** Small trend pill: green when up, coral when down. */
export function DeltaChip({ dir, pct, label = "vs last week" }: { dir: "up" | "down"; pct: number; label?: string }) {
    const up = dir === "up";
    const Icon = up ? ArrowUpRight : ArrowDownRight;
    return (
        <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                up ? "bg-green-50 text-green-600" : "bg-[#EE5D4A]/10 text-[#EE5D4A]"
            }`}
            title={`${up ? "+" : "-"}${pct}% ${label}`}
        >
            <Icon className="h-3 w-3" />
            {pct}%
        </span>
    );
}

/** A generic error tile scoped to a single dashboard section. */
export function SectionError({ label, onRetry }: { label: string; onRetry: () => void }) {
    return (
        <div className={`${CARD} flex flex-col items-center justify-center py-12 text-center`}>
            <p className="text-[14px] font-semibold text-[#26262B]">{label}</p>
            <p className="mt-1 max-w-md text-[13px] text-[#9a978f]">Something went wrong loading this data.</p>
            <button
                onClick={onRetry}
                className="mt-4 rounded-full bg-[#26262B] px-5 py-2 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
            >
                Retry
            </button>
        </div>
    );
}
