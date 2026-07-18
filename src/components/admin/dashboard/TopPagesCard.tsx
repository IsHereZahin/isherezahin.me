"use client";

import { FileText } from "lucide-react";
import { CARD } from "./primitives";
import { fmtFull, type StatisticsData } from "./useOverview";

const prettyPath = (p: string) => (p === "/" ? "Home" : p);

export default function TopPagesCard({ stats }: { stats: StatisticsData }) {
    const pages = (stats.pathStats ?? []).slice(0, 7);
    const max = pages.reduce((m, p) => Math.max(m, p.count), 0) || 1;

    return (
        <div className={`${CARD} flex flex-1 flex-col`}>
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--s-soft)]">
                    <FileText className="h-5 w-5 text-[var(--s-text2)]" />
                </span>
                <div>
                    <h3 className="text-[16px] font-semibold text-[var(--s-text)]">Top Pages</h3>
                    <p className="mt-0.5 text-[13px] text-[var(--s-muted)]">Most visited routes</p>
                </div>
            </div>

            {pages.length === 0 ? (
                <p className="flex flex-1 items-center justify-center py-10 text-[13px] text-[var(--s-muted)]">
                    No page views recorded yet.
                </p>
            ) : (
                <div className="mt-4 flex flex-col gap-3">
                    {pages.map((p, i) => (
                        <div key={`${p.path}-${i}`} className="flex items-center gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--s-soft)] text-[11px] font-semibold text-[var(--s-muted)]">
                                {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <span className="truncate text-[13px] font-medium text-[var(--s-text)]" title={p.path}>
                                        {prettyPath(p.path)}
                                    </span>
                                    <span className="shrink-0 text-[12px] tabular-nums text-[var(--s-muted)]">{fmtFull(p.count)}</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--s-track)]">
                                    <div
                                        className="h-full rounded-full bg-[#F4C63D]"
                                        style={{ width: `${Math.max((p.count / max) * 100, 4)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
