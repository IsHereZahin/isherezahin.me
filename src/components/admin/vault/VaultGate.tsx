"use client";

import { vault } from "@/lib/api";
import type { VaultStatus } from "@/lib/vault/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock, ShieldOff, ShieldCheck, KeyRound } from "lucide-react";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { ShadcnButton as Button, Input } from "@/components/ui";

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
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!status.enabled) return <AccessDisabled />;
    if (!status.configured) return <NotConfigured />;
    if (!status.unlocked) return <VaultUnlock onUnlocked={() => refetch()} />;

    return <>{children(status, refetch)}</>;
}

function GateShell({ icon, title, subtitle, children }: Readonly<{ icon: ReactNode; title: string; subtitle: string; children?: ReactNode }>) {
    return (
        <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
            <div className="p-5 rounded-2xl bg-muted border border-border mb-6">{icon}</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-md leading-relaxed mb-6">{subtitle}</p>
            {children}
        </div>
    );
}

function AccessDisabled() {
    return (
        <GateShell
            icon={<ShieldOff className="w-10 h-10 text-foreground" />}
            title="Access Disabled"
            subtitle="The Personal Vault module is currently disabled. Enable it from Settings to start saving and accessing your private items."
        />
    );
}

function NotConfigured() {
    return (
        <GateShell
            icon={<ShieldCheck className="w-10 h-10 text-foreground" />}
            title="Vault Not Set Up"
            subtitle="A vault password hasn't been created yet. The administrator can set it up from the admin portal (Settings → Personal Vault)."
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
            icon={<Lock className="w-10 h-10 text-foreground" />}
            title="Vault Locked"
            subtitle="Enter your vault password to continue. The vault locks automatically after a period of inactivity."
        >
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="password"
                        placeholder="Vault password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9"
                        autoFocus
                    />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Unlocking..." : "Unlock Vault"}
                </Button>
            </form>
        </GateShell>
    );
}

