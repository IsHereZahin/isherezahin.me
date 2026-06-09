"use client";

import VaultSettingsPanel from "@/components/admin/vault/VaultSettingsPanel";

// Admin portal view: the Personal Vault settings ONLY (enable/disable, password
// setup/change/reset, upload limits, access logs). The vault contents live at /vault
// and are reached with just the vault password, no admin login required there.
export default function Vault() {
    return <VaultSettingsPanel />;
}
