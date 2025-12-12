"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/useAuth";
import {
    BarChart3,
    ExternalLink,
    Eye,
    FileText,
    Globe,
    LineChart,
    Link2,
    Loader2,
    Lock,
    Monitor,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface StatisticsSettings {
    isPublic: boolean;
    isCardsPublic: boolean;
    isTrendsPublic: boolean;
    isDevicesPublic: boolean;
    isPathPublic: boolean;
    isRefPublic: boolean;
}

type SettingKey = "statistics" | "statsCards" | "visitorTrends" | "deviceTypes" | "topPages" | "referralSources";

export default function Statistics() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<StatisticsSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/statistics");
            const result = await response.json();

            if (response.ok) {
                setSettings({
                    isPublic: result.isPublic,
                    isCardsPublic: result.isCardsPublic,
                    isTrendsPublic: result.isTrendsPublic,
                    isDevicesPublic: result.isDevicesPublic,
                    isPathPublic: result.isPathPublic,
                    isRefPublic: result.isRefPublic,
                });
            } else if (response.status === 403) {
                router.push("/");
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleToggle = async (setting: SettingKey) => {
        if (!settings || !isAdmin) return;

        setToggling(setting);
        try {
            let body;
            switch (setting) {
                case "statistics":
                    body = { isPublic: !settings.isPublic };
                    break;
                case "statsCards":
                    body = { setting: "statsCards", isCardsPublic: !settings.isCardsPublic };
                    break;
                case "visitorTrends":
                    body = { setting: "visitorTrends", isTrendsPublic: !settings.isTrendsPublic };
                    break;
                case "deviceTypes":
                    body = { setting: "deviceTypes", isDevicesPublic: !settings.isDevicesPublic };
                    break;
                case "topPages":
                    body = { setting: "topPages", isPathPublic: !settings.isPathPublic };
                    break;
                case "referralSources":
                    body = { setting: "referralSources", isRefPublic: !settings.isRefPublic };
                    break;
            }

            const response = await fetch("/api/statistics/visibility", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                setSettings((prev) => {
                    if (!prev) return null;
                    switch (setting) {
                        case "statistics":
                            return { ...prev, isPublic: !prev.isPublic };
                        case "statsCards":
                            return { ...prev, isCardsPublic: !prev.isCardsPublic };
                        case "visitorTrends":
                            return { ...prev, isTrendsPublic: !prev.isTrendsPublic };
                        case "deviceTypes":
                            return { ...prev, isDevicesPublic: !prev.isDevicesPublic };
                        case "topPages":
                            return { ...prev, isPathPublic: !prev.isPathPublic };
                        case "referralSources":
                            return { ...prev, isRefPublic: !prev.isRefPublic };
                        default:
                            return prev;
                    }
                });
                toast.success(result.message);
            } else {
                toast.error(result.error || "Failed to update setting");
            }
        } catch (error) {
            console.error("Error toggling setting:", error);
            toast.error("Failed to update setting");
        } finally {
            setToggling(null);
        }
    };

    if (loading) {
        return <StatisticsSkeleton />;
    }

    if (!settings) {
        return (
            <section className="border border-border rounded-xl p-6">
                <p className="text-muted-foreground text-center">Failed to load settings</p>
            </section>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 icon-bw" />
                        <h3 className="text-base font-semibold">Statistics Settings</h3>
                    </div>
                    <Link
                        href="/statistics"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                        View Statistics
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Statistics Page Visibility */}
            <SettingCard
                icon={<BarChart3 className="h-5 w-5 icon-bw" />}
                title="Statistics Page"
                description="Control public access to the statistics page"
                isPublic={settings.isPublic}
                isToggling={toggling === "statistics"}
                onToggle={() => handleToggle("statistics")}
            />

            {/* Stats Cards Visibility */}
            <SettingCard
                icon={<Eye className="h-5 w-5 icon-bw" />}
                title="Stats Cards"
                description="Show total visits, unique visitors, blogs & projects count"
                isPublic={settings.isCardsPublic}
                isToggling={toggling === "statsCards"}
                onToggle={() => handleToggle("statsCards")}
            />

            {/* Visitor Trends Visibility */}
            <SettingCard
                icon={<LineChart className="h-5 w-5 icon-bw" />}
                title="Visitor Trends"
                description="Show visitor trends chart (last 30 days)"
                isPublic={settings.isTrendsPublic}
                isToggling={toggling === "visitorTrends"}
                onToggle={() => handleToggle("visitorTrends")}
            />

            {/* Device Types Visibility */}
            <SettingCard
                icon={<Monitor className="h-5 w-5 icon-bw" />}
                title="Device Types"
                description="Show device breakdown chart"
                isPublic={settings.isDevicesPublic}
                isToggling={toggling === "deviceTypes"}
                onToggle={() => handleToggle("deviceTypes")}
            />

            {/* Top Pages Visibility */}
            <SettingCard
                icon={<FileText className="h-5 w-5 icon-bw" />}
                title="Top Pages"
                description="Show page visit data to public visitors"
                isPublic={settings.isPathPublic}
                isToggling={toggling === "topPages"}
                onToggle={() => handleToggle("topPages")}
            />

            {/* Referral Sources Visibility */}
            <SettingCard
                icon={<Link2 className="h-5 w-5 icon-bw" />}
                title="Referral Sources"
                description="Show referral tracking data to public visitors"
                isPublic={settings.isRefPublic}
                isToggling={toggling === "referralSources"}
                onToggle={() => handleToggle("referralSources")}
            />
        </div>
    );
}

function SettingCard({
    icon,
    title,
    description,
    isPublic,
    isToggling,
    onToggle,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    isPublic: boolean;
    isToggling: boolean;
    onToggle: () => void;
}) {
    return (
        <section className="border border-border rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full shrink-0 ${isPublic ? "bg-muted" : "bg-muted/50"}`}>
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm">{title}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground hidden sm:flex">
                        {isPublic ? (
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
                        onClick={onToggle}
                        disabled={isToggling}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPublic ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                            } disabled:opacity-50`}
                    >
                        {isToggling ? (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                            </span>
                        ) : (
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${isPublic ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}

function StatisticsSkeleton() {
    return (
        <div className="space-y-4">
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-40" />
                </div>
            </section>
            {[...Array(6)].map((_, i) => (
                <section key={i} className="border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                </section>
            ))}
        </div>
    );
}
