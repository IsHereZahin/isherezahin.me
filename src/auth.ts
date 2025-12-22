// src/auth.ts
import { SessionModel } from "@/database/models/session-model";
import { UserModel } from "@/database/models/user-model";
import dbConnect from "@/database/services/mongo";
import {
    AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET,
} from "@/lib/constants";
import type { SessionInfo } from "@/lib/utils";
import crypto from "crypto";
import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Provider profile types
interface GitHubProfile {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
    [key: string]: unknown;
}

interface GoogleProfile {
    sub: string;
    name: string;
    email: string;
    picture: string;
    [key: string]: unknown;
}

// Extended JWT params with session info
interface ExtendedJWTParams {
    sessionInfo?: SessionInfo;
}

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        sessionToken?: string;
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            avatar_url?: string | null;
            username?: string | null;
            provider?: "github" | "google";
            bio?: string | null;
        };
    }
}

export const authConfig: NextAuthConfig = {
    trustHost: true,
    providers: [
        GitHub({
            clientId: AUTH_GITHUB_ID,
            clientSecret: AUTH_GITHUB_SECRET,
            authorization: {
                params: {
                    scope: "read:user user:email public_repo write:discussion",
                },
            },
        }),
        Google({
            clientId: AUTH_GOOGLE_ID,
            clientSecret: AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!account || !profile) return true;

            try {
                await dbConnect();

                const provider = account.provider as "github" | "google";
                let providerId: string;
                let username: string | undefined;
                let providerData: Record<string, unknown>;

                if (provider === "github") {
                    const githubProfile = profile as unknown as GitHubProfile;
                    providerId = String(githubProfile.id);
                    username = githubProfile.login;
                    providerData = { ...githubProfile };
                } else {
                    const googleProfile = profile as unknown as GoogleProfile;
                    providerId = googleProfile.sub;
                    providerData = { ...googleProfile };
                }

                // Check if user exists and is banned
                const existingUser = await UserModel.findOne({ providerId, provider });
                if (existingUser?.isBanned) {
                    return "/?error=banned";
                }

                // Upsert user record
                await UserModel.findOneAndUpdate(
                    { providerId, provider },
                    {
                        providerId,
                        provider,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        username,
                        providerData,
                        updatedAt: new Date(),
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );

                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return true;
            }
        },

        async jwt(params) {
            const { token, account, profile, trigger } = params;
            const extendedParams = params as typeof params & ExtendedJWTParams;
            const sessionInfo = extendedParams.sessionInfo;

            // On initial sign in
            if (account && profile) {
                const provider = account.provider as "github" | "google";
                token.accessToken = account.access_token;
                token.provider = provider;

                if (provider === "github") {
                    const githubProfile = profile as unknown as GitHubProfile;
                    token.username = githubProfile.login;
                    token.avatar_url = githubProfile.avatar_url;
                } else {
                    const googleProfile = profile as unknown as GoogleProfile;
                    token.avatar_url = googleProfile.picture;
                }

                // Get user from database to get the MongoDB _id and bio
                try {
                    await dbConnect();
                    const providerId = provider === "github"
                        ? String((profile as unknown as GitHubProfile).id)
                        : (profile as unknown as GoogleProfile).sub;

                    const dbUser = await UserModel.findOne({ providerId, provider });
                    if (dbUser) {
                        token.userId = dbUser._id.toString();
                        token.bio = dbUser.bio;

                        // First, revoke any existing sessions for the same device type (one device = one session)
                        await SessionModel.updateMany(
                            {
                                userId: dbUser._id,
                                deviceType: sessionInfo?.deviceType || "Unknown",
                                isRevoked: false,
                            },
                            { isRevoked: true }
                        );

                        const sessionToken = crypto.randomUUID();
                        token.sessionToken = sessionToken;

                        await SessionModel.create({
                            userId: dbUser._id,
                            sessionToken,
                            deviceType: sessionInfo?.deviceType || "Unknown",
                            ipAddress: sessionInfo?.ipAddress || null,
                            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user from database:", error);
                }
            }

            // Refresh bio from database on session update
            if (trigger === "update" && token.userId) {
                try {
                    await dbConnect();
                    const dbUser = await UserModel.findById(token.userId);
                    if (dbUser) {
                        token.bio = dbUser.bio;
                    }
                } catch (error) {
                    console.error("Error refreshing user data:", error);
                }
            }

            return token;
        },

        async session({ session, token }) {
            // Check if session is revoked in database
            if (token.sessionToken) {
                try {
                    await dbConnect();
                    const dbSession = await SessionModel.findOne({
                        sessionToken: token.sessionToken,
                    });

                    if (dbSession?.isRevoked) {
                        // Return empty session to force logout
                        return {
                            ...session,
                            user: {},
                            expires: new Date(0).toISOString(),
                        };
                    }
                } catch (error) {
                    console.error("Error checking session revocation:", error);
                }
            }

            if (token.accessToken && typeof token.accessToken === "string") {
                session.accessToken = token.accessToken;
            }

            if (token.sessionToken && typeof token.sessionToken === "string") {
                session.sessionToken = token.sessionToken;
            }

            if (token.userId) {
                session.user.id = token.userId as string;
            }
            if (token.username) {
                session.user.username = token.username as string;
            }
            if (token.avatar_url) {
                session.user.avatar_url = token.avatar_url as string;
            }
            if (token.provider) {
                session.user.provider = token.provider as "github" | "google";
            }
            session.user.bio = (token.bio as string | null) ?? null;
            session.user.name = token.name ?? session.user.name ?? null;
            session.user.email = token.email ?? session.user.email ?? null;

            return session;
        },
    },
};

// Export NextAuth instance for use in server components and API routes
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
