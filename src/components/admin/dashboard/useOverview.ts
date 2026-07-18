"use client";

import { statistics } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// ---------------------------------------------------------------------------
// Application overview (business metrics) — /api/admin/overview
// ---------------------------------------------------------------------------

export interface OverviewData {
    users: { total: number; active: number; banned: number; newThisWeek: number; github: number; google: number };
    subscribers: { total: number; active: number; inactive: number; newThisWeek: number };
    content: {
        blogs: { total: number; published: number; draft: number };
        projects: { total: number; published: number; draft: number };
        totalViews: number;
        totalLikes: number;
        top: { title: string; slug: string; type: "Blog" | "Project"; views: number; likes: number }[];
    };
    messages: { total: number; unread: number };
}

export function useOverview() {
    return useQuery<OverviewData>({
        queryKey: ["admin-overview"],
        queryFn: async () => {
            const res = await fetch("/api/admin/overview");
            if (!res.ok) throw new Error("Failed to load overview data");
            return res.json();
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}

// ---------------------------------------------------------------------------
// Visitor analytics — reuses the existing /api/statistics endpoint. As admin
// this returns every section regardless of the public visibility toggles.
// ---------------------------------------------------------------------------

export interface TrendPoint { date: string; visitors: number; uniqueVisitors: number }

export interface StatisticsData {
    totalVisitors?: number;
    uniqueVisitors?: number;
    visitorTrends?: TrendPoint[];
    deviceStats?: { device: string; count: number }[];
    countryStats?: { country: string; count: number }[];
    pathStats?: { path: string; count: number }[];
    refStats?: { ref: string; count: number }[];
}

export function useStatistics() {
    return useQuery<StatisticsData>({
        queryKey: ["admin-dashboard-statistics"],
        queryFn: statistics.get,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Compact, locale-aware number: 1250 -> "1,250", 12_500 -> "12.5k". */
export function fmtCompact(n: number): string {
    if (Math.abs(n) >= 1000) {
        return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
    }
    return n.toLocaleString("en-US");
}

export function fmtFull(n: number): string {
    return n.toLocaleString("en-US");
}

/**
 * Percentage change of the most recent 7 days versus the previous 7 days,
 * derived from the daily visitor trend. Returns null when there isn't enough
 * history to compare meaningfully.
 */
export function weeklyDelta(trend: TrendPoint[] | undefined, key: "visitors" | "uniqueVisitors" = "visitors") {
    if (!trend || trend.length < 8) return null;
    const last7 = trend.slice(-7).reduce((s, d) => s + (d[key] || 0), 0);
    const prev7 = trend.slice(-14, -7).reduce((s, d) => s + (d[key] || 0), 0);
    if (prev7 === 0) return last7 > 0 ? { pct: 100, dir: "up" as const, value: last7 } : null;
    const pct = Math.round(((last7 - prev7) / prev7) * 100);
    return { pct: Math.abs(pct), dir: pct >= 0 ? ("up" as const) : ("down" as const), value: last7 };
}
