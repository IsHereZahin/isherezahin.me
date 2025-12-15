"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <section className="border border-border rounded-xl p-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                    <Shield className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">
                    Welcome to Admin Panel
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Hello {user?.name?.split(" ")[0] || "Admin"}! You have administrative access to manage users and monitor application activity.
                </p>
                <div className="pt-4">
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Manage Users
                    </Link>
                </div>
            </div>
        </section>
    );
}
