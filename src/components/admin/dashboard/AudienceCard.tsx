"use client";

import { Globe, MonitorSmartphone } from "lucide-react";
import { CARD } from "./primitives";
import { fmtFull, type StatisticsData } from "./useOverview";

function BarRow({ label, value, pct, color }: { label: string; value: number; pct: number; color: string }) {
    return (
        <div className="py-2">
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[13px]">
                <span className="truncate font-medium text-[var(--s-text)]">{label}</span>
                <span className="shrink-0 tabular-nums text-[var(--s-muted)]">{fmtFull(value)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--s-track)]">
                <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

function Empty({ label }: { label: string }) {
    return <p className="py-6 text-center text-[12px] text-[var(--s-muted)]">{label}</p>;
}

export default function AudienceCard({ stats }: { stats: StatisticsData }) {
    const devices = (stats.deviceStats ?? []).slice(0, 5);
    const countries = (stats.countryStats ?? []).slice(0, 6);
    const deviceSum = devices.reduce((s, d) => s + d.count, 0) || 1;
    const countryMax = countries.reduce((m, c) => Math.max(m, c.count), 0) || 1;

    return (
        <div className={`${CARD} flex flex-col`}>
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4C63D]/20">
                    <MonitorSmartphone className="h-5 w-5 text-[var(--s-text)]" />
                </span>
                <div>
                    <h3 className="text-[16px] font-semibold text-[var(--s-text)]">Audience</h3>
                    <p className="mt-0.5 text-[13px] text-[var(--s-muted)]">Devices &amp; locations</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                {/* Devices */}
                <div className="min-w-0">
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--s-muted)]">Devices</p>
                    {devices.length === 0 ? (
                        <Empty label="No device data yet." />
                    ) : (
                        <div className="divide-y divide-[var(--s-border-soft)]">
                            {devices.map((d) => (
                                <BarRow
                                    key={d.device}
                                    label={d.device}
                                    value={d.count}
                                    pct={(d.count / deviceSum) * 100}
                                    color="var(--s-text)"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Countries */}
                <div className="mt-4 min-w-0 border-t border-[var(--s-border-soft)] pt-4 sm:mt-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <p className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--s-muted)]">
                        <Globe className="h-3.5 w-3.5" /> Top Countries
                    </p>
                    {countries.length === 0 ? (
                        <Empty label="No location data yet." />
                    ) : (
                        <div className="divide-y divide-[var(--s-border-soft)]">
                            {countries.map((c) => (
                                <BarRow
                                    key={c.country}
                                    label={c.country}
                                    value={c.count}
                                    pct={(c.count / countryMax) * 100}
                                    color="#EE5D4A"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
