"use client";

import AudienceCard from "./AudienceCard";
import ContentPerformanceCard from "./ContentPerformanceCard";
import KpiStrip from "./KpiStrip";
import { CARD, SectionError } from "./primitives";
import TopPagesCard from "./TopPagesCard";
import { useOverview, useStatistics } from "./useOverview";
import VisitorTrendsCard from "./VisitorTrendsCard";

function Block({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-[24px] bg-[var(--s-soft2)] ${className}`} />;
}

function OverviewSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {[...Array(4)].map((_, i) => (
                    <Block key={i} className="h-[132px]" />
                ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <Block className="h-[360px]" />
                <Block className="h-[360px]" />
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
                <Block className="h-[300px]" />
                <Block className="h-[300px]" />
            </div>
        </div>
    );
}

export default function ApplicationOverview() {
    const overview = useOverview();
    const stats = useStatistics();

    if (overview.isLoading || stats.isLoading) return <OverviewSkeleton />;

    if (overview.isError || !overview.data) {
        return (
            <SectionError
                label="Couldn't load application data"
                onRetry={() => {
                    overview.refetch();
                    stats.refetch();
                }}
            />
        );
    }

    const o = overview.data;
    const s = stats.data;
    const analyticsReady = !stats.isError && !!s;

    return (
        <div className="space-y-4">
            <KpiStrip overview={o} stats={s} />

            {analyticsReady ? (
                <>
                    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                        <VisitorTrendsCard trend={s!.visitorTrends ?? []} />
                        <AudienceCard stats={s!} />
                    </div>
                    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
                        <TopPagesCard stats={s!} />
                        <ContentPerformanceCard overview={o} />
                    </div>
                </>
            ) : (
                <>
                    <div className={`${CARD} flex flex-col items-center justify-center py-10 text-center`}>
                        <p className="text-[14px] font-semibold text-[var(--s-text)]">Visitor analytics unavailable</p>
                        <p className="mt-1 text-[13px] text-[var(--s-muted)]">Traffic, audience, and top pages couldn&apos;t be loaded.</p>
                        <button
                            onClick={() => stats.refetch()}
                            className="mt-4 rounded-full bg-[var(--s-invert)] px-5 py-2 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
                        >
                            Retry
                        </button>
                    </div>
                    <ContentPerformanceCard overview={o} />
                </>
            )}
        </div>
    );
}
