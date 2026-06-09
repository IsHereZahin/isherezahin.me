"use client";

import { useQuery } from "@tanstack/react-query";
import { Link2, FileText, FileIcon, KeyRound, Loader2, Star, Clock } from "lucide-react";
import { vault } from "@/lib/api";
import type { VaultLink, VaultNote, VaultFile, VaultCredential, VaultSection } from "@/lib/vault/types";
import { glassCard, glassItem } from "./glass";

interface DashboardData {
    links: VaultLink[];
    notes: VaultNote[];
    files: VaultFile[];
    credentials: VaultCredential[];
}

interface RecentItem {
    id: string;
    title: string;
    kind: string;
    createdAt: string;
    favorite: boolean;
}

export default function VaultDashboard({ onNavigate }: Readonly<{ onNavigate: (section: VaultSection) => void }>) {
    const { data, isLoading } = useQuery<DashboardData>({
        queryKey: ["vault-dashboard"],
        queryFn: async () => {
            const [links, notes, files, credentials] = await Promise.all([
                vault.links.getAll(),
                vault.notes.getAll(),
                vault.files.getAll(),
                vault.credentials.getAll(),
            ]);
            return { links, notes, files, credentials };
        },
    });

    if (isLoading || !data) {
        return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
    }

    const cards: { label: string; count: number; icon: typeof Link2; section: VaultSection }[] = [
        { label: "Links", count: data.links.length, icon: Link2, section: "links" },
        { label: "Notes", count: data.notes.length, icon: FileText, section: "notes" },
        { label: "Files", count: data.files.length, icon: FileIcon, section: "files" },
        { label: "Credentials", count: data.credentials.length, icon: KeyRound, section: "credentials" },
    ];

    const allRecent: RecentItem[] = [
        ...data.links.map((l) => ({ id: l._id, title: l.title, kind: "Link", createdAt: l.createdAt, favorite: l.isFavorite })),
        ...data.notes.map((n) => ({ id: n._id, title: n.title, kind: "Note", createdAt: n.createdAt, favorite: n.isFavorite })),
        ...data.files.map((f) => ({ id: f._id, title: f.name, kind: "File", createdAt: f.createdAt, favorite: f.isFavorite })),
        ...data.credentials.map((c) => ({ id: c._id, title: c.title, kind: "Credential", createdAt: c.createdAt, favorite: c.isFavorite })),
    ];

    const recent = [...allRecent].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
    const favorites = allRecent.filter((i) => i.favorite).slice(0, 6);

    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <button key={card.label} onClick={() => onNavigate(card.section)} className={`${glassItem} p-4 text-left`}>
                            <div className="flex items-center justify-between">
                                <div className="p-2 rounded-lg bg-muted border border-border"><Icon className="h-5 w-5 icon-bw" /></div>
                                <span className="text-2xl font-bold">{card.count}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{card.label}</p>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent */}
                <div className={`${glassCard} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold">Recent Items</h4>
                    </div>
                    {recent.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">Nothing yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {recent.map((item) => (
                                <div key={`${item.kind}-${item.id}`} className="flex items-center justify-between text-sm">
                                    <span className="truncate">{item.title}</span>
                                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{item.kind}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Favorites */}
                <div className={`${glassCard} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <h4 className="text-sm font-semibold">Favorites</h4>
                    </div>
                    {favorites.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">No favorites yet. Star items to pin them here.</p>
                    ) : (
                        <div className="space-y-2">
                            {favorites.map((item) => (
                                <div key={`fav-${item.kind}-${item.id}`} className="flex items-center justify-between text-sm">
                                    <span className="truncate">{item.title}</span>
                                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{item.kind}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
