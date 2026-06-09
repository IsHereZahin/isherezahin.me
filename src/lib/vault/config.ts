// src/lib/vault/config.ts
// Static (non-configurable) vault limits. These are intentionally hardcoded
// rather than admin-editable.

// Auto-lock the unlocked session after this many minutes of inactivity.
export const VAULT_SESSION_TIMEOUT_MINUTES = 5;

// Largest allowed upload per file, in megabytes.
export const VAULT_MAX_FILE_SIZE_MB = 50;

// Allowed upload types: all types accepted (no extension restriction).
export const VAULT_ALLOW_ALL_FILE_TYPES = true;
