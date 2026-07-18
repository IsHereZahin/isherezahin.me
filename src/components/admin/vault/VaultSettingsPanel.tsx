"use client";

import { ConfirmDialog, Input } from "@/components/ui";
import { vault } from "@/lib/api";
import { VAULT_MAX_FILE_SIZE_MB, VAULT_SESSION_TIMEOUT_MINUTES } from "@/lib/vault/config";
import type { VaultAccessLog, VaultSettings, VaultStatus } from "@/lib/vault/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertTriangle, KeyRound, Loader2, Lock, type LucideIcon,
    ScrollText, Shield, Trash2, Unlock, LockKeyhole as VaultIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Section = "security" | "activity";

function Toggle({ isOn, onClick, isLoading }: Readonly<{ isOn: boolean; onClick: () => void; isLoading?: boolean }>) {
    return (
        <button type="button" onClick={onClick} disabled={isLoading} aria-pressed={isOn} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}>
            {isLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin text-white" /> : <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${isOn ? "translate-x-6" : "translate-x-1"}`} />}
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
        return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#9a978f]" /></div>;
    }

    const NAV: { id: Section; label: string; icon: LucideIcon }[] = [
        { id: "security", label: "Security", icon: Shield },
        { id: "activity", label: "Activity", icon: ScrollText },
    ];

    return (
        <div className="space-y-5">
            {/* Header card */}
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#26262B]">
                            <VaultIcon className="h-5 w-5 text-[#F4C63D]" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-[18px] font-bold leading-tight text-[#26262B]">Personal Vault</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[#9a978f]">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className={`h-2 w-2 rounded-full ${settings.enabled ? "bg-green-500" : "bg-gray-400"}`} />
                                    {settings.enabled ? "Enabled" : "Disabled"}
                                </span>
                                <span className="text-[#d9d4ca]">·</span>
                                <span>{settings.isConfigured ? "Password set" : "Not set up"}</span>
                                <span className="text-[#d9d4ca]">·</span>
                                <span className="inline-flex items-center gap-1">
                                    {status?.unlocked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                    {status?.unlocked ? "Unlocked" : "Locked"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#EEEAE2] bg-white px-3">
                        <span className="w-6 text-center text-[13px] font-medium text-[#26262B]">{settings.enabled ? "On" : "Off"}</span>
                        <Toggle isOn={settings.enabled} isLoading={savingField === "enabled"} onClick={() => update("enabled", { enabled: !settings.enabled })} />
                    </div>
                </div>

                {/* Static (non-configurable) limits */}
                <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-[#f1ede5] pt-5 sm:grid-cols-3">
                    <Limit label="Auto-lock" value={`${VAULT_SESSION_TIMEOUT_MINUTES} min`} />
                    <Limit label="Max upload" value={`${VAULT_MAX_FILE_SIZE_MB} MB`} />
                    <Limit label="File types" value="All allowed" />
                </div>
            </section>

            {/* Tabs */}
            <div className="inline-flex rounded-full border border-[#EEEAE2] bg-white p-1">
                {NAV.map((item) => {
                    const Icon = item.icon;
                    const active = section === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setSection(item.id)}
                            className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors ${active ? "bg-[#26262B] text-white" : "text-[#57544e] hover:text-[#26262B]"}`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {section === "security" && (
                <div className="space-y-4">
                    {!settings.isConfigured ? (
                        <SecurityCard icon={KeyRound} title="Set vault password" desc="Used to unlock and encrypt your vault. If reset later, encrypted items are permanently lost.">
                            <form onSubmit={setupPasswordHandler} className="max-w-md space-y-2.5">
                                <Input type="password" placeholder="Vault password (min 8)" value={setupPassword} onChange={(e) => setSetupPassword(e.target.value)} className="h-10 rounded-xl" />
                                <Input type="password" placeholder="Confirm password" value={setupConfirm} onChange={(e) => setSetupConfirm(e.target.value)} className="h-10 rounded-xl" />
                                <PrimaryButton type="submit" disabled={savingField === "setup"}>{savingField === "setup" ? "Creating..." : "Create Vault Password"}</PrimaryButton>
                            </form>
                        </SecurityCard>
                    ) : (
                        <>
                            <SecurityCard icon={KeyRound} title="Change password" desc="Your data stays readable; only the key wrapper is updated.">
                                <form onSubmit={changePassword} className="max-w-md space-y-2.5">
                                    <Input type="password" placeholder="Current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="h-10 rounded-xl" />
                                    <Input type="password" placeholder="New password (min 8)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-10 rounded-xl" />
                                    <PrimaryButton type="submit" disabled={savingField === "password"}>{savingField === "password" ? "Changing..." : "Change Password"}</PrimaryButton>
                                </form>
                            </SecurityCard>

                            <SecurityCard icon={AlertTriangle} title="Reset password" desc="For a forgotten password. Permanently deletes all encrypted items (credentials and encrypted notes); links, plain notes, and files are kept." danger>
                                <div className="flex max-w-md items-center gap-2">
                                    <Input type="password" placeholder="New password (min 8)" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className="h-10 rounded-xl" />
                                    <button type="button" onClick={() => setShowReset(true)} disabled={resetPassword.length < 8} className="inline-flex h-10 shrink-0 items-center rounded-full bg-[#EE5D4A] px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">Reset</button>
                                </div>
                            </SecurityCard>
                        </>
                    )}
                </div>
            )}

            {section === "activity" && (
                <div className="overflow-hidden rounded-[24px] border border-[#EEEAE2] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <AccessLogs />
                </div>
            )}

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

function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className="inline-flex h-10 items-center rounded-full bg-[#26262B] px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
            {children}
        </button>
    );
}

function Limit({ label, value }: Readonly<{ label: string; value: string }>) {
    return (
        <div className="rounded-2xl bg-[#F6F4EF] px-4 py-3">
            <p className="text-[11px] text-[#9a978f]">{label}</p>
            <p className="mt-0.5 text-[15px] font-semibold text-[#26262B]">{value}</p>
        </div>
    );
}

function SecurityCard({ icon: Icon, title, desc, children, danger }: Readonly<{ icon: LucideIcon; title: string; desc: string; children: React.ReactNode; danger?: boolean }>) {
    return (
        <div className={`rounded-[24px] border bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${danger ? "border-[#EE5D4A]/30" : "border-[#EEEAE2]"}`}>
            <div className="mb-4 flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${danger ? "bg-[#EE5D4A]/10" : "bg-[#F6F4EF]"}`}>
                    <Icon className={`h-[18px] w-[18px] ${danger ? "text-[#EE5D4A]" : "text-[#26262B]"}`} />
                </div>
                <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#26262B]">{title}</p>
                    <p className="mt-0.5 text-[12px] text-[#9a978f]">{desc}</p>
                </div>
            </div>
            <div className="sm:pl-13">{children}</div>
        </div>
    );
}

/* ---------------------------------------------------------------- access logs */

const ACTION_COLORS: Record<string, string> = {
    unlock_success: "bg-green-500",
    password_change: "bg-green-500",
    unlock_failed: "bg-red-500",
    password_reset: "bg-amber-500",
    activity_cleared: "bg-[#EE5D4A]",
};

function AccessLogs() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [confirmClear, setConfirmClear] = useState(false);
    const { data, isLoading } = useQuery<{ logs: VaultAccessLog[]; totalPages: number; total: number }>({
        queryKey: ["vault-logs", page],
        queryFn: () => vault.logs(page, 15),
    });

    const clearAll = async () => {
        try {
            const { removed } = await vault.clearLogs();
            toast.success(`Activity history cleared (${removed} ${removed === 1 ? "record" : "records"} removed)`);
            setPage(1);
            await queryClient.invalidateQueries({ queryKey: ["vault-logs"] });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to clear activity");
            throw error; // keep the confirmation dialog open on failure
        }
    };

    let body: React.ReactNode;
    if (isLoading) {
        body = <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-[#9a978f]" /></div>;
    } else if (!data?.logs.length) {
        body = <p className="py-12 text-center text-[13px] text-[#9a978f]">No activity logged yet.</p>;
    } else {
        body = (
            <>
                <div>
                    {data.logs.map((log) => (
                        <div key={log._id} className="flex items-center justify-between gap-3 border-b border-[#f1ede5] px-5 py-3.5 last:border-0">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${ACTION_COLORS[log.action] || "bg-[#c4c0b7]"}`} />
                                <span className="text-[13px] font-medium capitalize text-[#26262B]">{log.action.replace(/_/g, " ")}</span>
                                {log.detail && <span className="truncate text-[12px] text-[#9a978f]">· {log.detail}</span>}
                            </div>
                            <div className="shrink-0 text-[11px] text-[#9a978f]">
                                {log.deviceType} · {new Date(log.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
                {data.totalPages > 1 && (
                    <div className="flex items-center justify-between gap-3 border-t border-[#f1ede5] p-4 text-[13px]">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-full border border-[#EEEAE2] bg-white px-4 h-9 font-medium text-[#26262B] hover:bg-[#F6F4EF] disabled:opacity-50">Previous</button>
                        <span className="text-[#9a978f]">Page {page} of {data.totalPages}</span>
                        <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages} className="rounded-full border border-[#EEEAE2] bg-white px-4 h-9 font-medium text-[#26262B] hover:bg-[#F6F4EF] disabled:opacity-50">Next</button>
                    </div>
                )}
            </>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-3 border-b border-[#f1ede5] p-5">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F6F4EF]"><ScrollText className="h-[18px] w-[18px] text-[#26262B]" /></div>
                    <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-[#26262B]">Access logs</p>
                        <p className="mt-0.5 text-[12px] text-[#9a978f]">Unlock attempts, uploads, downloads, and setting changes.</p>
                    </div>
                </div>
                {!!data?.total && (
                    <button
                        type="button"
                        onClick={() => setConfirmClear(true)}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#EE5D4A]/30 bg-white px-3.5 text-[12px] font-medium text-[#EE5D4A] transition-colors hover:bg-[#EE5D4A]/10"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Delete All Activity</span>
                        <span className="sm:hidden">Clear</span>
                    </button>
                )}
            </div>
            {body}

            <ConfirmDialog
                open={confirmClear}
                onOpenChange={setConfirmClear}
                title="Delete all activity?"
                description="This permanently removes every activity log. A single new entry will be recorded noting how many were deleted, so the audit trail is preserved. This action cannot be undone."
                confirmText="Delete All"
                variant="danger"
                onConfirm={clearAll}
            />
        </div>
    );
}
