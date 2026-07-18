"use client";

import { BookOpen, Eye, FolderKanban, Heart, Inbox } from "lucide-react";
import { CARD } from "./primitives";
import { fmtCompact, fmtFull, type OverviewData } from "./useOverview";

type IconType = React.ComponentType<{ className?: string }>;

function MiniStat({ icon: Icon, value, label, sub }: { icon: IconType; value: string; label: string; sub?: string }) {
    return (
        <div className="rounded-2xl bg-[#F6F4EF] p-3.5">
            <Icon className="h-4 w-4 text-[#9a978f]" />
            <div className="mt-2 text-[19px] font-bold leading-none text-[#26262B]">{value}</div>
            <div className="mt-1 text-[12px] text-[#9a978f]">{label}</div>
            {sub && <div className="mt-0.5 text-[11px] text-[#c4c0b7]">{sub}</div>}
        </div>
    );
}

function TypeBadge({ type }: { type: "Blog" | "Project" }) {
    const isBlog = type === "Blog";
    return (
        <span
            className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isBlog ? "bg-[#F4C63D]/20 text-[#8a6d12]" : "bg-[#EE5D4A]/12 text-[#EE5D4A]"
            }`}
        >
            {type}
        </span>
    );
}

export default function ContentPerformanceCard({ overview }: { overview: OverviewData }) {
    const { content, messages } = overview;

    return (
        <div className={`${CARD} flex flex-1 flex-col`}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EE5D4A]/12">
                        <BookOpen className="h-5 w-5 text-[#EE5D4A]" />
                    </span>
                    <div>
                        <h3 className="text-[16px] font-semibold text-[#26262B]">Content Performance</h3>
                        <p className="mt-0.5 text-[13px] text-[#9a978f]">Blogs &amp; projects at a glance</p>
                    </div>
                </div>
            </div>

            {/* Stat grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <MiniStat icon={BookOpen} value={fmtFull(content.blogs.published)} label="Blogs" sub={`${content.blogs.draft} drafts`} />
                <MiniStat icon={FolderKanban} value={fmtFull(content.projects.published)} label="Projects" sub={`${content.projects.draft} drafts`} />
                <MiniStat icon={Eye} value={fmtCompact(content.totalViews)} label="Total views" />
                <MiniStat icon={Heart} value={fmtCompact(content.totalLikes)} label="Total likes" />
            </div>

            {/* Top content */}
            <p className="mb-1 mt-5 text-[12px] font-semibold uppercase tracking-wide text-[#9a978f]">Top performing</p>
            {content.top.length === 0 ? (
                <p className="py-6 text-center text-[13px] text-[#9a978f]">No content published yet.</p>
            ) : (
                <div className="divide-y divide-[#f1ede5]">
                    {content.top.map((c, i) => (
                        <div key={`${c.type}-${c.slug}-${i}`} className="flex items-center gap-3 py-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F6F4EF] text-[11px] font-semibold text-[#9a978f]">
                                {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate text-[13px] font-medium text-[#26262B]" title={c.title}>
                                        {c.title}
                                    </span>
                                    <TypeBadge type={c.type} />
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-3 text-[12px] text-[#9a978f]">
                                <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{fmtCompact(c.views)}</span>
                                <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{fmtCompact(c.likes)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Management signal */}
            {messages.total > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F6F4EF] px-3.5 py-3 text-[12px] text-[#57544e]">
                    <Inbox className="h-4 w-4 shrink-0 text-[#9a978f]" />
                    <span>
                        <span className="font-semibold text-[#26262B]">{fmtFull(messages.total)}</span> contact message{messages.total === 1 ? "" : "s"}
                        {messages.unread > 0 && (
                            <>
                                {" · "}
                                <span className="font-semibold text-[#EE5D4A]">{fmtFull(messages.unread)} unread</span>
                            </>
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}
