import AdminShell from "@/components/admin/dashboard/AdminShell";
import { checkIsAdmin } from "@/lib/auth-utils";
import { ReactNode } from "react";

/**
 * Resolves the session on the server so the dashboard can render on its first
 * paint. Previously this layout was a client component that showed a spinner —
 * and kept every admin query disabled — until `/api/auth/session` answered,
 * which put a round trip in front of *all* admin content.
 *
 * Reading the session makes these routes server-rendered rather than static
 * shells. That is the right trade for an authenticated dashboard: the render
 * costs a few milliseconds, the round trip it replaces cost ~100ms.
 */
export default async function AdminLayout({ children }: { readonly children: ReactNode }) {
    const isAdmin = await checkIsAdmin();

    return <AdminShell initialIsAdmin={isAdmin}>{children}</AdminShell>;
}
