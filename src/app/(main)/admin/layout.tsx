"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, PageTitle, Section } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const adminNavItems = [
    { id: "users", label: "Manage Users", icon: Users, href: "/admin/users" },
];

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

    if (status === "loading") {
        return (
            <Section id="admin">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </Section>
        );
    }

    if (!user || !isAdmin) {
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

                    <nav className="space-y-2">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentSection === item.id;
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
