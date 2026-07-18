"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface MainShellProps {
    extras: ReactNode;
    header: ReactNode;
    top: ReactNode;
    bottom: ReactNode;
    footer: ReactNode;
    children: ReactNode;
}

/**
 * Renders the public site chrome (header, footer, decorative blobs) around the
 * page, EXCEPT on the admin dashboard, which takes over the full screen with its
 * own layout. Server components are passed in as props so this client boundary
 * only decides visibility — it never re-renders them on the server.
 */
export default function MainShell({
    extras,
    header,
    top,
    bottom,
    footer,
    children,
}: Readonly<MainShellProps>) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/admin") ?? false;

    if (isDashboard) {
        return <>{children}</>;
    }

    return (
        <div className="relative flex min-h-screen flex-col selection:bg-primary/20 selection:text-primary">
            {extras}
            {header}
            {top}
            <main className="relative z-10 flex-1">{children}</main>
            {bottom}
            {footer}
        </div>
    );
}
