"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, Monitor, Smartphone } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Session {
    id: string;
    deviceType: string;
    createdAt: string;
    lastActiveAt: string;
    isCurrent: boolean;
}

export default function ProfileSessions() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [revokingId, setRevokingId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user]);

    const fetchSessions = async () => {
        try {
            const response = await fetch("/api/sessions");
            const data = await response.json();

            if (data.logout) {
                signOut({ callbackUrl: "/" });
                return;
            }

            if (response.ok) {
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error("Error fetching sessions:", error);
            toast.error("Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    const revokeSession = async (sessionId: string) => {
        setRevokingId(sessionId);
        try {
            const response = await fetch(`/api/sessions/${sessionId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSessions((prev) => prev.filter((s) => s.id !== sessionId));
                toast.success("Session revoked successfully");
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to revoke session");
            }
        } catch (error) {
            console.error("Error revoking session:", error);
            toast.error("Failed to revoke session");
        } finally {
            setRevokingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (!user) return null;

    if (loading) {
        return (
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </section>
        );
    }

    return (
        <section className="border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold mb-4">
                Active Sessions ({sessions.length})
            </h3>
            {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No active sessions found.
                </p>
            ) : (
                sessions.map((session) => {
                    const isMobile =
                        session.deviceType === "Mobile" ||
                        session.deviceType === "Android" ||
                        session.deviceType === "iOS";
                    const DeviceIcon = isMobile ? Smartphone : Monitor;

                    return (
                        <div
                            key={session.id}
                            className={`border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 transition-colors ${session.isCurrent
                                ? "border-primary bg-primary/5"
                                : "border-border"
                                }`}
                        >
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 bg-muted rounded-lg">
                                    <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">
                                            {session.deviceType}
                                        </p>
                                        {session.isCurrent && (
                                            <span className="px-2 py-0.5 text-xs bg-foreground text-background rounded-full font-medium">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(session.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => revokeSession(session.id)}
                                disabled={
                                    session.isCurrent || revokingId === session.id
                                }
                                className={`text-sm font-medium rounded-md px-4 py-2 transition self-start sm:self-auto ${session.isCurrent
                                    ? "border border-muted text-muted-foreground bg-transparent cursor-not-allowed"
                                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer disabled:opacity-50"
                                    }`}
                            >
                                {revokingId === session.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Revoke"
                                )}
                            </button>
                        </div>
                    );
                })
            )}
        </section>
    );
}
