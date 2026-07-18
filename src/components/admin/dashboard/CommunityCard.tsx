"use client";

import { UserPlus, Users } from "lucide-react";
import { langColor } from "./palette";
import type { GitHubData } from "./useGitHub";

const fmt = (n: number) => n.toLocaleString("de-DE");

function NetTile({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
    return (
        <div className="rounded-2xl bg-[#F6F4EF] p-4">
            <Icon className="h-4 w-4 text-[#9a978f]" />
            <div className="mt-2 text-[20px] font-bold leading-none text-[#26262B]">{fmt(value)}</div>
            <div className="mt-1 text-[12px] text-[#9a978f]">{label}</div>
        </div>
    );
}

export default function CommunityCard({ data }: { data: GitHubData }) {
    const { followers, following } = data.profile;
    const langs = data.languages;
    const langSum = langs.reduce((s, l) => s + l.pct, 0) || 1;

    return (
        <div className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[16px] font-semibold text-[#26262B]">Community</h3>
            <p className="mt-0.5 text-[13px] text-[#9a978f]">Your GitHub network &amp; stack</p>

            {/* Network */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <NetTile icon={Users} value={followers} label="Followers" />
                <NetTile icon={UserPlus} value={following} label="Following" />
            </div>

            {/* Languages */}
            {langs.length > 0 && (
                <div className="mt-5">
                    <p className="mb-2 text-[12px] font-medium text-[#57544e]">Most used languages</p>
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
                            <span key={l.name} className="flex items-center gap-1.5 text-[11px] text-[#6f6c64]">
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
