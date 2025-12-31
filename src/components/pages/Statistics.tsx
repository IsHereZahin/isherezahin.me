"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, ErrorState, PageTitle, Section, Skeleton } from "@/components/ui";
import { statistics } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpen, Eye, FileText, FolderKanban, Globe, Link2, Lock, Monitor, Users } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

interface RefStat { ref: string; count: number; }
interface PathStat { path: string; count: number; }
interface DeviceStat { device: string; count: number; uniqueVisitors?: number; }
interface CountryStat { country: string; count: number; }
interface TrendData { date: string; visitors: number; uniqueVisitors: number; }

interface StatisticsData {
    totalVisitors?: number;
    uniqueVisitors?: number;
    refStats?: RefStat[];
    pathStats?: PathStat[];
    deviceStats?: DeviceStat[];
    countryStats?: CountryStat[];
    visitorTrends?: TrendData[];
    totalBlogs?: number;
    totalProjects?: number;
    totalRefs?: number;
    totalPaths?: number;
    refPage?: number;
    pathPage?: number;
    isPublic: boolean;
    isCardsPublic: boolean;
    isTrendsPublic: boolean;
    isDevicesPublic: boolean;
    isCountriesPublic?: boolean;
    isRefPublic: boolean;
    isPathPublic: boolean;
    isAdmin: boolean;
}

const trendChartConfig = {
    visitors: { label: "Total Visits", color: "var(--primary)" },
    uniqueVisitors: { label: "Unique Visitors", color: "rgba(var(--primary-rgb), 0.5)" },
} satisfies ChartConfig;

const DEVICE_COLORS: Record<string, string> = {
    Android: "rgba(var(--primary-rgb), 1)",
    iOS: "rgba(var(--primary-rgb), 0.8)",
    Windows: "rgba(var(--primary-rgb), 0.6)",
    macOS: "rgba(var(--primary-rgb), 0.45)",
    Linux: "rgba(var(--primary-rgb), 0.3)",
    Bot: "rgba(var(--primary-rgb), 0.2)",
    Other: "rgba(var(--primary-rgb), 0.15)",
    Unknown: "rgba(var(--primary-rgb), 0.1)",
};

export default function Statistics() {
    const [chartType, setChartType] = useState<"visitors" | "devices">("visitors");

    const { data, isLoading, error, refetch } = useQuery<StatisticsData>({
        queryKey: ["statistics"],
        queryFn: statistics.get,
    });

    if (isLoading) {
        return (
            <Section id="statistics">
                <PageTitle title="Statistics" subtitle="Site analytics and visitor data" />
                <StatisticsSkeleton />
            </Section>
        );
    }

    if (error) {
        const isPrivate = error instanceof Error && error.message.includes("private");
        return (
            <Section id="statistics">
                <PageTitle title="Statistics" subtitle="Site analytics and visitor data" />
                {isPrivate ? (
                    <MotionWrapper delay={0.2}>
                        <div className="border border-border rounded-xl p-12 text-center">
                            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                            <p className="text-muted-foreground">Statistics are currently private</p>
                        </div>
                    </MotionWrapper>
                ) : (
                    <ErrorState title="Failed to load statistics" message={error instanceof Error ? error.message : "Something went wrong"} onRetry={() => refetch()} />
                )}
            </Section>
        );
    }

    if (!data) return null;

    const deviceChartConfig = (data.deviceStats || []).reduce((acc, d) => {
        acc[d.device] = { label: d.device, color: DEVICE_COLORS[d.device] || DEVICE_COLORS.Other };
        return acc;
    }, {} as ChartConfig);

    const pageTitle = data.isAdmin && !data.isPublic ? "Statistics (Private)" : "Statistics";
    const showTrends = data.isAdmin || data.isTrendsPublic;
    const showDevices = data.isAdmin || data.isDevicesPublic;
    const showCards = data.isAdmin || data.isCardsPublic;
    const showCountries = data.isAdmin || data.isCountriesPublic;
    const showBothCharts = showTrends && showDevices;
    const showOnlyTrends = showTrends && !showDevices;
    const showOnlyDevices = showDevices && !showTrends;

    return (
        <Section id="statistics">
            <PageTitle title={pageTitle} subtitle="Site analytics and visitor data" />
            <MotionWrapper delay={0.2} className="space-y-6">
                {showCards && data.totalVisitors !== undefined && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={<Eye className="h-5 w-5" />} label="Total Visits" value={data.totalVisitors} />
                        <StatCard icon={<Users className="h-5 w-5" />} label="Unique Visitors" value={data.uniqueVisitors ?? 0} />
                        <StatCard icon={<BookOpen className="h-5 w-5" />} label="Published Blogs" value={data.totalBlogs ?? 0} />
                        <StatCard icon={<FolderKanban className="h-5 w-5" />} label="Published Projects" value={data.totalProjects ?? 0} />
                        {data.isAdmin && !data.isCardsPublic && (
                            <div className="col-span-full">
                                <span className="text-xs text-amber-600 dark:text-amber-400">(Private - only visible to admin)</span>
                            </div>
                        )}
                    </div>
                )}

                {showBothCharts && (
                    <div className="flex gap-2">
                        <button onClick={() => setChartType("visitors")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${chartType === "visitors" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                            <BarChart3 className="h-4 w-4 inline mr-2" />Visitor Trends
                            {data.isAdmin && !data.isTrendsPublic && <span className="text-xs ml-1 opacity-70">(Private)</span>}
                        </button>
                        <button onClick={() => setChartType("devices")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${chartType === "devices" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                            <Monitor className="h-4 w-4 inline mr-2" />Device Types
                            {data.isAdmin && !data.isDevicesPublic && <span className="text-xs ml-1 opacity-70">(Private)</span>}
                        </button>
                    </div>
                )}

                {(showBothCharts ? chartType === "visitors" : showOnlyTrends || (showBothCharts && chartType === "visitors")) && showTrends && data.visitorTrends && (
                    <section className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="h-5 w-5 icon-bw" />
                            <h3 className="text-base font-semibold">Visitor Trends (Last 30 Days)</h3>
                            {data.isAdmin && !data.isTrendsPublic && <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">(Private)</span>}
                        </div>
                        <ChartContainer config={trendChartConfig} className="h-[300px] w-full">
                            <AreaChart data={data.visitorTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-uniqueVisitors)" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="var(--color-uniqueVisitors)" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} indicator="dot" />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Area dataKey="visitors" type="monotone" fill="url(#fillVisitors)" stroke="var(--color-visitors)" strokeWidth={2} />
                                <Area dataKey="uniqueVisitors" type="monotone" fill="url(#fillUnique)" stroke="var(--color-uniqueVisitors)" strokeWidth={2} />
                            </AreaChart>
                        </ChartContainer>
                    </section>
                )}

                {(showBothCharts ? chartType === "devices" : showOnlyDevices || (showBothCharts && chartType === "devices")) && showDevices && data.deviceStats && (
                    <section className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Monitor className="h-5 w-5 icon-bw" />
                            <h3 className="text-base font-semibold">Device Types</h3>
                            {data.isAdmin && !data.isDevicesPublic && <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">(Private)</span>}
                        </div>
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <ChartContainer config={deviceChartConfig} className="h-[300px] w-full lg:w-1/2">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={data.deviceStats} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={100} label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                        {data.deviceStats.map((entry) => (<Cell key={entry.device} fill={DEVICE_COLORS[entry.device] || DEVICE_COLORS.Other} />))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                            <div className="w-full lg:w-1/2 space-y-2">
                                {data.deviceStats.map((stat) => (
                                    <div key={stat.device} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEVICE_COLORS[stat.device] || DEVICE_COLORS.Other }} />
                                            <span className="text-sm font-medium">{stat.device}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-foreground font-mono">{stat.count.toLocaleString()}</span>
                                            {stat.uniqueVisitors !== undefined && (
                                                <span className="text-xs text-muted-foreground ml-2">({stat.uniqueVisitors.toLocaleString()} unique)</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {showCountries && data.countryStats && data.countryStats.length > 0 && (
                    <section className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Globe className="h-5 w-5 icon-bw" />
                            <h3 className="text-base font-semibold">Visitors by Country</h3>
                            {data.isAdmin && !data.isCountriesPublic && <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">(Private)</span>}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {data.countryStats.slice(0, 12).map((stat) => (
                                <div key={stat.country} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">{stat.country}</span>
                                    <span className="text-sm text-muted-foreground font-mono">{stat.count.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {(data.isAdmin || data.isPathPublic) && data.pathStats && (
                    <section className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="h-5 w-5 icon-bw" />
                            <h3 className="text-base font-semibold">Top Pages</h3>
                            {data.isAdmin && !data.isPathPublic && <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">(Private)</span>}
                            <span className="text-xs text-muted-foreground ml-auto">{data.isAdmin ? "All" : "Top 10"}</span>
                        </div>
                        {data.pathStats.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No page data yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {data.pathStats.map((stat, idx) => (
                                    <div key={`${stat.path}-${idx}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <span className="text-sm font-medium truncate max-w-[250px]">{stat.path}</span>
                                        <span className="text-sm text-muted-foreground font-mono">{stat.count.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {(data.isAdmin || data.isRefPublic) && data.refStats && (
                    <section className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Link2 className="h-5 w-5 icon-bw" />
                            <h3 className="text-base font-semibold">Referral Sources</h3>
                            {data.isAdmin && !data.isRefPublic && <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">(Private)</span>}
                            <span className="text-xs text-muted-foreground ml-auto">{data.isAdmin ? "All" : "Top 10"}</span>
                        </div>
                        {data.refStats.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No referral data available yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {data.refStats.map((stat, idx) => (
                                    <div key={`${stat.ref}-${idx}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <span className="text-sm font-medium truncate max-w-[250px]">{stat.ref}</span>
                                        <span className="text-sm text-muted-foreground font-mono">{stat.count.toLocaleString()}</span>
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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-xs">{label}</span></div>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
    );
}

function StatisticsSkeleton() {
    return (
        <MotionWrapper delay={0.2} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (<div key={i} className="border border-border rounded-xl p-4"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-16" /></div>))}
            </div>
            <section className="border border-border rounded-xl p-6"><Skeleton className="h-5 w-48 mb-6" /><Skeleton className="h-[300px] w-full" /></section>
        </MotionWrapper>
    );
}
