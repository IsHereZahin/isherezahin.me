"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CARD } from "./primitives";
import { fmtCompact, fmtFull, type TrendPoint } from "./useOverview";

const COLOR_TOTAL = "#EE5D4A"; // coral — Total Visits (filled area)
const COLOR_UNIQUE = "var(--s-text)"; // ink — Unique Visitors (reference line); flips in dark

const shortDate = (v: string) => new Date(v + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
const longDate = (v: string) => new Date(v + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" });

function TrendTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: { dataKey?: string | number; value?: number | string }[];
    label?: string | number;
}) {
    if (!active || !payload?.length) return null;
    const get = (k: string) => payload.find((p) => p.dataKey === k)?.value ?? 0;
    return (
        <div className="rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <p className="mb-1.5 text-[11px] font-medium text-[var(--s-muted)]">{longDate(String(label))}</p>
            <Row color={COLOR_TOTAL} label="Total visits" value={Number(get("visitors"))} />
            <Row color={COLOR_UNIQUE} label="Unique" value={Number(get("uniqueVisitors"))} />
        </div>
    );
}

function Row({ color, label, value }: { color: string; label: string; value: number }) {
    return (
        <div className="flex items-center gap-2 py-0.5 text-[12px]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[var(--s-text2)]">{label}</span>
            <span className="ml-auto font-semibold text-[var(--s-text)]">{fmtFull(value)}</span>
        </div>
    );
}

function LegendDot({ color, label, filled }: { color: string; label: string; filled?: boolean }) {
    return (
        <span className="flex items-center gap-1.5 text-[12px] text-[var(--s-text2)]">
            <span
                className="h-2.5 w-2.5 rounded-full"
                style={filled ? { backgroundColor: color } : { border: `2px solid ${color}` }}
            />
            {label}
        </span>
    );
}

export default function VisitorTrendsCard({ trend }: { trend: TrendPoint[] }) {
    const hasData = trend.length > 0 && trend.some((d) => d.visitors > 0 || d.uniqueVisitors > 0);
    const periodTotal = trend.reduce((s, d) => s + d.visitors, 0);
    const periodUnique = trend.reduce((s, d) => s + d.uniqueVisitors, 0);
    const peak = trend.reduce((m, d) => Math.max(m, d.visitors), 0);

    return (
        <div className={`${CARD} flex flex-col`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EE5D4A]/12">
                        <TrendingUp className="h-5 w-5 text-[#EE5D4A]" />
                    </span>
                    <div>
                        <h3 className="text-[16px] font-semibold text-[var(--s-text)]">Visitor Trends</h3>
                        <p className="mt-0.5 text-[13px] text-[var(--s-muted)]">Traffic over the last 30 days</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <LegendDot color={COLOR_TOTAL} label="Total visits" filled />
                    <LegendDot color={COLOR_UNIQUE} label="Unique" />
                </div>
            </div>

            {/* Period summary */}
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                <Metric label="Total visits (30d)" value={fmtFull(periodTotal)} />
                <Metric label="Unique visitors" value={fmtFull(periodUnique)} />
                <Metric label="Peak day" value={fmtFull(peak)} />
            </div>

            {hasData ? (
                <div className="mt-5 h-[220px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trend} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                            <defs>
                                <linearGradient id="dashTotalFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COLOR_TOTAL} stopOpacity={0.22} />
                                    <stop offset="100%" stopColor={COLOR_TOTAL} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--s-border-soft)" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                minTickGap={28}
                                tick={{ fill: "var(--s-muted)", fontSize: 11 }}
                                tickFormatter={shortDate}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={42}
                                tick={{ fill: "var(--s-muted)", fontSize: 11 }}
                                tickFormatter={(v) => fmtCompact(Number(v))}
                                allowDecimals={false}
                            />
                            <Tooltip cursor={{ stroke: "var(--s-border)", strokeWidth: 1 }} content={<TrendTooltip />} />
                            <Area
                                dataKey="visitors"
                                type="monotone"
                                stroke={COLOR_TOTAL}
                                strokeWidth={2}
                                fill="url(#dashTotalFill)"
                                activeDot={{ r: 4, fill: COLOR_TOTAL, stroke: "var(--s-card)", strokeWidth: 2 }}
                            />
                            <Area
                                dataKey="uniqueVisitors"
                                type="monotone"
                                stroke={COLOR_UNIQUE}
                                strokeWidth={2}
                                fill="none"
                                activeDot={{ r: 4, fill: COLOR_UNIQUE, stroke: "var(--s-card)", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="mt-5 flex h-[220px] items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                    <p className="text-[13px] text-[var(--s-muted)]">No visitor data recorded yet.</p>
                </div>
            )}
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-[20px] font-bold leading-none text-[var(--s-text)]">{value}</div>
            <div className="mt-1 text-[12px] text-[var(--s-muted)]">{label}</div>
        </div>
    );
}
