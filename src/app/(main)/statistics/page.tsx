"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { PageTitle, Section } from "@/components/ui";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart3,
    BookOpen,
    Eye,
    FolderKanban,
    Link2,
    Lock,
    Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface RefStat {
    ref: string;
    count: number;
}

interface TrendData {
    date: string;
    visitors: number;
}

interface StatisticsData {
    totalVisitors: number;
    uniqueVisitors: number;
    refStats: RefStat[];
    visitorTrends: TrendData[];
    totalBlogs: number;
    totalProjects: number;
    isPublic: boolean;
    isRefPublic: boolean;
}

const chartConfig = {
    visitors: {
        label: "Visitors",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

export default function PublicStatisticsPage() {
    const [data, setData] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/statistics");
            const result = await response.json();

            if (response.ok) {
                setData(result);
            } else if (response.status === 403) {
                setError("Statistics are currently private");
            } else {
                setError("Failed to load statistics");
            }
        } catch (err) {
            console.error("Error fetching statistics:", err);
            setError("Failed to load statistics");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    if (loading) {
        return (
            <Section id="statistics">
                <PageTitle title="Statistics" subtitle="Site analytics and visitor data" />
                <StatisticsSkeleton />
            </Section>
        );
    }

    if (error) {
        return (
            <Section id="statistics">
                <PageTitle title="Statistics" subtitle="Site analytics and visitor data" />
                <MotionWrapper delay={0.2}>
                    <div className="border border-border rounded-xl p-12 text-center">
                        <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </MotionWrapper>
            </Section>
        );
    }

    if (!data) return null;

    return (
        <Section id="statistics">
            <PageTitle title="Statistics" subtitle="Site analytics and visitor data" />

            <MotionWrapper delay={0.2} className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={<Eye className="h-5 w-5" />}
                        label="Total Visits"
                        value={data.totalVisitors}
                    />
                    <StatCard
                        icon={<Users className="h-5 w-5" />}
                        label="Unique Visitors"
                        value={data.uniqueVisitors}
                    />
                    <StatCard
                        icon={<BookOpen className="h-5 w-5" />}
                        label="Published Blogs"
                        value={data.totalBlogs}
                    />
                    <StatCard
                        icon={<FolderKanban className="h-5 w-5" />}
                        label="Published Projects"
                        value={data.totalProjects}
                    />
                </div>

                {/* Visitor Trends Chart */}
                <section className="border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="h-5 w-5 icon-bw" />
                        <h3 className="text-base font-semibold">Visitor Trends (Last 30 Days)</h3>
                    </div>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <AreaChart data={data.visitorTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                }}
                            />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="visitors"
                                type="monotone"
                                fill="url(#fillVisitors)"
                                stroke="var(--color-visitors)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                </section>

                {/* Referral Stats - Only show if public */}
                {data.isRefPublic && (
                    <section className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Link2 className="h-5 w-5 icon-bw" />
                            <h3 className="text-base font-semibold">Referral Sources</h3>
                            <span className="text-xs text-muted-foreground ml-auto">
                                {data.refStats.length} unique refs
                            </span>
                        </div>
                        {data.refStats.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No referral data available yet.
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto modal-scrollbar">
                                {data.refStats.map((stat) => (
                                    <div
                                        key={stat.ref}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                        <span className="text-sm font-medium truncate max-w-[200px]">
                                            {stat.ref}
                                        </span>
                                        <span className="text-sm text-muted-foreground font-mono">
                                            {stat.count.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </MotionWrapper>
        </Section>
    );
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
    );
}

function StatisticsSkeleton() {
    return (
        <MotionWrapper delay={0.2} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="border border-border rounded-xl p-4">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>
            <section className="border border-border rounded-xl p-6">
                <Skeleton className="h-5 w-48 mb-6" />
                <Skeleton className="h-[300px] w-full" />
            </section>
        </MotionWrapper>
    );
}
