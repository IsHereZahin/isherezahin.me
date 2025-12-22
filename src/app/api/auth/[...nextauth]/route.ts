import { authConfig } from "@/auth";
import { getClientIp, parseSessionInfo } from "@/lib/utils";
import NextAuth from "next-auth";
import { NextRequest } from "next/server";

async function handler(request: NextRequest) {
    const userAgent = request.headers.get("user-agent");
    const ipAddress = getClientIp(request);
    const sessionInfo = parseSessionInfo(userAgent, ipAddress);

    // Create NextAuth instance with session info in the config
    const { handlers } = NextAuth({
        ...authConfig,
        callbacks: {
            ...authConfig.callbacks,
            async jwt(params) {
                // Inject session info into the params for initial sign-in
                const extendedParams = {
                    ...params,
                    sessionInfo,
                };

                // Call the original jwt callback with session info
                if (authConfig.callbacks?.jwt) {
                    return authConfig.callbacks.jwt(
                        extendedParams as Parameters<typeof authConfig.callbacks.jwt>[0]
                    );
                }
                return params.token;
            },
        },
    });

    // Determine which handler to use based on method
    if (request.method === "GET") {
        return handlers.GET(request);
    }
    return handlers.POST(request);
}

export { handler as GET, handler as POST };

