"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, PageTitle, Section } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { BarChart3, ChevronDown, Layout, LogOut, Mail, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface NavChild {
    id: string;
    label: string;
    href: string;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    children?: NavChild[];
}

const adminNavItems: NavItem[] = [
    { id: "users", label: "Manage Users", icon: Users, href: "/admin/users" },
    {
        id: "pages", label: "Pages", icon: Layout, href: "/admin/pages", children: [
            { id: "home", label: "Home Page", href: "/admin/pages/home" },
            { id: "about", label: "About Page", href: "/admin/pages/about" },
            { id: "legal", label: "Legal Pages", href: "/admin/pages/legal" },
        ]
    },
    { id: "subscribers", label: "Subscribers", icon: Mail, href: "/admin/subscribers" },
    { id: "statistics", label: "Statistics", icon: BarChart3, href: "/admin/statistics" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
];

function NavItemWithChildren({ item, pathname, isParentActive }: { item: NavItem; pathname: string; isParentActive: boolean }) {
    const [isOpen, setIsOpen] = useState(isParentActive);
    const Icon = item.icon;

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-medium transition-colors ${isParentActive ? "bg-muted" : "text-foreground hover:bg-muted"}`}
            >
                <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && item.children && (
                <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
                    {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                            <Link
                                key={child.id}
                                href={child.href}
                                prefetch={true}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isChildActive
                                    ? "bg-foreground text-secondary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {child.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, logout, isAdmin, status } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const currentSection = pathname.split("/").pop() || "users";

    useEffect(() => {
        if (status === "authenticated" && !isAdmin) {
            router.push("/");
        }
    }, [status, isAdmin, router]);

    if (status === "loading" || !user || !isAdmin) {
        return null;
    }

    return (
        <Section id="admin">
            <PageTitle title="Admin Panel" subtitle="Manage your application" />

            <MotionWrapper delay={0.2} className="flex flex-col md:flex-row gap-6 mt-6">
                <div className="w-full md:w-65 space-y-1 bg-card border border-border rounded-xl p-4 h-fit">
                    <div className="flex items-center gap-3 pb-4 mb-2 border-b border-border md:hidden">
                        <BlurImage
                            src={user.image || "/default-avatar.png"}
                            alt={user.name || "Admin"}
                            width={40}
                            height={40}
                            className="rounded-full border border-primary"
                        />
                        <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground">Administrator</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;
                            const hasChildren = item.children && item.children.length > 0;
                            const isParentActive = !!(hasChildren && pathname.startsWith(item.href));
                            const isActive = pathname === item.href || currentSection === item.id;

                            if (hasChildren) {
                                return (
                                    <NavItemWithChildren
                                        key={item.id}
                                        item={item}
                                        pathname={pathname}
                                        isParentActive={isParentActive}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    prefetch={true}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isActive
                                        ? "bg-foreground text-secondary"
                                        : "text-foreground hover:bg-muted"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="border-t border-border my-2" />

                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors text-foreground cursor-pointer hover:bg-muted w-full"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </nav>
                </div>

                <div className="flex-1 space-y-6">{children}</div>
            </MotionWrapper>
        </Section>
    );
}
