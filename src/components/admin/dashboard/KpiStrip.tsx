"use client";

import { ArrowUpRight, Eye, FileText, Mail, Users } from "lucide-react";
import Link from "next/link";
import { CARD, DeltaChip } from "./primitives";
import { fmtCompact, fmtFull, weeklyDelta, type OverviewData, type StatisticsData } from "./useOverview";

type IconType = React.ComponentType<{ className?: string }>;

interface Kpi {
    label: string;
    value: string;
    sub: string;
    href: string;
    icon: IconType;
    iconClass: string; // icon color
    chipClass: string; // icon tile background
    delta?: React.ReactNode;
}

function NewBadge({ n }: { n: number }) {
    if (n <= 0) return <span className="text-[11px] font-medium text-[#c4c0b7]">no change</span>;
    return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-1.5 py-0.5 text-[11px] font-semibold text-green-600">
            +{n} new
        </span>
    );
}

export default function KpiStrip({ overview, stats }: { overview: OverviewData; stats?: StatisticsData }) {
    const totalViews = stats?.totalVisitors ?? 0;
    const uniqueViews = stats?.uniqueVisitors ?? 0;
    const vDelta = weeklyDelta(stats?.visitorTrends, "visitors");
    const publishedContent = overview.content.blogs.published + overview.content.projects.published;
    const draftContent = overview.content.blogs.draft + overview.content.projects.draft;

    const kpis: Kpi[] = [
        {
            label: "Page Views",
            value: fmtCompact(totalViews),
            sub: `${fmtCompact(uniqueViews)} unique visitors`,
            href: "/admin/statistics",
            icon: Eye,
            iconClass: "text-[#EE5D4A]",
            chipClass: "bg-[#EE5D4A]/12",
            delta: vDelta ? <DeltaChip dir={vDelta.dir} pct={vDelta.pct} /> : undefined,
        },
        {
            label: "Registered Users",
            value: fmtFull(overview.users.total),
            sub: `${fmtFull(overview.users.active)} active · ${fmtFull(overview.users.banned)} banned`,
            href: "/admin/users",
            icon: Users,
            iconClass: "text-[#26262B]",
            chipClass: "bg-[#F4C63D]/20",
            delta: <NewBadge n={overview.users.newThisWeek} />,
        },
        {
            label: "Subscribers",
            value: fmtFull(overview.subscribers.active),
            sub: `${fmtFull(overview.subscribers.total)} total · ${fmtFull(overview.subscribers.inactive)} inactive`,
            href: "/admin/subscribers",
            icon: Mail,
            iconClass: "text-white",
            chipClass: "bg-[#26262B]",
            delta: <NewBadge n={overview.subscribers.newThisWeek} />,
        },
        {
            label: "Published Content",
            value: fmtFull(publishedContent),
            sub: `${fmtCompact(overview.content.totalViews)} views · ${draftContent} drafts`,
            href: "/admin/statistics",
            icon: FileText,
            iconClass: "text-[#57544e]",
            chipClass: "bg-[#F6F4EF]",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {kpis.map((k) => {
                const Icon = k.icon;
                return (
                    <Link
                        key={k.label}
                        href={k.href}
                        className={`${CARD} group flex flex-col gap-4 !p-5 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${k.chipClass}`}>
                                <Icon className={`h-5 w-5 ${k.iconClass}`} />
                            </span>
                            <div className="flex items-center gap-1.5">
                                {k.delta}
                                <ArrowUpRight className="h-4 w-4 text-[#c4c0b7] transition-colors group-hover:text-[#26262B]" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <div className="text-[26px] font-bold leading-none tracking-tight text-[#26262B]">{k.value}</div>
                            <p className="mt-1.5 text-[13px] font-medium text-[#26262B]">{k.label}</p>
                            <p className="mt-0.5 truncate text-[12px] text-[#9a978f]">{k.sub}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
