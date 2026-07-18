"use client";

import EditLegalPageModal from "@/components/admin/EditLegalPageModal";
import { Section } from "@/components/ui";
import { legal } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { getFormattedDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, ExternalLink, FileText, Loader2, Pencil, ScrollText, ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

interface LegalPage {
    slug: string;
    title: string;
    subtitle?: string;
    content: string;
    published: boolean;
    updatedAt?: string;
    exists: boolean;
}

const LEGAL_PAGES = [
    {
        slug: "privacy-policy",
        defaultTitle: "Privacy Policy",
        path: "/privacy-policy",
        icon: ShieldCheck,
        description: "How visitor data is collected, stored, and used",
    },
    {
        slug: "terms-of-service",
        defaultTitle: "Terms of Service",
        path: "/terms-of-service",
        icon: ScrollText,
        description: "Rules and conditions for using your site",
    },
] as const;

const fetchLegalPage = async (slug: string): Promise<LegalPage> => {
    try {
        const data = await legal.get(slug);
        return { ...data, exists: true };
    } catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
            return { slug, title: "", content: "", published: false, exists: false };
        }
        throw error;
    }
};

function StatusBadge({ data }: { data?: LegalPage }) {
    const isCreated = Boolean(data?.exists && data?.content);

    if (!isCreated) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--s-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--s-muted)]">
                <XCircle className="h-3 w-3" /> Not created
            </span>
        );
    }

    if (data?.published) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <CheckCircle className="h-3 w-3" /> Published
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Draft
        </span>
    );
}

export default function AdminLegalPagesPage() {
    const { isAdmin, status } = useAuth();
    const [editingSlug, setEditingSlug] = useState<"privacy-policy" | "terms-of-service" | null>(null);

    const { data: privacyPolicy, isLoading: privacyLoading } = useQuery({
        queryKey: ["legal-page", "privacy-policy"],
        queryFn: () => fetchLegalPage("privacy-policy"),
        staleTime: 1000 * 60 * 5,
    });

    const { data: termsOfService, isLoading: termsLoading } = useQuery({
        queryKey: ["legal-page", "terms-of-service"],
        queryFn: () => fetchLegalPage("terms-of-service"),
        staleTime: 1000 * 60 * 5,
    });

    if (status === "loading") {
        return (
            <Section id="admin-legal" className="">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </Section>
        );
    }

    if (!isAdmin) {
        redirect("/");
    }

    const isLoading = privacyLoading || termsLoading;
    const pages = [
        { ...LEGAL_PAGES[0], data: privacyPolicy },
        { ...LEGAL_PAGES[1], data: termsOfService },
    ];

    const publishedCount = pages.filter((p) => p.data?.exists && p.data?.content && p.data?.published).length;
    const draftCount = pages.filter((p) => p.data?.exists && p.data?.content && !p.data?.published).length;
    const notCreatedCount = pages.filter((p) => !(p.data?.exists && p.data?.content)).length;

    const stats = [
        { label: "Published", value: publishedCount },
        { label: "Drafts", value: draftCount },
        { label: "Not created", value: notCreatedCount },
    ];

    return (
        <Section id="admin-legal" className="">
            {isLoading ? (
                <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-[var(--s-soft)]" />
                        ))}
                    </div>
                    <div className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="h-5 w-40 animate-pulse rounded bg-[var(--s-soft2)]" />
                        <div className="mt-5 space-y-4">
                            {[0, 1].map((i) => (
                                <div key={i} className="h-16 animate-pulse rounded-2xl bg-[var(--s-soft)]" />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Summary tiles */}
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-2xl bg-[var(--s-soft)] px-4 py-3">
                                <p className="text-[22px] font-semibold leading-none text-[var(--s-text)]">{stat.value}</p>
                                <p className="mt-1.5 text-[12px] text-[var(--s-muted)]">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pages list */}
                    <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                                <FileText className="h-5 w-5 text-[var(--s-text)]" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-semibold text-[var(--s-text)]">Legal Pages</h3>
                                <p className="text-[12px] text-[var(--s-muted)]">
                                    Manage the privacy policy and terms of service shown across your site
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 divide-y divide-[var(--s-border-soft)]">
                            {pages.map(({ slug, defaultTitle, path, icon: Icon, description, data }) => (
                                <div
                                    key={slug}
                                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-start gap-3.5">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--s-soft)]">
                                            <Icon className="h-[18px] w-[18px] text-[var(--s-text2)]" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[15px] font-semibold text-[var(--s-text)]">
                                                {data?.title || defaultTitle}
                                            </h4>
                                            <p className="mt-0.5 text-[12px] text-[var(--s-muted)]">{description}</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <StatusBadge data={data} />
                                                {data?.updatedAt && (
                                                    <span className="text-[11px] text-[var(--s-muted)]">
                                                        Updated {getFormattedDate(data.updatedAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 pl-[54px] sm:pl-0">
                                        <Link
                                            href={path}
                                            title="View page"
                                            className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--s-border)] bg-[var(--s-card)] px-4 text-[13px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            <span className="hidden sm:inline">View</span>
                                        </Link>
                                        <button
                                            onClick={() => setEditingSlug(slug as "privacy-policy" | "terms-of-service")}
                                            title="Edit page"
                                            className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--s-border)] bg-[var(--s-card)] px-4 text-[13px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {editingSlug && (
                <EditLegalPageModal
                    open={!!editingSlug}
                    onOpenChange={(open) => !open && setEditingSlug(null)}
                    slug={editingSlug}
                    initialData={
                        editingSlug === "privacy-policy"
                            ? privacyPolicy?.exists ? privacyPolicy : null
                            : termsOfService?.exists ? termsOfService : null
                    }
                />
            )}
        </Section>
    );
}
