"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Loader2, KeyRound, ScrollText, AlertTriangle, ExternalLink,
    Lock, Unlock, LockKeyhole as VaultIcon, Shield, ChevronRight, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultSettings, VaultStatus, VaultAccessLog } from "@/lib/vault/types";
import { Input, ShadcnButton as Button, ConfirmDialog } from "@/components/ui";
import { glassCard } from "./glass";
import { VAULT_SESSION_TIMEOUT_MINUTES, VAULT_MAX_FILE_SIZE_MB } from "@/lib/vault/config";

type Section = "security" | "activity";

function Toggle({ isOn, onClick, isLoading }: Readonly<{ isOn: boolean; onClick: () => void; isLoading?: boolean }>) {
    return (
        <button type="button" onClick={onClick} disabled={isLoading} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-white mx-auto" /> : <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${isOn ? "translate-x-6" : "translate-x-1"}`} />}
        </button>
    );
}

export default function VaultSettingsPanel() {
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery<VaultSettings>({
        queryKey: ["vault-settings"],
        queryFn: vault.settings.get,
    });
    const { data: status } = useQuery<VaultStatus>({
        queryKey: ["vault-status"],
        queryFn: vault.status,
    });

    const [section, setSection] = useState<Section>("security");
    const [savingField, setSavingField] = useState<string | null>(null);

    // Password forms
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [showReset, setShowReset] = useState(false);
    const [setupPassword, setSetupPassword] = useState("");
    const [setupConfirm, setSetupConfirm] = useState("");

    const update = async (field: string, payload: Parameters<typeof vault.settings.update>[0]) => {
        setSavingField(field);
        try {
            await vault.settings.update(payload);
            toast.success("Settings updated");
            queryClient.invalidateQueries({ queryKey: ["vault-settings"] });
            queryClient.invalidateQueries({ queryKey: ["vault-status"] });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update");
        } finally {
            setSavingField(null);
        }
    };

    const setupPasswordHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (setupPassword.length < 8) return toast.error("Password must be at least 8 characters");
        if (setupPassword !== setupConfirm) return toast.error("Passwords do not match");
        setSavingField("setup");
        try {
            await vault.setup(setupPassword);
            toast.success("Vault password created");
            setSetupPassword("");
            setSetupConfirm("");
            queryClient.invalidateQueries({ queryKey: ["vault-settings"] });
            queryClient.invalidateQueries({ queryKey: ["vault-status"] });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to set up vault");
        } finally {
            setSavingField(null);
        }
    };

    const changePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) return toast.error("New password must be at least 8 characters");
        setSavingField("password");
        try {
            await vault.settings.changePassword(oldPassword, newPassword);
            toast.success("Password changed");
            setOldPassword("");
            setNewPassword("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to change password");
        } finally {
            setSavingField(null);
        }
    };

    const doReset = async () => {
        if (resetPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            throw new Error("invalid");
        }
        await vault.settings.reset(resetPassword);
        toast.success("Password reset. Encrypted items were purged.");
        setResetPassword("");
        queryClient.invalidateQueries({ queryKey: ["vault-status"] });
        queryClient.invalidateQueries({ queryKey: ["vault-credentials"] });
        queryClient.invalidateQueries({ queryKey: ["vault-notes"] });
    };

    if (isLoading || !settings) {
        return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
    }

    const NAV: { id: Section; label: string; icon: LucideIcon; hint: string }[] = [
        { id: "security", label: "Security", icon: Shield, hint: "Vault password" },
        { id: "activity", label: "Activity", icon: ScrollText, hint: "Access logs" },
    ];

    return (
        <div className="space-y-4">
            {/* ───────────── Header bar (always visible) — flat, no card */}
            <div className="pb-4 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-11 w-11 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0">
                            <VaultIcon className="h-5 w-5 icon-bw" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold leading-tight">Personal Vault</h3>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className={`h-2 w-2 rounded-full ${settings.enabled ? "bg-green-500" : "bg-gray-400"}`} />
                                    {settings.enabled ? "Enabled" : "Disabled"}
                                </span>
                                <span className="text-border">·</span>
                                <span>{settings.isConfigured ? "Password set" : "Not set up"}</span>
                                <span className="text-border">·</span>
                                <span className="inline-flex items-center gap-1">
                                    {status?.unlocked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                    {status?.unlocked ? "Unlocked" : "Locked"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted">
                            <span className="text-sm font-medium w-7 text-center">{settings.enabled ? "On" : "Off"}</span>
                            <Toggle isOn={settings.enabled} isLoading={savingField === "enabled"} onClick={() => update("enabled", { enabled: !settings.enabled })} />
                        </div>
                        <Link href="/vault" target="_blank" title="Open Vault" aria-label="Open Vault" className="flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-muted hover:bg-muted transition-colors">
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Static (non-configurable) limits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                    <Limit label="Auto-lock" value={`${VAULT_SESSION_TIMEOUT_MINUTES} min`} />
                    <Limit label="Max upload" value={`${VAULT_MAX_FILE_SIZE_MB} MB`} />
                    <Limit label="File types" value="All allowed" />
                </div>
            </div>

            {/* ───────────── Two-pane: section nav + detail */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left section nav */}
                <nav className={`${glassCard} p-2 md:w-60 shrink-0 h-fit space-y-1`}>
                    {NAV.map((item) => {
                        const Icon = item.icon;
                        const active = section === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setSection(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${active ? "bg-muted" : "hover:bg-muted/60"}`}
                            >
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-background border border-border">
                                    <Icon className="h-4 w-4 icon-bw" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-sm leading-tight ${active ? "font-semibold" : "font-medium text-muted-foreground"}`}>{item.label}</p>
                                    <p className="text-[11px] text-muted-foreground/80 truncate">{item.hint}</p>
                                </div>
                                <ChevronRight className={`h-4 w-4 shrink-0 transition-opacity ${active ? "opacity-60" : "opacity-0"}`} />
                            </button>
                        );
                    })}
                </nav>

                {/* Detail pane */}
                <div className="flex-1 min-w-0">
                    {section === "security" && (
                        <div className="space-y-4">
                            {!settings.isConfigured ? (
                                <SecurityCard icon={KeyRound} title="Set vault password" desc="Used to unlock and encrypt your vault. If reset later, encrypted items are permanently lost.">
                                    <form onSubmit={setupPasswordHandler} className="space-y-2.5 max-w-md">
                                        <Input type="password" placeholder="Vault password (min 8)" value={setupPassword} onChange={(e) => setSetupPassword(e.target.value)} className="h-9" />
                                        <Input type="password" placeholder="Confirm password" value={setupConfirm} onChange={(e) => setSetupConfirm(e.target.value)} className="h-9" />
                                        <Button type="submit" size="sm" disabled={savingField === "setup"}>{savingField === "setup" ? "Creating..." : "Create Vault Password"}</Button>
                                    </form>
                                </SecurityCard>
                            ) : (
                                <>
                                    <SecurityCard icon={KeyRound} title="Change password" desc="Your data stays readable; only the key wrapper is updated.">
                                        <form onSubmit={changePassword} className="space-y-2.5 max-w-md">
                                            <Input type="password" placeholder="Current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="h-9" />
                                            <Input type="password" placeholder="New password (min 8)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-9" />
                                            <Button type="submit" size="sm" disabled={savingField === "password"}>{savingField === "password" ? "Changing..." : "Change Password"}</Button>
                                        </form>
                                    </SecurityCard>

                                    <SecurityCard icon={AlertTriangle} title="Reset password" desc="For a forgotten password. Permanently deletes all encrypted items (credentials and encrypted notes); links, plain notes, and files are kept." danger>
                                        <div className="flex items-center gap-2 max-w-md">
                                            <Input type="password" placeholder="New password (min 8)" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className="h-9" />
                                            <Button variant="destructive" size="sm" onClick={() => setShowReset(true)} disabled={resetPassword.length < 8}>Reset</Button>
                                        </div>
                                    </SecurityCard>
                                </>
                            )}
                        </div>
                    )}

                    {section === "activity" && (
                        <div className={`${glassCard} overflow-hidden`}>
                            <AccessLogs />
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={showReset}
                onOpenChange={setShowReset}
                title="Reset Vault Password?"
                description="This permanently deletes ALL encrypted items (credentials and encrypted notes). This cannot be undone. Continue?"
                confirmText="Reset & Purge"
                variant="danger"
                onConfirm={doReset}
            />
        </div>
    );
}

/* ---------------------------------------------------------------- pieces */

function Limit({ label, value }: Readonly<{ label: string; value: string }>) {
    return (
        <div className="rounded-xl bg-muted border border-border px-3 py-2">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold mt-0.5">{value}</p>
        </div>
    );
}

function SecurityCard({ icon: Icon, title, desc, children, danger }: Readonly<{ icon: LucideIcon; title: string; desc: string; children: React.ReactNode; danger?: boolean }>) {
    return (
        <div className={`rounded-2xl border ${danger ? "border-destructive/40" : "border-border"} bg-card p-5`}>
            <div className="flex items-start gap-3 mb-4">
                <div className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${danger ? "bg-destructive/10 border-destructive/20" : "bg-muted border-border"}`}>
                    <Icon className={`h-4 w-4 ${danger ? "text-destructive" : "icon-bw"}`} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
            </div>
            <div className="pl-12">{children}</div>
        </div>
    );
}

/* ---------------------------------------------------------------- access logs */

const ACTION_COLORS: Record<string, string> = {
    unlock_success: "bg-green-500",
    password_change: "bg-green-500",
    unlock_failed: "bg-red-500",
    password_reset: "bg-amber-500",
};

function AccessLogs() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery<{ logs: VaultAccessLog[]; totalPages: number; total: number }>({
        queryKey: ["vault-logs", page],
        queryFn: () => vault.logs(page, 15),
    });

    let body: React.ReactNode;
    if (isLoading) {
        body = <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
    } else if (!data?.logs.length) {
        body = <p className="text-xs text-muted-foreground py-10 text-center">No activity logged yet.</p>;
    } else {
        body = (
            <>
                <div>
                    {data.logs.map((log) => (
                        <div key={log._id} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border last:border-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${ACTION_COLORS[log.action] || "bg-muted-foreground/40"}`} />
                                <span className="text-xs font-medium capitalize">{log.action.replace(/_/g, " ")}</span>
                                {log.detail && <span className="text-xs text-muted-foreground truncate">· {log.detail}</span>}
                            </div>
                            <div className="text-[11px] text-muted-foreground shrink-0">
                                {log.deviceType} · {new Date(log.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
                {data.totalPages > 1 && (
                    <div className="flex items-center justify-between gap-3 p-3 text-xs">
                        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
                        <span className="text-muted-foreground">Page {page} of {data.totalPages}</span>
                        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}>Next</Button>
                    </div>
                )}
            </>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-border">
                <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0"><ScrollText className="h-4 w-4 icon-bw" /></div>
                <div>
                    <p className="text-sm font-medium">Access logs</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Unlock attempts, uploads, downloads, and setting changes.</p>
                </div>
            </div>
            {body}
        </div>
    );
}
