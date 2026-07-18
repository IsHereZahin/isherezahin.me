import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { nextUrl } = request;
    
    // Check for auth session cookie
    const sessionToken = request.cookies.get("authjs.session-token")?.value 
        || request.cookies.get("__Secure-authjs.session-token")?.value;
    
    const isAuthenticated = !!sessionToken;

    // Protected routes that require a signed-in user at the edge.
    //
    // NOTE: /admin is intentionally NOT gated here. It is the entry point for the
    // Personal Vault: visitors who are not the admin (including anonymous ones)
    // must be able to reach /admin so the client layout can show them the vault
    // access screen instead of the dashboard. Access control for /admin is
    // enforced client-side (admin layout renders the vault-only shell for
    // non-admins) and server-side at the API layer (checkIsAdmin / requireVault /
    // requireVaultAdmin), so no edge redirect is needed or wanted here.
    const protectedRoutes = ["/profile"];
    const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/", nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except static files and api routes
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
    ],
};
