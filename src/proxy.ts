import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { nextUrl } = request;
    
    // Check for auth session cookie
    const sessionToken = request.cookies.get("authjs.session-token")?.value 
        || request.cookies.get("__Secure-authjs.session-token")?.value;
    
    const isAuthenticated = !!sessionToken;

    // Protected routes that require authentication
    const protectedRoutes = ["/profile", "/admin"];
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
