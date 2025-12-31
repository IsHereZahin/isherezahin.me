"use client";

import { Skeleton } from "@/components/ui";
import { ApiError, statistics } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, ExternalLink, Eye, FileText, Globe, LineChart, Link2, Loader2, Lock, Monitor } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StatisticsSettings {
    isPublic: boolean;
    isCardsPublic: boolean;
    isTrendsPublic: boolean;
    isDevicesPublic: boolean;
    isCountriesPublic: boolean;
    isPathPublic: boolean;
    isRefPublic: boolean;
}

type SettingKey = "statistics" | "statsCards" | "visitorTrends" | "deviceTypes" | "countries" | "topPages" | "referralSources";

async function fetchSettings(): Promise<StatisticsSettings> {
    return await statistics.getSettings();
}

function getVisibilityBody(setting: SettingKey, settings: StatisticsSettings) {
    switch (setting) {
        case "statistics": return { isPublic: !settings.isPublic };
        case "statsCards": return { setting: "statsCards", isCardsPublic: !settings.isCardsPublic };
        case "visitorTrends": return { setting: "visitorTrends", isTrendsPublic: !settings.isTrendsPublic };
        case "deviceTypes": return { setting: "deviceTypes", isDevicesPublic: !settings.isDevicesPublic };
        case "countries": return { setting: "countries", isCountriesPublic: !settings.isCountriesPublic };
        case "topPages": return { setting: "topPages", isPathPublic: !settings.isPathPublic };
        case "referralSources": return { setting: "referralSources", isRefPublic: !settings.isRefPublic };
    }
}

export default function Statistics() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: settings, isLoading, error } = useQuery({
        queryKey: ["admin-statistics-settings"],
        queryFn: fetchSettings,
        enabled: isAdmin,
    });

    const mutation = useMutation({
        mutationFn: ({ setting, currentSettings }: { setting: SettingKey; currentSettings: StatisticsSettings }) =>
            statistics.updateVisibility(getVisibilityBody(setting, currentSettings)),
        onSuccess: (result, { setting }) => {
            queryClient.setQueryData<StatisticsSettings>(["admin-statistics-settings"], (old) => {
                if (!old) return old;
                switch (setting) {
                    case "statistics": return { ...old, isPublic: !old.isPublic };
                    case "statsCards": return { ...old, isCardsPublic: !old.isCardsPublic };
                    case "visitorTrends": return { ...old, isTrendsPublic: !old.isTrendsPublic };
                    case "deviceTypes": return { ...old, isDevicesPublic: !old.isDevicesPublic };
                    case "countries": return { ...old, isCountriesPublic: !old.isCountriesPublic };
                    case "topPages": return { ...old, isPathPublic: !old.isPathPublic };
                    case "referralSources": return { ...old, isRefPublic: !old.isRefPublic };
                    default: return old;
                }
            });
            toast.success(result.message);
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update setting");
        },
    });

    if (error instanceof ApiError && error.status === 403) {
        router.push("/");
        return null;
    }

    if (isLoading) return <StatisticsSkeleton />;
    if (!settings) return <section className="border border-border rounded-xl p-6"><p className="text-muted-foreground text-center">Failed to load settings</p></section>;

    const handleToggle = (setting: SettingKey) => {
        mutation.mutate({ setting, currentSettings: settings });
    };

    const isToggling = (setting: SettingKey) => mutation.isPending && mutation.variables?.setting === setting;

    return (
        <div className="space-y-4">
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 icon-bw" />
                        <h3 className="text-base font-semibold">Statistics Settings</h3>
                    </div>
                    <Link href="/statistics" className="flex items-center gap-1 text-sm text-primary hover:underline">
                        View Statistics<ExternalLink className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <SettingCard icon={<BarChart3 className="h-5 w-5 icon-bw" />} title="Statistics Page" description="Control public access to the statistics page" isPublic={settings.isPublic} isToggling={isToggling("statistics")} onToggle={() => handleToggle("statistics")} />
            <SettingCard icon={<Eye className="h-5 w-5 icon-bw" />} title="Stats Cards" description="Show total visits, unique visitors, blogs & projects count" isPublic={settings.isCardsPublic} isToggling={isToggling("statsCards")} onToggle={() => handleToggle("statsCards")} />
            <SettingCard icon={<LineChart className="h-5 w-5 icon-bw" />} title="Visitor Trends" description="Show visitor trends chart (last 30 days)" isPublic={settings.isTrendsPublic} isToggling={isToggling("visitorTrends")} onToggle={() => handleToggle("visitorTrends")} />
            <SettingCard icon={<Monitor className="h-5 w-5 icon-bw" />} title="Device Types" description="Show device breakdown chart" isPublic={settings.isDevicesPublic} isToggling={isToggling("deviceTypes")} onToggle={() => handleToggle("deviceTypes")} />
            <SettingCard icon={<Globe className="h-5 w-5 icon-bw" />} title="Visitors by Country" description="Show country breakdown data" isPublic={settings.isCountriesPublic} isToggling={isToggling("countries")} onToggle={() => handleToggle("countries")} />
            <SettingCard icon={<FileText className="h-5 w-5 icon-bw" />} title="Top Pages" description="Show page visit data to public visitors" isPublic={settings.isPathPublic} isToggling={isToggling("topPages")} onToggle={() => handleToggle("topPages")} />
            <SettingCard icon={<Link2 className="h-5 w-5 icon-bw" />} title="Referral Sources" description="Show referral tracking data to public visitors" isPublic={settings.isRefPublic} isToggling={isToggling("referralSources")} onToggle={() => handleToggle("referralSources")} />
        </div>
    );
}

function SettingCard({ icon, title, description, isPublic, isToggling, onToggle }: { icon: React.ReactNode; title: string; description: string; isPublic: boolean; isToggling: boolean; onToggle: () => void }) {
    return (
        <section className="border border-border rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full shrink-0 ${isPublic ? "bg-muted" : "bg-muted/50"}`}>{icon}</div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm">{title}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground hidden sm:flex">
                        {isPublic ? <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Globe className="h-4 w-4" /> Public</span> : <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><Lock className="h-4 w-4" /> Private</span>}
                    </span>
                    <button onClick={onToggle} disabled={isToggling} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPublic ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}>
                        {isToggling ? <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-white" /></span> : <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${isPublic ? "translate-x-6" : "translate-x-1"}`} />}
                    </button>
                </div>
            </div>
        </section>
    );
}

function StatisticsSkeleton() {
    return (
        <div className="space-y-4">
            <section className="border border-border rounded-xl p-6"><div className="flex items-center gap-2"><Skeleton className="h-5 w-5" /><Skeleton className="h-5 w-40" /></div></section>
            {[...Array(7)].map((_, i) => (
                <section key={i} className="border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><div><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-48" /></div></div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                </section>
            ))}
        </div>
    );
}
