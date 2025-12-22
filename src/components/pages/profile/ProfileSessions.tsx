"use client";

import { ProfileSessionsLoading } from "@/components/ui";
import { sessions as sessionsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Monitor, Smartphone } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface Session {
    id: string;
    deviceType: string;
    ipAddress: string | null;
    createdAt: string;
    lastActiveAt: string;
    isCurrent: boolean;
}

interface SessionsResponse {
    sessions: Session[];
    logout?: boolean;
}

export default function ProfileSessions() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery<SessionsResponse>({
        queryKey: ["sessions"],
        queryFn: () => sessionsApi.getAll(),
        enabled: !!user,
    });

    const revokeMutation = useMutation({
        mutationFn: (sessionId: string) => sessionsApi.revoke(sessionId),
        onSuccess: (_, sessionId) => {
            queryClient.setQueryData<SessionsResponse>(["sessions"], (old) => ({
                sessions: old?.sessions.filter((s) => s.id !== sessionId) || [],
            }));
            toast.success("Session revoked successfully");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to revoke session");
        },
    });

    if (data?.logout) {
        signOut({ callbackUrl: "/" });
        return null;
    }

    const sessionsList = data?.sessions || [];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
        });
    };

    if (!user) return null;
    if (isLoading) return <ProfileSessionsLoading />;

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Monitor className="h-5 w-5 icon-bw" />
                <h3 className="text-base font-semibold">Active Sessions ({sessionsList.length})</h3>
            </div>
            {sessionsList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active sessions found.</p>
            ) : (
                sessionsList.map((session) => {
                    const isMobile = session.deviceType === "Mobile" || session.deviceType === "Android" || session.deviceType === "iOS";
                    const DeviceIcon = isMobile ? Smartphone : Monitor;
                    const isRevoking = revokeMutation.isPending && revokeMutation.variables === session.id;

                    return (
                        <div key={session.id} className={`border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 transition-colors ${session.isCurrent ? "border-primary bg-primary/5" : "border-border"}`}>
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 bg-muted rounded-lg"><DeviceIcon className="h-5 w-5 text-muted-foreground" /></div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">{session.deviceType}</p>
                                        {session.isCurrent && <span className="px-2 py-0.5 text-xs bg-foreground text-background rounded-full font-medium">Current</span>}
                                    </div>
                                    {session.ipAddress && (
                                        <p className="text-xs text-muted-foreground">IP: {session.ipAddress}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">{formatDate(session.createdAt)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => revokeMutation.mutate(session.id)}
                                disabled={session.isCurrent || isRevoking}
                                className={`text-sm font-medium rounded-md px-4 py-2 transition self-start sm:self-auto ${session.isCurrent ? "border border-muted text-muted-foreground bg-transparent cursor-not-allowed" : "bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer disabled:opacity-50"}`}
                            >
                                {isRevoking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Revoke"}
                            </button>
                        </div>
                    );
                })
            )}
        </section>
    );
}