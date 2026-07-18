"use client";

import { C } from "@/components/be-run/data";
import { useAuth } from "@/lib/hooks/useAuth";
import { useChatUnread } from "@/lib/hooks/useChat";
import {
    BarChart3,
    FileText,
    House,
    LayoutGrid,
    LockKeyhole,
    LogOut,
    Mail,
    MessageSquareText,
    Newspaper,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type IconType = React.ComponentType<{ className?: string }>;

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: IconType;
    exact?: boolean;
    match?: string;
    badge?: boolean;
}

// Two groups mirror the reference sidebar's two white "pill" clusters.
const GROUP_1: NavItem[] = [
    { id: "dashboard", label: "Dashboard", href: "/admin", icon: House, exact: true },
    { id: "users", label: "Users", href: "/admin/users", icon: Users },
    { id: "chat", label: "Live Chat", href: "/admin/chat", icon: MessageSquareText, badge: true },
    { id: "subscribers", label: "Subscribers", href: "/admin/subscribers", icon: Mail },
];
const GROUP_2: NavItem[] = [
    { id: "statistics", label: "Statistics", href: "/admin/statistics", icon: BarChart3 },
    { id: "content", label: "Content", href: "/admin/content/blogs", icon: Newspaper, match: "/admin/content" },
    { id: "pages", label: "Pages", href: "/admin/pages/home", icon: FileText, match: "/admin/pages" },
    { id: "vault", label: "Vault", href: "/admin/vault", icon: LockKeyhole },
    { id: "settings", label: "Settings", href: "/admin/settings", icon: Settings },
];

function UserAvatar({ src, name, size = 38 }: { src?: string | null; name: string; size?: number }) {
    const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    if (src) {
        // eslint-disable-next-line @next/next/no-img-element
        return (
            <img
                src={src}
                alt={name}
                className="shrink-0 rounded-full object-cover ring-2 ring-[var(--s-card)]"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F6B98A] to-[#E8735A] font-semibold text-white ring-2 ring-[var(--s-card)]"
            style={{ width: size, height: size, fontSize: size * 0.34 }}
        >
            {initials}
        </div>
    );
}

function NavButton({
    item,
    expanded,
    onNavigate,
}: {
    item: NavItem;
    expanded: boolean;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();
    const { unreadCount } = useChatUnread();
    const Icon = item.icon;
    const active = item.exact
        ? pathname === item.href
        : item.match
            ? pathname.startsWith(item.match)
            : pathname === item.href || pathname.startsWith(item.href + "/");
    const showBadge = item.badge && unreadCount > 0;

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            title={item.label}
            aria-label={item.label}
            className={[
                "relative flex h-11 items-center rounded-2xl text-[14px] font-medium transition-colors",
                expanded ? "w-full gap-3 px-3" : "w-11 justify-center",
                active
                    ? "text-[#F4C63D]"
                    : "text-[var(--s-text2)] hover:bg-[var(--s-soft)] hover:text-[var(--s-text)]",
            ].join(" ")}
            style={active ? { backgroundColor: C.dark } : undefined}
        >
            <Icon className="h-[19px] w-[19px] shrink-0" />
            {expanded && <span className={active ? "text-white" : ""}>{item.label}</span>}
            {showBadge && (
                <span
                    className={`flex items-center justify-center rounded-full bg-[#EE5D4A] text-[11px] font-semibold text-white ${expanded ? "ml-auto h-5 min-w-5 px-1.5" : "absolute -right-0.5 -top-0.5 h-4 min-w-4"}`}
                >
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </Link>
    );
}

function Pill({
    items,
    expanded,
    onNavigate,
}: {
    items: NavItem[];
    expanded: boolean;
    onNavigate?: () => void;
}) {
    return (
        <div
            className={`flex flex-col gap-2 bg-[var(--s-card)]/70 p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${expanded ? "items-stretch rounded-2xl" : "items-center rounded-full"}`}
        >
            {items.map((item) => (
                <NavButton key={item.id} item={item} expanded={expanded} onNavigate={onNavigate} />
            ))}
        </div>
    );
}

function Logo({ showText }: { showText: boolean }) {
    return (
        <div className={`mb-7 flex ${showText ? "items-center gap-2.5 px-1" : "flex-col items-center gap-1"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: C.dark }}>
                <LayoutGrid className="h-[18px] w-[18px] text-[#F4C63D]" />
            </div>
            <span className={`font-semibold text-[var(--s-text)] ${showText ? "text-[15px]" : "text-[10px] tracking-tight"}`}>
                Admin
            </span>
        </div>
    );
}

function Footer({
    expanded,
    collapseControl,
}: {
    expanded: boolean;
    collapseControl?: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const name = user?.name || "Admin";
    return (
        <div className="mt-4 flex flex-col gap-3">
            {collapseControl}
            <div className={`flex items-center ${expanded ? "gap-3 px-1" : "flex-col gap-3"}`}>
                <UserAvatar src={user?.image} name={name} />
                {expanded && (
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[var(--s-text)]">{name}</p>
                        <p className="truncate text-[11px] text-[var(--s-muted)]">Administrator</p>
                    </div>
                )}
                <button
                    onClick={logout}
                    title="Logout"
                    aria-label="Logout"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--s-muted)] transition-colors hover:bg-[#EE5D4A]/10 hover:text-[#EE5D4A]"
                >
                    <LogOut className="h-[18px] w-[18px]" />
                </button>
            </div>
        </div>
    );
}

export default function AdminSidebar({
    mobileOpen,
    onCloseMobile,
}: {
    mobileOpen: boolean;
    onCloseMobile: () => void;
}) {
    const [expanded, setExpanded] = useState(false);

    const collapseButton = (
        <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className={[
                "flex h-11 items-center rounded-2xl text-[var(--s-text2)] transition-colors hover:bg-[var(--s-soft)] hover:text-[var(--s-text)]",
                expanded ? "w-full gap-3 px-3 text-[13px] font-medium" : "w-11 justify-center self-center",
            ].join(" ")}
        >
            {expanded ? <PanelLeftClose className="h-[19px] w-[19px] shrink-0" /> : <PanelLeftOpen className="h-[19px] w-[19px] shrink-0" />}
            {expanded && <span>Collapse</span>}
        </button>
    );

    return (
        <>
            {/* Desktop icon-rail (matches the reference), expandable to labels */}
            <aside
                className={[
                    "hidden shrink-0 flex-col py-5 transition-[width] duration-300 ease-in-out md:flex",
                    expanded ? "w-[236px] items-stretch px-4" : "w-[80px] items-center px-2",
                ].join(" ")}
            >
                <Logo showText={expanded} />
                <nav className="flex flex-1 flex-col gap-4">
                    <Pill items={GROUP_1} expanded={expanded} />
                    <Pill items={GROUP_2} expanded={expanded} />
                </nav>
                <Footer expanded={expanded} collapseControl={collapseButton} />
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseMobile} />
                    <aside
                        className="animate-fade-in absolute left-0 top-0 flex h-full w-[264px] flex-col px-4 py-5 shadow-2xl"
                        style={{ backgroundColor: C.shell }}
                    >
                        <div className="mb-2 flex items-start justify-between">
                            <Logo showText />
                            <button
                                onClick={onCloseMobile}
                                aria-label="Close menu"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--s-text2)] hover:bg-[var(--s-soft)]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col gap-4">
                            <Pill items={GROUP_1} expanded onNavigate={onCloseMobile} />
                            <Pill items={GROUP_2} expanded onNavigate={onCloseMobile} />
                        </nav>
                        <Footer expanded />
                    </aside>
                </div>
            )}
        </>
    );
}
