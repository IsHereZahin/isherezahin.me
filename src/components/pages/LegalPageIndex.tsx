"use client";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import MarkdownPreview from "@/components/content/discussions/MarkdownPreview";
import {
    AdminEmptyState,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    EmptyState,
    Heading,
    Section,
    Skeleton,
    TextGradient
} from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { getFormattedDate } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditLegalPageModal from "../admin/EditLegalPageModal";

// Legal page specific loading skeleton
function LegalPageLoading() {
    return (
        <Section id="legal" className="px-6 py-16 max-w-4xl">
            <div className="text-center mb-6 sm:mb-8">
                {/* Title skeleton */}
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                {/* Subtitle skeleton */}
                <Skeleton className="h-6 w-96 mx-auto mb-4" />
                {/* Date skeleton */}
                <Skeleton className="h-4 w-40 mx-auto" />
            </div>
            {/* Content skeleton */}
            <div className="space-y-4 mt-8">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
                <div className="pt-4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
            </div>
        </Section>
    );
}

interface LegalPageIndexProps {
    slug: "privacy-policy" | "terms-of-service";
    pageTitle: string;
    pageSubtitle: string;
}

const fetchLegalPage = async (slug: string) => {
    const response = await fetch(`/api/legal/${slug}`);
    if (!response.ok) {
        const data = await response.json();
        if (response.status === 404) {
            return { exists: false };
        }
        throw new Error(data.error || "Failed to fetch page");
    }
    return { exists: true, ...(await response.json()) };
};

const resetLegalPage = async (slug: string) => {
    const response = await fetch(`/api/legal/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: slug === "privacy-policy" ? "Privacy Policy" : "Terms of Service",
            content: "",
            published: false,
        }),
    });
    if (!response.ok) throw new Error("Failed to reset page");
    return response.json();
};

export default function LegalPageIndex({ slug, pageTitle, pageSubtitle }: Readonly<LegalPageIndexProps>) {
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["legal-page", slug],
        queryFn: () => fetchLegalPage(slug),
        staleTime: 1000 * 60 * 5,
    });

    const resetMutation = useMutation({
        mutationFn: () => resetLegalPage(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["legal-page", slug] });
            toast.success("Page reset successfully");
        },
        onError: () => {
            toast.error("Failed to reset page");
        },
    });

    const handleDelete = async () => {
        try {
            await resetMutation.mutateAsync();
            toast.success("Page reset successfully");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to reset page";
            toast.error(message);
        }
    };

    if (isLoading) return <LegalPageLoading />;

    if (isError) {
        return (
            <Section id="legal" className="px-6 py-16 max-w-4xl">
                <p className="text-red-500">{error instanceof Error ? error.message : "Failed to load page"}</p>
            </Section>
        );
    }

    const pageExists = data?.exists && data?.content;
    const showEmptyState = !pageExists;

    // Empty state for when no content exists (public view)
    if (showEmptyState && !isAdmin) {
        return (
            <Section id="legal" className="px-6 py-16 max-w-4xl">
                <EmptyState type={slug} title={pageTitle} />
            </Section>
        );
    }

    // Admin empty state with add button
    if (showEmptyState && isAdmin) {
        return (
            <Section id="legal" className="px-6 py-16 max-w-4xl">
                <AdminEmptyState type={slug} onAdd={() => setIsEditOpen(true)} />
                <EditLegalPageModal
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    slug={slug}
                    initialData={data?.exists ? data : null}
                />
            </Section>
        );
    }

    // Content exists - show the page
    return (
        <>
            <Section id="legal_header" animate className="px-6 pt-16 max-w-4xl">
                <div className="text-center mb-6 sm:mb-8 relative">
                    {isAdmin && (
                        <div className="absolute right-0 top-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer">
                                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditOpen(true)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit Page
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => setIsResetOpen(true)}>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset Page
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                    {!data.published && isAdmin && (
                        <span className="inline-block px-3 py-1 mb-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-medium">
                            Unpublished
                        </span>
                    )}
                </div>
                <Heading size="lg" className="mb-4 sm:mb-6 text-center" text={data.title || pageTitle} />
                <TextGradient text={data.subtitle || pageSubtitle} className="max-w-2xl mx-auto text-center" />
                {data.updatedAt && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Last updated: {getFormattedDate(data.updatedAt)}
                    </p>
                )}
            </Section>

            <Section id="legal_content" className="px-6 py-8 max-w-4xl">
                <div className="prose prose-invert max-w-none">
                    <MarkdownPreview content={data.content} />
                </div>
            </Section>

            {isAdmin && (
                <>
                    <EditLegalPageModal
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        slug={slug}
                        initialData={data}
                    />
                    <DeleteConfirmDialog
                        open={isResetOpen}
                        onOpenChange={setIsResetOpen}
                        title="Reset Page"
                        description={`Are you sure you want to reset "${data.title}"? This will clear all content.`}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </>
    );
}
