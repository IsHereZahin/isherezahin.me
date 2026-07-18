"use client";

import VaultWorkspace from "@/components/admin/vault/VaultWorkspace";

// Admin portal view of the Personal Vault: the full vault workspace (dashboard,
// links, notes, files, credentials) plus the admin-only Settings tab. Vault
// contents stay gated behind the vault password; Settings needs admin login.
export default function Vault() {
    return <VaultWorkspace admin />;
}
