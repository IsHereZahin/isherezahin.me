"use client";

import { SendMessageModal } from "@/components/chat";
import { BlurImage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { adminUsers, ApiError } from "@/lib/api";
import {
    FirebasePresence,
    subscribeToPresence,
} from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, ChevronLeft, ChevronRight, Crown, Loader2, MessageCircle, Search, ShieldCheck, Users as UsersIcon } from "lucide-react";
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

// Hook to subscribe to a user's presence
function useUserPresence(userId: string) {
    const [presence, setPresence] = useState<FirebasePresence | null>(null);

    useEffect(() => {
        if (!userId) return;
        const unsubscribe = subscribeToPresence(userId, setPresence);
        return () => unsubscribe();
    }, [userId]);

    return presence;
}

// Component for individual user's online status
function UserPresenceIndicator({ userId }: { userId: string }) {
    const presence = useUserPresence(userId);
    const isOnline = presence?.isOnline ?? false;
    const lastSeen = typeof presence?.lastSeen === "number" ? presence.lastSeen : null;

    const formatLastSeen = (timestamp: number | null) => {
        if (!timestamp) return "Never";
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <span className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${isOnline ? "bg-green-500" : "bg-[#c4c0b7]"}`} />
            <span className={isOnline ? "text-green-600 dark:text-green-400" : "text-[#9a978f]"}>
                {isOnline ? "Online" : formatLastSeen(lastSeen)}
            </span>
        </span>
    );
}

function StatTile({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl bg-[#F6F4EF] px-4 py-3">
            <p className="text-[20px] font-bold leading-none text-[#26262B]">{value}</p>
            <p className="mt-1.5 text-[11px] text-[#9a978f]">{label}</p>
        </div>
    );
}

export default function Users() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "banned">("all");
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

    const adminCount = users.filter((u: User) => u.isAdmin).length;
    const bannedCount = users.filter((u: User) => u.isBanned).length;
    const activeCount = users.length - bannedCount;

    return (
        <div className="space-y-5">
            {/* Summary tiles (computed from the loaded page of users) */}
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <StatTile label="On this page" value={users.length} />
                    <StatTile label="Active" value={activeCount} />
                    <StatTile label="Admins" value={adminCount} />
                    <StatTile label="Banned" value={bannedCount} />
                </div>
            </section>

            {/* Search, filter, list & pagination */}
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a978f]" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or username..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="h-10 w-full rounded-full border border-[#EEEAE2] bg-white pl-10 pr-4 text-[13px] text-[#26262B] placeholder:text-[#9a978f] focus:outline-none focus:ring-2 focus:ring-[#26262B]/20"
                        />
                    </div>
                    <Select value={filter} onValueChange={(v) => { setFilter(v as "all" | "active" | "banned"); setPage(1); }}>
                        <SelectTrigger className="h-10 w-full rounded-full sm:w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-[#9a978f]" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F4EF]">
                            <UsersIcon className="h-5 w-5 text-[#9a978f]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-[#26262B]">No users found</p>
                            <p className="mt-0.5 text-[12px] text-[#9a978f]">Try adjusting your search or filter.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-2 divide-y divide-[#f1ede5]">
                            {users.map((user: User) => (
                                <div key={user.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <BlurImage src={user.image || "/default-avatar.png"} alt={user.name || "User"} width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover" />
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-[14px] font-medium text-[#26262B]">{user.name || "Unknown"}</p>
                                                {user.isAdmin && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F4C63D]/15 px-2 py-0.5 text-[11px] font-medium text-[#26262B]">
                                                        <Crown className="h-3 w-3" /> Admin
                                                    </span>
                                                )}
                                                {user.isBanned && (
                                                    <span className="rounded-full bg-[#EE5D4A]/10 px-2 py-0.5 text-[11px] font-medium text-[#EE5D4A]">Banned</span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 truncate text-[12px] text-[#9a978f]">{user.email}</p>
                                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#9a978f]">
                                                <span className="rounded-full bg-[#F6F4EF] px-2 py-0.5 text-[11px] font-medium capitalize text-[#57544e]">{user.provider}</span>
                                                <span className="text-[#d9d4ca]">·</span>
                                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[#d9d4ca]">·</span>
                                                <UserPresenceIndicator userId={user.id} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                                        {!user.isAdmin && (
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEEAE2] bg-white text-[#26262B] transition hover:bg-[#F6F4EF]"
                                                title="Send message"
                                                aria-label="Send message"
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                            </button>
                                        )}
                                        {user.isAdmin ? (
                                            <span className="rounded-full bg-[#F6F4EF] px-3 py-1.5 text-[11px] font-medium text-[#9a978f]">Protected</span>
                                        ) : (
                                            <button
                                                onClick={() => banMutation.mutate({ userId: user.id, currentlyBanned: user.isBanned })}
                                                disabled={banMutation.isPending && banMutation.variables?.userId === user.id}
                                                className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${user.isBanned ? "bg-green-600 hover:bg-green-700" : "bg-[#EE5D4A] hover:bg-[#EE5D4A]/90"}`}
                                            >
                                                {banMutation.isPending && banMutation.variables?.userId === user.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : user.isBanned ? (
                                                    <><ShieldCheck className="h-4 w-4" /> Unban</>
                                                ) : (
                                                    <><Ban className="h-4 w-4" /> Ban</>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#f1ede5] pt-4">
                                <p className="text-[13px] text-[#9a978f]">Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage((p) => p - 1)} disabled={pagination.page === 1} className="rounded-xl border border-[#EEEAE2] bg-white p-2 text-[#26262B] transition hover:bg-[#F6F4EF] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
                                    <button onClick={() => setPage((p) => p + 1)} disabled={pagination.page === pagination.totalPages} className="rounded-xl border border-[#EEEAE2] bg-white p-2 text-[#26262B] transition hover:bg-[#F6F4EF] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Send Message Modal */}
            {selectedUser && (
                <SendMessageModal
                    targetUser={selectedUser}
                    open={!!selectedUser}
                    onOpenChange={(open) => !open && setSelectedUser(null)}
                />
            )}
        </div>
    );
}
