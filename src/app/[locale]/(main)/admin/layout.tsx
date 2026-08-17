import AdminShell from "@/components/admin/dashboard/AdminShell";
import { checkIsAdmin } from "@/lib/auth-utils";
import { ReactNode } from "react";

/**
 * Resolves the session on the server so the dashboard renders on its first
 * paint, with no client round trip in front of the admin content.
 *
 * Reading the session makes these routes server-rendered rather than static
 * shells, which is the right shape for an authenticated dashboard.
 */
export default async function AdminLayout({ children }: { readonly children: ReactNode }) {
    const isAdmin = await checkIsAdmin();

    return <AdminShell initialIsAdmin={isAdmin}>{children}</AdminShell>;
}
