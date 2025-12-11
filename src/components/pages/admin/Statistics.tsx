"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/useAuth";
import {
    BarChart3,
    BookOpen,
    Eye,
    FolderKanban,
    Globe,
    Link2,
    Loader2,
    Lock,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

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

export default function Statistics() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [togglingRef, setTogglingRef] = useState(false);

    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/statistics");
            const result = await response.json();

            if (response.ok) {
                setData(result);
            } else if (response.status === 403) {
                router.push("/");
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
            toast.error("Failed to load statistics");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    const handleToggleVisibility = async () => {
        if (!data || !isAdmin) return;

        setToggling(true);
        try {
            const response = await fetch("/api/statistics/visibility", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublic: !data.isPublic }),
            });

            const result = await response.json();

            if (response.ok) {
                setData((prev) => (prev ? { ...prev, isPublic: !prev.isPublic } : null));
                toast.success(result.message);
            } else {
                toast.error(result.error || "Failed to update visibility");
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
            toast.error("Failed to update visibility");
        } finally {
            setToggling(false);
        }
    };

    const handleToggleRefVisibility = async () => {
        if (!data || !isAdmin) return;

        setTogglingRef(true);
        try {
            const response = await fetch("/api/statistics/visibility", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ setting: "referralSources", isRefPublic: !data.isRefPublic }),
            });

            const result = await response.json();

            if (response.ok) {
                setData((prev) => (prev ? { ...prev, isRefPublic: !prev.isRefPublic } : null));
                toast.success(result.message);
            } else {
                toast.error(result.error || "Failed to update visibility");
            }
        } catch (error) {
            console.error("Error toggling ref visibility:", error);
            toast.error("Failed to update visibility");
        } finally {
            setTogglingRef(false);
        }
    };

    if (loading) {
        return <StatisticsSkeleton />;
    }

    if (!data) {
        return (
            <section className="border border-border rounded-xl p-6">
                <p className="text-muted-foreground text-center">Failed to load statistics</p>
            </section>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with visibility toggle */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 icon-bw" />
                        <h3 className="text-base font-semibold">Site Statistics</h3>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                {data.isPublic ? (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <Globe className="h-4 w-4" /> Public
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                        <Lock className="h-4 w-4" /> Private
                                    </span>
                                )}
                            </span>
                            <button
                                onClick={handleToggleVisibility}
                                disabled={toggling}
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${data.isPublic ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    } disabled:opacity-50`}
                            >
                                {toggling ? (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    </span>
                                ) : (
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${data.isPublic ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </section>

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

            {/* Referral Stats */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 icon-bw" />
                        <h3 className="text-base font-semibold">Referral Sources</h3>
                        <span className="text-xs text-muted-foreground">
                            ({data.refStats.length} unique)
                        </span>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                {data.isRefPublic ? (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <Globe className="h-4 w-4" /> Public
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                        <Lock className="h-4 w-4" /> Private
                                    </span>
                                )}
                            </span>
                            <button
                                onClick={handleToggleRefVisibility}
                                disabled={togglingRef}
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${data.isRefPublic ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    } disabled:opacity-50`}
                            >
                                {togglingRef ? (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    </span>
                                ) : (
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${data.isRefPublic ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                )}
                            </button>
                        </div>
                    )}
                </div>
                {data.refStats.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No referral data yet. Share links with ?ref=source to track.
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
        </div>
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
        <div className="space-y-6">
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </section>
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
        </div>
    );
}
