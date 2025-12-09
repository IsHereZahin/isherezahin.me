"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/hooks/useAuth";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    Mail,
    MailCheck,
    MailX,
    Search,
    Trash2,
    UserCheck,
    UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Subscriber {
    id: string;
    email: string;
    isActive: boolean;
    subscribedAt: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function Subscribers() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 400);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchInput]);

    const fetchSubscribers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search: debouncedSearch,
                filter,
                page: pagination.page.toString(),
            });
            const response = await fetch(`/api/admin/subscribers?${params}`);
            const data = await response.json();

            if (response.ok) {
                setSubscribers(data.subscribers);
                setPagination(data.pagination);
            } else if (response.status === 403) {
                router.push("/");
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            toast.error("Failed to load subscribers");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, filter, pagination.page, router]);

    useEffect(() => {
        if (!isAdmin) {
            router.push("/");
            return;
        }
        fetchSubscribers();
    }, [isAdmin, fetchSubscribers, router]);

    const handleToggleStatus = async (subscriberId: string, currentlyActive: boolean) => {
        setActionLoading(subscriberId);
        try {
            const response = await fetch(`/api/admin/subscribers/${subscriberId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: currentlyActive ? "deactivate" : "activate",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubscribers((prev) =>
                    prev.map((s) =>
                        s.id === subscriberId ? { ...s, isActive: data.isActive } : s
                    )
                );
                toast.success(data.message);
            } else {
                toast.error(data.error || "Failed to update subscriber");
            }
        } catch (error) {
            console.error("Error updating subscriber:", error);
            toast.error("Failed to update subscriber");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (subscriberId: string) => {
        if (!confirm("Are you sure you want to delete this subscriber?")) return;

        setActionLoading(subscriberId);
        try {
            const response = await fetch(`/api/admin/subscribers/${subscriberId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                setSubscribers((prev) => prev.filter((s) => s.id !== subscriberId));
                toast.success(data.message);
            } else {
                toast.error(data.error || "Failed to delete subscriber");
            }
        } catch (error) {
            console.error("Error deleting subscriber:", error);
            toast.error("Failed to delete subscriber");
        } finally {
            setActionLoading(null);
        }
    };

    if (!isAdmin) return null;

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Manage Subscribers</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <Select
                    value={filter}
                    onValueChange={(v) => {
                        setFilter(v as "all" | "active" | "inactive");
                        setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : subscribers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No subscribers found.
                </p>
            ) : (
                <>
                    <div className="space-y-3">
                        {subscribers.map((subscriber) => (
                            <div
                                key={subscriber.id}
                                className={`border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${!subscriber.isActive
                                        ? "border-muted bg-muted/20"
                                        : "border-border"
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`p-2 rounded-full ${subscriber.isActive ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                                        {subscriber.isActive ? (
                                            <MailCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <MailX className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm truncate">
                                                {subscriber.email}
                                            </p>
                                            {subscriber.isActive ? (
                                                <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-xs bg-gray-400 text-white rounded-full">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Subscribed {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-start sm:self-auto">
                                    <button
                                        onClick={() => handleToggleStatus(subscriber.id, subscriber.isActive)}
                                        disabled={actionLoading === subscriber.id}
                                        className={`flex items-center gap-2 text-sm font-medium rounded-md px-3 py-2 transition ${subscriber.isActive
                                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                                : "bg-green-600 text-white hover:bg-green-700"
                                            } disabled:opacity-50`}
                                    >
                                        {actionLoading === subscriber.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : subscriber.isActive ? (
                                            <>
                                                <UserX className="h-4 w-4" />
                                                Deactivate
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck className="h-4 w-4" />
                                                Activate
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subscriber.id)}
                                        disabled={actionLoading === subscriber.id}
                                        className="flex items-center gap-2 text-sm font-medium rounded-md px-3 py-2 transition bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Page {pagination.page} of {pagination.totalPages} (
                                {pagination.total} subscribers)
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setPagination((prev) => ({
                                            ...prev,
                                            page: prev.page - 1,
                                        }))
                                    }
                                    disabled={pagination.page === 1}
                                    className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() =>
                                        setPagination((prev) => ({
                                            ...prev,
                                            page: prev.page + 1,
                                        }))
                                    }
                                    disabled={pagination.page === pagination.totalPages}
                                    className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
