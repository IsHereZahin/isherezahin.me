"use client";

import { ExternalLink } from "lucide-react";
import type { GitHubData } from "./useGitHub";

const R = 44;
const CIRC = 2 * Math.PI * R;

const fmt = (n: number) => n.toLocaleString("de-DE");
const niceCeil = (n: number, step: number) => Math.max(step, Math.ceil((n + 1) / step) * step);

function StatRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
    return (
        <div className={`flex items-center justify-between py-2.5 ${last ? "" : "border-b border-[var(--s-border-soft)]"}`}>
            <span className="text-[13px] text-[var(--s-muted)]">{label}</span>
            <span className="text-[14px] font-semibold text-[var(--s-text)]">{value}</span>
        </div>
    );
}

export default function ActivityCard({ data }: { data: GitHubData }) {
    const days = data.contributions.days;
    const total = data.contributions.total;
    const goal = niceCeil(total, 500);
    const progress = Math.min(total / goal, 1);

    let best = 0;
    let active = 0;
    let longest = 0;
    let run = 0;
    for (const d of days) {
        if (d.count > 0) {
            active += 1;
            run += 1;
            if (run > longest) longest = run;
        } else {
            run = 0;
        }
        if (d.count > best) best = d.count;
    }

    return (
        <div className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-[16px] font-semibold text-[var(--s-text)]">Yearly Activity</h3>
                    <p className="mt-0.5 text-[13px] text-[var(--s-muted)]">Your contributions this year</p>
                </div>
                <a
                    href={data.profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--s-border)] bg-[var(--s-card)] px-3.5 text-[12px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                >
                    Profile <ExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>

            <div className="mt-4 flex items-center gap-5">
                {/* Contribution ring */}
                <div className="relative h-[116px] w-[116px] shrink-0">
                    <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
                        <defs>
                            <linearGradient id="actGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="55%" stopColor="#F97316" />
                                <stop offset="100%" stopColor="#EF4444" />
                            </linearGradient>
                        </defs>
                        <circle cx="55" cy="55" r={R} fill="none" stroke="var(--s-track)" strokeWidth="10" />
                        <circle
                            cx="55"
                            cy="55"
                            r={R}
                            fill="none"
                            stroke="url(#actGauge)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={CIRC}
                            strokeDashoffset={CIRC * (1 - progress)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[22px] font-bold leading-none text-[var(--s-text)]">{fmt(total)}</span>
                        <span className="mt-1 text-[10px] text-[var(--s-muted)]">this year</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="min-w-0 flex-1">
                    <StatRow label="Best day" value={fmt(best)} />
                    <StatRow label="Active days" value={fmt(active)} />
                    <StatRow label="Longest streak" value={`${longest} ${longest === 1 ? "day" : "days"}`} last />
                </div>
            </div>
        </div>
    );
}
