"use client";

import { ArrowLeft, LockKeyhole } from "lucide-react";
import VaultWorkspace from "./VaultWorkspace";

/**
 * The vault-only experience shown to visitors who are NOT authenticated as the
 * admin. It replaces the entire admin dashboard: there is no admin sidebar or
 * admin navigation — only the Personal Vault, gated by the vault password. Once
 * unlocked, the visitor can browse the vault contents but never the Settings.
 */
export default function PublicVaultShell() {
    return (
        <div className="flex h-full w-full flex-col">
            <header className="flex shrink-0 items-center justify-between gap-3 px-4 pt-5 md:px-8 md:pt-7">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--s-invert)] text-white">
                        <LockKeyhole className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold leading-tight text-[var(--s-text)]">Personal Vault</p>
                        <p className="truncate text-[12px] text-[var(--s-muted)]">Private &amp; encrypted</p>
                    </div>
                </div>
                <a
                    href="/"
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-[var(--s-border)] bg-[var(--s-card)] px-4 text-[13px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to site</span>
                </a>
            </header>

            <div className="pretty-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 md:px-8">
                <VaultWorkspace />
            </div>
        </div>
    );
}
