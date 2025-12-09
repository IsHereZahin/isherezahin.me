"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, Button, PageTitle, Section } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { LogIn, LogOut, Monitor, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
    { id: "personal", label: "Personal Information", icon: User, href: "/profile/personal" },
    { id: "sessions", label: "Sessions", icon: Monitor, href: "/profile/sessions" },
    { id: "settings", label: "Settings", icon: Settings, href: "/profile/settings" },
];

export default function ProfileLayout({ children }: { children: ReactNode }) {
    const { user, logout, login } = useAuth();
    const pathname = usePathname();

    const currentSection = pathname.split("/").pop() || "personal";

    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                <MotionWrapper delay={0.2}>
                    <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
                </MotionWrapper>
                <MotionWrapper delay={0.4}>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                        You need to log in to view your profile.
                    </p>
                </MotionWrapper>
                <MotionWrapper delay={0.6}>
                    <Button
                        text="Login to Access Profile"
                        onClick={login}
                        icon={<LogIn className="h-4 w-4" />}
                    />
                </MotionWrapper>
            </div>
        );
    }

    return (
        <Section id="profile">
            <PageTitle title="Your Profile" subtitle={`Hello, ${user.name}!`} />

            <MotionWrapper delay={0.2} className="flex flex-col md:flex-row gap-6 mt-6">
                <div className="w-full md:w-65 space-y-1 bg-card border border-border rounded-xl p-4 h-fit">
                    <div className="flex items-center gap-3 pb-4 mb-2 border-b border-border md:hidden">
                        <BlurImage
                            src={user.image || "/default-avatar.png"}
                            alt={user.name || "User Avatar"}
                            width={40}
                            height={40}
                            className="rounded-full border border-primary"
                        />
                        <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
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
