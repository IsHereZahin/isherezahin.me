// src/lib/vault/tags.ts
// Keeps the VaultTag table in sync with tags used on items (for autocomplete).

import { VaultTagModel } from "@/database/models/vault-tag-model";

export function normalizeTags(input: unknown): string[] {
    if (!Array.isArray(input)) return [];
    const seen = new Set<string>();
    for (const t of input) {
        if (typeof t !== "string") continue;
        const tag = t.trim().toLowerCase();
        if (tag) seen.add(tag);
    }
    return [...seen];
}

export async function syncVaultTags(tags: string[]): Promise<void> {
    if (!tags.length) return;
    await Promise.all(
        tags.map((name) =>
            VaultTagModel.updateOne(
                { name },
                { $setOnInsert: { name } },
                { upsert: true }
            )
        )
    );
}
