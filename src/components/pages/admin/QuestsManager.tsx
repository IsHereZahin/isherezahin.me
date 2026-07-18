"use client";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import QuestModal, { type Quest } from "@/components/admin/QuestModal";
import { BlurImage } from "@/components/ui";
import { quests as questsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Calendar, CheckCircle2, ExternalLink, EyeOff, Images, Loader2, MapPin, Pencil, Plus, Search, Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type StatusFilter = "all" | "active" | "inactive";

const fmtDate = (d: string) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/** First usable image for the row thumbnail (image src, or a video's thumbnail). */
function questThumb(quest: Quest): string | null {
    for (const m of quest.media ?? []) {
        if (m.type === "image" && m.src) return m.src;
        if (m.type === "video" && m.thumbnail) return m.thumbnail;
    }
    return null;
}

function StatusBadge({ active }: { active: boolean }) {
    return active ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600 dark:bg-green-500/15 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3" /> Active
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--s-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--s-muted)]">
            <EyeOff className="h-3 w-3" /> Hidden
        </span>
    );
}

export default function QuestsManager() {
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [addOpen, setAddOpen] = useState(false);
    const [editQuest, setEditQuest] = useState<Quest | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Quest | null>(null);

    const { data, isLoading } = useQuery<{ quests: Quest[] }>({
        queryKey: ["quests"],
        queryFn: questsApi.getAll,
        enabled: isAdmin,
        staleTime: 1000 * 60,
    });

    const delMutation = useMutation({
        mutationFn: (id: string) => questsApi.delete(id),
        onSuccess: () => {
            toast.success("Quest deleted");
            queryClient.invalidateQueries({ queryKey: ["quests"] });
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
    });

    const allQuests = data?.quests ?? [];
    const quests = allQuests.filter((q) => {
        const matchesStatus = status === "all" || (status === "active" ? q.isActive : !q.isActive);
        const term = search.trim().toLowerCase();
        const matchesSearch = !term || q.title.toLowerCase().includes(term) || q.location.toLowerCase().includes(term);
        return matchesStatus && matchesSearch;
    });

    const filters: { key: StatusFilter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "active", label: "Active" },
        { key: "inactive", label: "Hidden" },
    ];

    return (
        <div className="space-y-5">
            {/* Toolbar */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--s-muted)]" />
                        <input
                            type="text"
                            placeholder="Search quests by title or location…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-full border border-[var(--s-border)] bg-[var(--s-card)] pl-10 pr-4 text-[13px] text-[var(--s-text)] placeholder:text-[var(--s-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--s-text)]/15"
                        />
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-[var(--s-soft)] p-1">
                        {filters.map((f) => {
                            const active = status === f.key;
                            return (
                                <button
                                    key={f.key}
                                    onClick={() => setStatus(f.key)}
                                    className={`h-8 rounded-full px-3.5 text-[12px] font-medium transition-colors ${
                                        active ? "bg-[var(--s-invert)] text-white" : "text-[var(--s-text2)] hover:text-[var(--s-text)]"
                                    }`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setAddOpen(true)}
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--s-invert)] px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
                    >
                        <Plus className="h-4 w-4" />
                        New Quest
                    </button>
                </div>
            </section>

            {/* List */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-[var(--s-muted)]" />
                    </div>
                ) : quests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                            <MapPin className="h-5 w-5 text-[var(--s-muted)]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-[var(--s-text)]">No side quests found</p>
                            <p className="mt-0.5 text-[12px] text-[var(--s-muted)]">
                                {search || status !== "all" ? "Try adjusting your search or filter." : "Add your first side quest to share an adventure."}
                            </p>
                        </div>
                        {!search && status === "all" && (
                            <button
                                onClick={() => setAddOpen(true)}
                                className="mt-1 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
                            >
                                <Plus className="h-4 w-4" /> New Quest
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--s-border-soft)]">
                        {quests.map((quest) => {
                            const thumb = questThumb(quest);
                            const mediaCount = quest.media?.length ?? 0;
                            return (
                                <div key={quest.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-3.5">
                                        {thumb ? (
                                            <BlurImage
                                                src={thumb}
                                                alt={quest.title}
                                                width={72}
                                                height={48}
                                                className="h-12 w-[72px] shrink-0 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-[72px] shrink-0 items-center justify-center rounded-lg bg-[var(--s-soft)]">
                                                <MapPin className="h-5 w-5 text-[var(--s-muted)]" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-[14px] font-semibold text-[var(--s-text)]">{quest.title}</p>
                                                <StatusBadge active={quest.isActive ?? true} />
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--s-muted)]">
                                                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{quest.location}</span>
                                                {fmtDate(quest.date) && <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(quest.date)}</span>}
                                                <span className="inline-flex items-center gap-1"><Images className="h-3.5 w-3.5" />{mediaCount} {mediaCount === 1 ? "item" : "items"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                                        <Link
                                            href="/side-quests"
                                            target="_blank"
                                            rel="noreferrer"
                                            title="View on site"
                                            aria-label="View on site"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => setEditQuest(quest)}
                                            title="Edit"
                                            aria-label="Edit"
                                            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] px-3 text-[13px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(quest)}
                                            title="Delete"
                                            aria-label="Delete"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#EE5D4A] transition-colors hover:bg-[#EE5D4A]/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Create modal */}
            <QuestModal open={addOpen} onOpenChange={setAddOpen} />

            {/* Edit modal */}
            {editQuest && (
                <QuestModal open={!!editQuest} onOpenChange={(o) => !o && setEditQuest(null)} quest={editQuest} />
            )}

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title="Delete side quest?"
                description={`"${deleteTarget?.title ?? ""}" will be permanently removed. This action cannot be undone.`}
                onConfirm={async () => {
                    if (deleteTarget) await delMutation.mutateAsync(deleteTarget.id);
                    setDeleteTarget(null);
                }}
            />
        </div>
    );
}
