"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { adminSubscribers, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Mail, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Subscriber { id: string; email: string; isActive: boolean; subscribedAt: string; createdAt: string; }
interface Pagination { page: number; limit: number; total: number; totalPages: number; }
interface SubscribersResponse { subscribers: Subscriber[]; pagination: Pagination; }

export default function Subscribers() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
    const [page, setPage] = useState(1);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { setDebouncedSearch(searchInput); setPage(1); }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [searchInput]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["admin-subscribers", debouncedSearch, filter, page],
        queryFn: () => adminSubscribers.getAll(debouncedSearch, filter, page),
        enabled: isAdmin,
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminSubscribers.toggleStatus(id, isActive ? "deactivate" : "activate"),
        onSuccess: (result, { id }) => {
            queryClient.setQueryData<SubscribersResponse>(["admin-subscribers", debouncedSearch, filter, page], (old) => {
                if (!old) return old;
                return { ...old, subscribers: old.subscribers.map((s) => s.id === id ? { ...s, isActive: result.isActive } : s) };
            });
            toast.success(result.message);
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update subscriber"),
    });

    const deleteMutation = useMutation({
        mutationFn: adminSubscribers.delete,
        onSuccess: (result, id) => {
            queryClient.setQueryData<SubscribersResponse>(["admin-subscribers", debouncedSearch, filter, page], (old) => {
                if (!old) return old;
                return { ...old, subscribers: old.subscribers.filter((s) => s.id !== id) };
            });
            toast.success(result.message);
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to delete subscriber"),
    });

    if (error instanceof ApiError && error.status === 403) { router.push("/"); return null; }
    if (!isAdmin) return null;

    const subscribers = data?.subscribers || [];
    const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };
    const isActionLoading = (id: string) => (toggleMutation.isPending && toggleMutation.variables?.id === id) || (deleteMutation.isPending && deleteMutation.variables === id);

    const activeOnPage = subscribers.filter((s: Subscriber) => s.isActive).length;
    const inactiveOnPage = subscribers.length - activeOnPage;
    const isFiltering = debouncedSearch.length > 0 || filter !== "all";

    return (
        <div className="space-y-5">
            {/* Summary */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-3 gap-2.5">
                    <StatTile value={pagination.total} label="Total subscribers" />
                    <StatTile value={activeOnPage} label="Active on this page" />
                    <StatTile value={inactiveOnPage} label="Inactive on this page" />
                </div>
            </section>

            {/* List */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--s-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="h-10 w-full rounded-full border border-[var(--s-border)] bg-[var(--s-card)] pl-10 pr-4 text-[13px] text-[var(--s-text)] placeholder:text-[var(--s-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--s-text)]/30"
                        />
                    </div>
                    <Select value={filter} onValueChange={(v) => { setFilter(v as "all" | "active" | "inactive"); setPage(1); }}>
                        <SelectTrigger className="h-10 w-full rounded-full border-[var(--s-border)] text-[13px] sm:w-[140px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Rows */}
                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[var(--s-muted)]" /></div>
                    ) : subscribers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                                <Mail className="h-5 w-5 text-[var(--s-muted)]" />
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-[var(--s-text)]">No subscribers found</p>
                                <p className="mt-0.5 text-[12px] text-[var(--s-muted)]">
                                    {isFiltering ? "Try adjusting your search or filter." : "Your newsletter audience will appear here."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-[var(--s-border-soft)]">
                                {subscribers.map((subscriber: Subscriber) => (
                                    <div key={subscriber.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--s-soft)] text-[13px] font-semibold text-[var(--s-text)] ${subscriber.isActive ? "" : "opacity-60"}`}>
                                                {subscriber.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-[14px] font-medium text-[var(--s-text)]">{subscriber.email}</p>
                                                    {subscriber.isActive ? (
                                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--s-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--s-muted)]">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--s-faint)]" /> Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-[12px] text-[var(--s-muted)]">Subscribed {new Date(subscriber.subscribedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                                            <button
                                                onClick={() => toggleMutation.mutate({ id: subscriber.id, isActive: subscriber.isActive })}
                                                disabled={isActionLoading(subscriber.id)}
                                                className={subscriber.isActive
                                                    ? "inline-flex h-10 items-center gap-2 rounded-full border border-[var(--s-border)] bg-[var(--s-card)] px-4 text-[13px] font-medium text-[var(--s-text)] transition hover:bg-[var(--s-soft)] disabled:opacity-50"
                                                    : "inline-flex h-10 items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-50"}
                                            >
                                                {isActionLoading(subscriber.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : subscriber.isActive ? <><UserX className="h-4 w-4" />Deactivate</> : <><UserCheck className="h-4 w-4" />Activate</>}
                                            </button>
                                            <button
                                                onClick={() => { if (confirm("Are you sure you want to delete this subscriber?")) deleteMutation.mutate(subscriber.id); }}
                                                disabled={isActionLoading(subscriber.id)}
                                                aria-label="Delete subscriber"
                                                title="Delete subscriber"
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--s-border)] text-[#EE5D4A] transition hover:bg-[#EE5D4A]/10 disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between border-t border-[var(--s-border-soft)] pt-4">
                                    <p className="text-[13px] text-[var(--s-muted)]">Page {pagination.page} of {pagination.totalPages} · {pagination.total} subscribers</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setPage((p) => p - 1)} disabled={pagination.page === 1} aria-label="Previous page" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--s-border)] text-[var(--s-text)] transition hover:bg-[var(--s-soft)] disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                                        <button onClick={() => setPage((p) => p + 1)} disabled={pagination.page === pagination.totalPages} aria-label="Next page" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--s-border)] text-[var(--s-text)] transition hover:bg-[var(--s-soft)] disabled:cursor-not-allowed disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

function StatTile({ value, label }: { value: number; label: string }) {
    return (
        <div className="rounded-2xl bg-[var(--s-soft)] px-4 py-3">
            <p className="text-[20px] font-bold leading-none text-[var(--s-text)]">{value}</p>
            <p className="mt-1.5 text-[12px] text-[var(--s-muted)]">{label}</p>
        </div>
    );
}
