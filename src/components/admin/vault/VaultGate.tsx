"use client";

import { vault } from "@/lib/api";
import type { VaultStatus } from "@/lib/vault/types";
import { useQuery } from "@tanstack/react-query";
import { Lock, ShieldOff, ShieldCheck, KeyRound } from "lucide-react";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface VaultGateProps {
    children: (status: VaultStatus, refetch: () => void) => ReactNode;
}

export default function VaultGate({ children }: Readonly<VaultGateProps>) {
    const { data: status, isLoading, refetch } = useQuery<VaultStatus>({
        queryKey: ["vault-status"],
        queryFn: vault.status,
        // Re-check periodically so an expired session flips back to the lock screen.
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
    });

    if (isLoading || !status) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#26262B] border-t-transparent" />
            </div>
        );
    }

    if (!status.enabled) return <AccessDisabled />;
    if (!status.configured) return <NotConfigured />;
    if (!status.unlocked) return <VaultUnlock onUnlocked={() => refetch()} />;

    return <>{children(status, refetch)}</>;
}

function GateShell({
    icon,
    title,
    subtitle,
    children,
}: Readonly<{ icon: ReactNode; title: string; subtitle: string; children?: ReactNode }>) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-[28px] border border-[#EEEAE2] bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#26262B] text-white">
                    {icon}
                </div>
                <h3 className="text-[20px] font-semibold text-[#26262B]">{title}</h3>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[#9a978f]">{subtitle}</p>
                {children && <div className="mt-6">{children}</div>}
            </div>
        </div>
    );
}

function AccessDisabled() {
    return (
        <GateShell
            icon={<ShieldOff className="h-7 w-7" />}
            title="Access Disabled"
            subtitle="The Personal Vault module is currently disabled. Enable it from the Vault settings to start saving and accessing your private items."
        />
    );
}

function NotConfigured() {
    return (
        <GateShell
            icon={<ShieldCheck className="h-7 w-7" />}
            title="Vault Not Set Up"
            subtitle="A vault password hasn't been created yet. The administrator can set it up from the Vault settings."
        />
    );
}

function VaultUnlock({ onUnlocked }: Readonly<{ onUnlocked: () => void }>) {
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;
        setSubmitting(true);
        try {
            await vault.unlock(password);
            toast.success("Vault unlocked");
            setPassword("");
            onUnlocked();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Incorrect password");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <GateShell
            icon={<Lock className="h-7 w-7" />}
            title="Vault Locked"
            subtitle="Enter your vault password to continue. The vault locks automatically after a period of inactivity."
        >
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
                <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bdb9b0]" />
                    <input
                        type="password"
                        placeholder="Vault password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        className="h-11 w-full rounded-full border border-[#EEEAE2] bg-[#F6F4EF] pl-10 pr-4 text-[13px] text-[#26262B] outline-none transition-colors placeholder:text-[#bdb9b0] focus:border-[#26262B] focus:bg-white"
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-11 w-full items-center justify-center rounded-full bg-[#26262B] text-[13px] font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                >
                    {submitting ? "Unlocking…" : "Unlock Vault"}
                </button>
            </form>
        </GateShell>
    );
}
