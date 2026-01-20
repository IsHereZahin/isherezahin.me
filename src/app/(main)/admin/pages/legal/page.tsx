"use client";

import EditLegalPageModal from "@/components/admin/EditLegalPageModal";
import { Section } from "@/components/ui";
import { legal } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { getFormattedDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, ExternalLink, FileText, Loader2, Pencil, XCircle } from "lucide-react";
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
    { slug: "privacy-policy", defaultTitle: "Privacy Policy", path: "/privacy-policy" },
    { slug: "terms-of-service", defaultTitle: "Terms of Service", path: "/terms-of-service" },
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
            <Section id="admin-legal" className="px-6 py-16 max-w-4xl">
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

    return (
        <Section id="admin-legal" className="px-6 py-16 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Legal Pages</h1>
                <p className="text-muted-foreground">
                    Manage your Privacy Policy and Terms of Service pages.
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {pages.map(({ slug, defaultTitle, path, data }) => (
                        <div
                            key={slug}
                            className="flex items-center justify-between p-4 sm:p-6 rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {data?.title || defaultTitle}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        {data?.exists && data?.content ? (
                                            <span className="flex items-center gap-1 text-xs text-green-500">
                                                <CheckCircle className="w-3 h-3" />
                                                {data.published ? "Published" : "Draft"}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <XCircle className="w-3 h-3" />
                                                Not created
                                            </span>
                                        )}
                                        {data?.updatedAt && (
                                            <span className="text-xs text-muted-foreground">
                                                Updated {getFormattedDate(data.updatedAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={path}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                    title="View page"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => setEditingSlug(slug as "privacy-policy" | "terms-of-service")}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                    title="Edit page"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
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
