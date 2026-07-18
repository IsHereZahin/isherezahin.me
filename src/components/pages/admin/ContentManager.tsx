"use client";

import AddBlogModal from "@/components/admin/AddBlogModal";
import AddProjectModal from "@/components/admin/AddProjectModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import EditBlogModal from "@/components/admin/EditBlogModal";
import EditProjectModal from "@/components/admin/EditProjectModal";
import { BlurImage } from "@/components/ui";
import { deleteBlog, deleteProject, getBlogs, getProjects } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import type { Blog, Project } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Building2, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Eye, FileText,
    FolderKanban, Heart, Loader2, Pencil, Plus, Search, Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ContentType = "blog" | "project";
type StatusFilter = "all" | "published" | "draft";
type Item = Blog | Project;

interface ListResponse {
    total: number;
    page: number;
    limit: number;
    blogs?: Blog[];
    projects?: Project[];
}

const LIMIT = 10;

const CONFIG = {
    blog: {
        singular: "Blog", plural: "Blogs", listKey: "blogs", field: "blogs" as const,
        viewBase: "/blogs", icon: FileText,
        list: (page: number, search: string, status: string) => getBlogs(page, LIMIT, [], search, status) as Promise<ListResponse>,
        del: (slug: string) => deleteBlog(slug),
    },
    project: {
        singular: "Project", plural: "Projects", listKey: "projects", field: "projects" as const,
        viewBase: "/projects", icon: FolderKanban,
        list: (page: number, search: string, status: string) => getProjects(page, LIMIT, [], search, status) as Promise<ListResponse>,
        del: (slug: string) => deleteProject(slug),
    },
} as const;

function StatusBadge({ published }: { published: boolean }) {
    return published ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600 dark:bg-green-500/15 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3" /> Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Draft
        </span>
    );
}

const fmtDate = (d: string) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function ContentManager({ type }: { type: ContentType }) {
    const cfg = CONFIG[type];
    const isBlog = type === "blog";
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<Item | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce the search box; reset to page 1 on any query change.
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [searchInput]);

    const { data, isLoading } = useQuery({
        // Keyed under the shared "blogs"/"projects" prefix so the add/edit modals'
        // invalidateQueries(["blogs"|"projects"]) refetch this list automatically.
        queryKey: [cfg.listKey, "admin-manage", search, status, page],
        queryFn: () => cfg.list(page, search, status === "all" ? "" : status),
        enabled: isAdmin,
        staleTime: 1000 * 60,
    });

    const delMutation = useMutation({
        mutationFn: (slug: string) => cfg.del(slug),
        onSuccess: () => {
            toast.success(`${cfg.singular} deleted`);
            queryClient.invalidateQueries({ queryKey: [cfg.listKey] });
            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
    });

    const items: Item[] = (data?.[cfg.field] as Item[] | undefined) ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / LIMIT);

    const filters: { key: StatusFilter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "published", label: "Published" },
        { key: "draft", label: "Drafts" },
    ];

    return (
        <div className="space-y-5">
            {/* Toolbar: search + status filter + add */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--s-muted)]" />
                        <input
                            type="text"
                            placeholder={`Search ${cfg.plural.toLowerCase()} by title…`}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="h-10 w-full rounded-full border border-[var(--s-border)] bg-[var(--s-card)] pl-10 pr-4 text-[13px] text-[var(--s-text)] placeholder:text-[var(--s-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--s-text)]/15"
                        />
                    </div>

                    {/* Status segmented control */}
                    <div className="flex items-center gap-1 rounded-full bg-[var(--s-soft)] p-1">
                        {filters.map((f) => {
                            const active = status === f.key;
                            return (
                                <button
                                    key={f.key}
                                    onClick={() => { setStatus(f.key); setPage(1); }}
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
                        New {cfg.singular}
                    </button>
                </div>
            </section>

            {/* List */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-[var(--s-muted)]" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                            <cfg.icon className="h-5 w-5 text-[var(--s-muted)]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-[var(--s-text)]">No {cfg.plural.toLowerCase()} found</p>
                            <p className="mt-0.5 text-[12px] text-[var(--s-muted)]">
                                {search || status !== "all" ? "Try adjusting your search or filter." : `Create your first ${cfg.singular.toLowerCase()} to get started.`}
                            </p>
                        </div>
                        {!search && status === "all" && (
                            <button
                                onClick={() => setAddOpen(true)}
                                className="mt-1 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
                            >
                                <Plus className="h-4 w-4" /> New {cfg.singular}
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-[var(--s-border-soft)]">
                            {items.map((item) => {
                                const project = !isBlog ? (item as Project) : null;
                                return (
                                    <div key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-start gap-3.5">
                                            <BlurImage
                                                src={item.imageSrc || "/default-avatar.png"}
                                                alt={item.title}
                                                width={72}
                                                height={48}
                                                className="h-12 w-[72px] shrink-0 rounded-lg object-cover"
                                            />
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate text-[14px] font-semibold text-[var(--s-text)]">{item.title}</p>
                                                    <StatusBadge published={item.published} />
                                                </div>
                                                <p className="mt-0.5 truncate text-[12px] text-[var(--s-muted)]">{cfg.viewBase}/{item.slug}</p>
                                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--s-muted)]">
                                                    <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{item.views}</span>
                                                    <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{item.likes}</span>
                                                    {project?.company && (
                                                        <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{project.company}</span>
                                                    )}
                                                    {fmtDate(item.date) && <span>{fmtDate(item.date)}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                                            <Link
                                                href={`${cfg.viewBase}/${item.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="View"
                                                aria-label="View"
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => setEditItem(item)}
                                                title="Edit"
                                                aria-label="Edit"
                                                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] px-3 text-[13px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="hidden sm:inline">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
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

                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--s-border-soft)] pt-4">
                                <p className="text-[13px] text-[var(--s-muted)]">
                                    Page {page} of {totalPages} ({total} {total === 1 ? cfg.singular.toLowerCase() : cfg.plural.toLowerCase()})
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        aria-label="Previous page"
                                        className="rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] p-2 text-[var(--s-text)] transition hover:bg-[var(--s-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page >= totalPages}
                                        aria-label="Next page"
                                        className="rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] p-2 text-[var(--s-text)] transition hover:bg-[var(--s-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Create / edit modals (reused from the site) */}
            {isBlog ? (
                <>
                    <AddBlogModal open={addOpen} onOpenChange={setAddOpen} />
                    {editItem && (
                        <EditBlogModal
                            open={!!editItem}
                            onOpenChange={(o) => !o && setEditItem(null)}
                            blog={editItem as Blog}
                        />
                    )}
                </>
            ) : (
                <>
                    <AddProjectModal open={addOpen} onOpenChange={setAddOpen} />
                    {editItem && (
                        <EditProjectModal
                            open={!!editItem}
                            onOpenChange={(o) => !o && setEditItem(null)}
                            project={editItem as Project}
                        />
                    )}
                </>
            )}

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                title={`Delete ${cfg.singular.toLowerCase()}?`}
                description={`"${deleteTarget?.title ?? ""}" will be permanently removed. This action cannot be undone.`}
                onConfirm={async () => {
                    if (deleteTarget) await delMutation.mutateAsync(deleteTarget.slug);
                    setDeleteTarget(null);
                }}
            />
        </div>
    );
}
