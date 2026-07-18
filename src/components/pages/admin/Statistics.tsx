"use client";

import { Skeleton } from "@/components/ui";
import { ApiError, statistics } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Eye, FileText, Globe, LineChart, Link2, Loader2, Lock, Monitor } from "lucide-react";
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

// The individual page sections that can be shown/hidden to the public.
const SECTIONS: { key: SettingKey; field: keyof StatisticsSettings; icon: typeof Eye; title: string; description: string }[] = [
    { key: "statsCards", field: "isCardsPublic", icon: Eye, title: "Stats Cards", description: "Total visits, unique visitors, blogs & projects count" },
    { key: "visitorTrends", field: "isTrendsPublic", icon: LineChart, title: "Visitor Trends", description: "Visitor trends chart (last 30 days)" },
    { key: "deviceTypes", field: "isDevicesPublic", icon: Monitor, title: "Device Types", description: "Device breakdown chart" },
    { key: "countries", field: "isCountriesPublic", icon: Globe, title: "Visitors by Country", description: "Country breakdown data" },
    { key: "topPages", field: "isPathPublic", icon: FileText, title: "Top Pages", description: "Page visit data" },
    { key: "referralSources", field: "isRefPublic", icon: Link2, title: "Referral Sources", description: "Referral tracking data" },
];

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
    if (!settings) {
        return (
            <div className="rounded-[24px] border border-[#EEEAE2] bg-white p-10 text-center">
                <p className="text-[13px] text-[#9a978f]">Failed to load settings</p>
            </div>
        );
    }

    const handleToggle = (setting: SettingKey) => {
        mutation.mutate({ setting, currentSettings: settings });
    };

    const isToggling = (setting: SettingKey) => mutation.isPending && mutation.variables?.setting === setting;
    const publicCount = SECTIONS.filter((s) => settings[s.field]).length;

    return (
        <div className="space-y-5">
            {/* Master: public page access */}
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${settings.isPublic ? "bg-[#F4C63D]/15" : "bg-[#F6F4EF]"}`}>
                            <BarChart3 className="h-5 w-5 text-[#26262B]" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[16px] font-semibold text-[#26262B]">Public Statistics Page</h3>
                                <VisibilityBadge isPublic={settings.isPublic} />
                            </div>
                            <p className="mt-0.5 text-[13px] text-[#9a978f]">
                                {settings.isPublic
                                    ? "Anyone can view your statistics page"
                                    : "The statistics page is private (admins only)"}
                            </p>
                        </div>
                    </div>
                    <Toggle isOn={settings.isPublic} isLoading={isToggling("statistics")} onClick={() => handleToggle("statistics")} />
                </div>
            </section>

            {/* Section visibility */}
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-[16px] font-semibold text-[#26262B]">Visible Sections</h3>
                        <p className="mt-0.5 text-[13px] text-[#9a978f]">Choose which parts of the page the public can see</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#F6F4EF] px-3 py-1.5 text-[12px] font-medium text-[#57544e]">
                        {publicCount} of {SECTIONS.length} public
                    </span>
                </div>

                <div className="divide-y divide-[#f1ede5]">
                    {SECTIONS.map(({ key, field, icon: Icon, title, description }) => {
                        const isPublic = settings[field];
                        return (
                            <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isPublic ? "bg-[#F6F4EF]" : "bg-[#F6F4EF]/60"}`}>
                                        <Icon className="h-[18px] w-[18px] text-[#57544e]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[14px] font-medium text-[#26262B]">{title}</p>
                                        <p className="truncate text-[12px] text-[#9a978f]">{description}</p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <span className="hidden sm:block">
                                        <VisibilityBadge isPublic={isPublic} />
                                    </span>
                                    <Toggle isOn={isPublic} isLoading={isToggling(key)} onClick={() => handleToggle(key)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
    return isPublic ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
            <Globe className="h-3 w-3" /> Public
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F4EF] px-2.5 py-1 text-[11px] font-medium text-[#9a978f]">
            <Lock className="h-3 w-3" /> Private
        </span>
    );
}

function Toggle({ isOn, isLoading, onClick }: { isOn: boolean; isLoading: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            aria-pressed={isOn}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26262B]/30 focus:ring-offset-2 ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}
        >
            {isLoading ? (
                <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-white" /></span>
            ) : (
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${isOn ? "translate-x-6" : "translate-x-1"}`} />
            )}
        </button>
    );
}

function StatisticsSkeleton() {
    return (
        <div className="space-y-5">
            <Skeleton className="h-8 w-40" />
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-64" /></div>
                </div>
            </section>
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6">
                <Skeleton className="mb-4 h-5 w-40" />
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5">
                        <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-xl" /><div className="space-y-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div></div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                ))}
            </section>
        </div>
    );
}
