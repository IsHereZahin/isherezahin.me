"use client";

import ApplicationOverview from "@/components/admin/dashboard/ApplicationOverview";
import GitHubActivity from "@/components/admin/dashboard/GitHubActivity";
import { BarChart3, Github } from "lucide-react";
import { useRef, useState, type ComponentType, type ReactNode } from "react";

type TabId = "github" | "overview";

interface DashboardTab {
    id: TabId;
    /** Chip label — doubles as the switcher. */
    label: string;
    icon: ComponentType<{ className?: string }>;
    /** Accent applied to the icon while the chip is active. */
    activeIconClass?: string;
    title: string;
    subtitle: string;
    panel: ReactNode;
}

const TABS: DashboardTab[] = [
    {
        id: "github",
        label: "Developer insights",
        icon: Github,
        activeIconClass: "text-[#F4C63D]",
        title: "GitHub Activity",
        subtitle: "Your public development activity and open-source stats",
        panel: <GitHubActivity />,
    },
    {
        id: "overview",
        label: "Full statistics",
        icon: BarChart3,
        title: "Application Overview",
        subtitle: "Traffic, audience, users, and content health at a glance",
        panel: <ApplicationOverview />,
    },
];

export default function Dashboard() {
    const [activeId, setActiveId] = useState<TabId>(TABS[0].id);
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0];

    // Left/right arrows move between tabs, as expected of a tablist.
    const handleKeyDown = (event: React.KeyboardEvent) => {
        const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (offset === 0) return;

        event.preventDefault();
        const index = TABS.findIndex((tab) => tab.id === activeId);
        const next = TABS[(index + offset + TABS.length) % TABS.length];
        setActiveId(next.id);
        tabRefs.current[next.id]?.focus();
    };

    return (
        <div className="space-y-5">
            {/* Title on the left, switcher on the right — one header row. */}
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold tracking-tight text-[var(--s-text)]">
                        {active.title}
                    </h2>
                    <p className="mt-0.5 text-[13px] text-[var(--s-muted)]">{active.subtitle}</p>
                </div>

                {/* The two chips are the switcher: "Developer insights" shows the
                    GitHub panel, "Full statistics" shows the application metrics. */}
                <div
                    role="tablist"
                    aria-label="Dashboard sections"
                    onKeyDown={handleKeyDown}
                    className="flex shrink-0 flex-wrap items-center gap-2"
                >
                    {TABS.map((tab) => {
                        const isActive = tab.id === activeId;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                ref={(node) => {
                                    tabRefs.current[tab.id] = node;
                                }}
                                type="button"
                                role="tab"
                                id={`dashboard-tab-${tab.id}`}
                                aria-selected={isActive}
                                aria-controls={`dashboard-panel-${tab.id}`}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => setActiveId(tab.id)}
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-colors ${isActive
                                    ? "bg-[var(--s-invert)] text-white"
                                    : "border border-[var(--s-border)] bg-[var(--s-card)] text-[var(--s-text2)] hover:bg-[var(--s-soft)] hover:text-[var(--s-text)]"
                                    }`}
                            >
                                <Icon className={`h-3.5 w-3.5 ${isActive ? tab.activeIconClass ?? "" : ""}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Only the selected panel mounts, so the dashboard loads just the
                data it is showing. React Query keeps it cached when switching. */}
            <section
                role="tabpanel"
                id={`dashboard-panel-${active.id}`}
                aria-labelledby={`dashboard-tab-${active.id}`}
                tabIndex={0}
            >
                {active.panel}
            </section>
        </div>
    );
}
