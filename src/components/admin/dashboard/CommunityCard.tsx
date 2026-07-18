"use client";

import { UserPlus, Users } from "lucide-react";
import { langColor } from "./palette";
import type { GitHubData } from "./useGitHub";

const fmt = (n: number) => n.toLocaleString("de-DE");

function NetTile({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
    return (
        <div className="rounded-2xl bg-[var(--s-soft)] p-4">
            <Icon className="h-4 w-4 text-[var(--s-muted)]" />
            <div className="mt-2 text-[20px] font-bold leading-none text-[var(--s-text)]">{fmt(value)}</div>
            <div className="mt-1 text-[12px] text-[var(--s-muted)]">{label}</div>
        </div>
    );
}

export default function CommunityCard({ data }: { data: GitHubData }) {
    const { followers, following } = data.profile;
    const langs = data.languages;
    const langSum = langs.reduce((s, l) => s + l.pct, 0) || 1;

    return (
        <div className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold text-[var(--s-text)]">Community</h3>
            <p className="mt-0.5 text-[13px] text-[var(--s-muted)]">Your GitHub network &amp; stack</p>

            {/* Network */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <NetTile icon={Users} value={followers} label="Followers" />
                <NetTile icon={UserPlus} value={following} label="Following" />
            </div>

            {/* Languages */}
            {langs.length > 0 && (
                <div className="mt-5">
                    <p className="mb-2 text-[12px] font-medium text-[var(--s-text2)]">Most used languages</p>
                    <div className="flex h-2.5 overflow-hidden rounded-full">
                        {langs.map((l) => (
                            <div
                                key={l.name}
                                style={{ width: `${(l.pct / langSum) * 100}%`, backgroundColor: langColor(l.name) }}
                                title={`${l.name} · ${l.pct}%`}
                            />
                        ))}
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                        {langs.map((l) => (
                            <span key={l.name} className="flex items-center gap-1.5 text-[11px] text-[var(--s-text2)]">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor(l.name) }} />
                                {l.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
