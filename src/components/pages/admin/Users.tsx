"use client";

import { BlurImage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { adminUsers, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, ChevronLeft, ChevronRight, Crown, Loader2, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    username: string;
    provider: "github" | "google";
    isBanned: boolean;
    isAdmin: boolean;
    createdAt: string;
}

interface Pagination { page: number; limit: number; total: number; totalPages: number; }
interface UsersResponse { users: User[]; pagination: Pagination; }

export default function Users() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "banned">("all");
    const [page, setPage] = useState(1);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1);
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [searchInput]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["admin-users", debouncedSearch, filter, page],
        queryFn: () => adminUsers.getAll(debouncedSearch, filter, page),
        enabled: isAdmin,
    });

    const banMutation = useMutation({
        mutationFn: ({ userId, currentlyBanned }: { userId: string; currentlyBanned: boolean }) =>
            adminUsers.toggleBan(userId, currentlyBanned ? "unban" : "ban"),
        onSuccess: (result, { userId }) => {
            queryClient.setQueryData<UsersResponse>(["admin-users", debouncedSearch, filter, page], (old) => {
                if (!old) return old;
                return { ...old, users: old.users.map((u) => u.id === userId ? { ...u, isBanned: result.isBanned } : u) };
            });
            toast.success(result.message);
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update user");
        },
    });

    if (error instanceof ApiError && error.status === 403) { router.push("/"); return null; }
    if (!isAdmin) return null;

    const users = data?.users || [];
    const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 icon-bw" />
                <h3 className="text-base font-semibold">Manage Users</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" placeholder="Search by name, email, or username..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <Select value={filter} onValueChange={(v) => { setFilter(v as "all" | "active" | "banned"); setPage(1); }}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>
            ) : (
                <>
                    <div className="space-y-3">
                        {users.map((user: User) => (
                            <div key={user.id} className={`border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${user.isBanned ? "border-destructive/50 bg-destructive/5" : "border-border"}`}>
                                <div className="flex items-center gap-3 min-w-0">
                                    <BlurImage src={user.image || "/default-avatar.png"} alt={user.name || "User"} width={40} height={40} className="rounded-full" />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm truncate">{user.name || "Unknown"}</p>
                                            {user.isAdmin && <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full"><Crown className="h-3 w-3" />Admin</span>}
                                            {user.isBanned && <span className="px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">Banned</span>}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        <p className="text-xs text-muted-foreground">{user.provider} · Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {user.isAdmin ? (
                                    <span className="text-xs text-muted-foreground italic self-start sm:self-auto">Protected</span>
                                ) : (
                                    <button onClick={() => banMutation.mutate({ userId: user.id, currentlyBanned: user.isBanned })} disabled={banMutation.isPending && banMutation.variables?.userId === user.id} className={`flex items-center gap-2 text-sm font-medium rounded-md px-4 py-2 transition self-start sm:self-auto ${user.isBanned ? "bg-green-600 text-white hover:bg-green-700" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"} disabled:opacity-50`}>
                                        {banMutation.isPending && banMutation.variables?.userId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : user.isBanned ? <><ShieldCheck className="h-4 w-4" />Unban</> : <><Ban className="h-4 w-4" />Ban</>}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)</p>
                            <div className="flex gap-2">
                                <button onClick={() => setPage((p) => p - 1)} disabled={pagination.page === 1} className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="h-4 w-4" /></button>
                                <button onClick={() => setPage((p) => p + 1)} disabled={pagination.page === pagination.totalPages} className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}