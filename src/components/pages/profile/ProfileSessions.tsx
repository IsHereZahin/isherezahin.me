"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Globe, Monitor } from "lucide-react";

interface Session {
    id: string;
    device: string;
    browser: string;
    location: string;
    lastActive: string;
    isCurrent?: boolean;
}

export default function ProfileSessions() {
    const { user } = useAuth();

    if (!user) return null;

    const sessions: Session[] = [
        {
            id: "1",
            device: "Windows",
            browser: "Chrome v141.0.0.0",
            location: "Chittagong, Bangladesh",
            lastActive: "Oct 29, 2025, 1:36 PM",
            isCurrent: true,
        },
        {
            id: "2",
            device: "MacBook",
            browser: "Safari v17.0",
            location: "Dhaka, Bangladesh",
            lastActive: "Oct 30, 2025, 9:12 AM",
        },
        {
            id: "3",
            device: "iPhone",
            browser: "Mobile Safari",
            location: "Sylhet, Bangladesh",
            lastActive: "Oct 30, 2025, 10:45 AM",
        },
    ];

    return (
        <section className="border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold mb-4">
                Active Sessions ({sessions.length})
            </h3>
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className={`border rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 transition-colors ${session.isCurrent ? "border-primary bg-primary/5" : "border-border"
                        }`}
                >
                    <div className="flex items-start gap-3 min-w-0">
                        <Monitor className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{session.device}</p>
                                {session.isCurrent && (
                                    <span className="px-2 py-1 text-xs bg-foreground text-secondary rounded-full font-medium">
                                        Current
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground mt-0.5 truncate">
                                <span>{session.browser}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                                <Globe className="h-3 w-3 opacity-70" />
                                <span>{session.location}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {session.lastActive}
                            </p>
                        </div>
                    </div>
                    <button
                        className={`text-xs rounded-md px-3 py-1 transition self-start sm:self-auto ${session.isCurrent
                                ? "border-gray-300 text-muted-foreground bg-transparent cursor-not-allowed"
                                : "border border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
                            }`}
                        disabled={session.isCurrent}
                    >
                        {session.isCurrent ? "Current" : "Revoke"}
                    </button>
                </div>
            ))}
        </section>
    );
}
